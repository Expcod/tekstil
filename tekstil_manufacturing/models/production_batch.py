# -*- coding: utf-8 -*-
from odoo import _, api, fields, models
from odoo.exceptions import UserError


class TekstilProductionBatch(models.Model):
    _name = "tekstil.production.batch"
    _description = "Tekstil Partiya (Kroy / Konveyer kartasi)"
    _inherit = ["mail.thread", "mail.activity.mixin"]
    _order = "create_date desc, id desc"

    name = fields.Char(
        string="Partiya Raqami",
        required=True,
        copy=False,
        default=lambda self: self.env["ir.sequence"].next_by_code("tekstil.batch") or _("Yangi Partiya"),
        tracking=True,
    )
    product_id = fields.Many2one(
        "product.product",
        string="Mahsulot",
        required=True,
        tracking=True,
    )
    plan_id = fields.Many2one(
        "tekstil.production.plan",
        string="Reja",
        ondelete="set null",
    )
    brand_order_id = fields.Many2one(
        "tekstil.brand.order",
        string="B2B Brand Buyurtmasi",
        ondelete="set null",
    )
    color = fields.Char(string="Rangi", default="Oq")
    size_breakdown = fields.Char(
        string="Razmerlar",
        help="Masalan: S:100, M:200, L:150, XL:50",
    )
    roll_number = fields.Char(
        string="Rulon / Mato Partiyasi",
        help="Masalan: RUL-8842 / Paxta 100%",
    )
    fabric_used_kg = fields.Float(
        string="Sarflangan Mato (kg/m)",
        help="Ushbu partiyaga bichuvda sarflangan mato og'irligi yoki metri",
    )
    quantity = fields.Float(
        string="Bichilgan Soni (Dona)",
        required=True,
        default=100.0,
        tracking=True,
    )
    stage = fields.Selection(
        [
            ("cutting", "1. Bichuv"),
            ("sewing", "2. Tikuv"),
            ("subcontract", "3. Sub-pudrat (Bosma/Kashta)"),
            ("ironing", "4. Dazmol & Tozalash"),
            ("qc", "5. Sifat Nazorati (OTK)"),
            ("packing", "6. Qadoqlash"),
            ("done", "7. Tayyor Mahsulot Ombori"),
        ],
        string="Joriy Bosqich",
        default="cutting",
        tracking=True,
    )
    current_worker_id = fields.Many2one(
        "hr.employee",
        string="Mas'ul Usta / Brigadir",
        tracking=True,
    )
    line_code = fields.Selection(
        [
            ("line_1", "1-Liniya (Futbolka)"),
            ("line_2", "2-Liniya (Ko'ylaklar)"),
            ("line_3", "3-Liniya (Shimlar)"),
        ],
        string="Tikuv Liniyasi",
        default="line_1",
    )
    state = fields.Selection(
        [
            ("draft", "Yangi"),
            ("in_progress", "Konveyerda"),
            ("done", "Tugatilgan"),
            ("cancel", "Bekor"),
        ],
        string="Holat",
        default="draft",
        tracking=True,
    )
    
    # Bosqichlardagi natijalar
    cutting_qty = fields.Float(string="Bichuvda chiqdi", default=0.0)
    sewing_qty = fields.Float(string="Tikuvda bitdi", default=0.0)
    ironing_qty = fields.Float(string="Dazmollandi", default=0.0)
    qc_passed_qty = fields.Float(string="OTK O'tdi (1-nav)", default=0.0)
    qc_defect_qty = fields.Float(string="OTK Nuqsonli / 2-nav", default=0.0)
    packed_qty = fields.Float(string="Qadoqlandi", default=0.0)

    worker_output_ids = fields.One2many(
        "tekstil.worker.output",
        "batch_id",
        string="Xodimlar Yozuvlari",
    )
    quality_check_ids = fields.One2many(
        "tekstil.quality.check",
        "batch_id",
        string="OTK Tekshiruvlari",
    )

    stock_updated = fields.Boolean(string="Omborga kirim qilindi", default=False, copy=False)
    raw_consumed = fields.Boolean(string="Xomashyo hisobdan chiqarildi", default=False, copy=False)

    def _update_stock_finished_goods(self):
        """Partiya tugaganda Tayyor Mahsulot Omboriga (WH/Stock) real kirim qilish"""
        for rec in self:
            if rec.stock_updated:
                continue
            qty_to_add = rec.packed_qty or rec.qc_passed_qty or rec.quantity
            if qty_to_add <= 0 or not rec.product_id:
                continue

            warehouse = self.env["stock.warehouse"].search([("company_id", "=", self.env.company.id)], limit=1)
            stock_loc = warehouse.lot_stock_id if warehouse else self.env["stock.location"].search([("usage", "=", "internal")], limit=1)

            if stock_loc:
                self.env["stock.quant"]._update_available_quantity(
                    rec.product_id,
                    stock_loc,
                    qty_to_add,
                )
                rec.stock_updated = True
                rec.message_post(
                    body=_(
                        "✅ <b>Tayyor Mahsulot Omboriga Kirim Qilindi!</b><br/>"
                        "Mahsulot: %s<br/>"
                        "Miqdor: <b>%s dona</b><br/>"
                        "Ombor: %s<br/>"
                        "<i>Real ombor qoldig'i (stock.quant) oshirildi.</i>"
                    ) % (rec.product_id.display_name, int(qty_to_add), stock_loc.complete_name)
                )

    def _consume_raw_materials(self):
        """Bichuv boshlanganda sarflanadigan xomashyoni ombordan hisobdan chiqarish"""
        for rec in self:
            if rec.raw_consumed or not rec.product_id:
                continue

            bom = self.env["mrp.bom"].search([
                "|",
                ("product_id", "=", rec.product_id.id),
                ("product_tmpl_id", "=", rec.product_id.product_tmpl_id.id),
            ], limit=1)

            warehouse = self.env["stock.warehouse"].search([("company_id", "=", self.env.company.id)], limit=1)
            stock_loc = warehouse.lot_stock_id if warehouse else self.env["stock.location"].search([("usage", "=", "internal")], limit=1)

            if bom and stock_loc:
                consumed_notes = []
                for line in bom.bom_line_ids:
                    qty_needed = line.product_qty * rec.quantity
                    if line.product_id and qty_needed > 0:
                        self.env["stock.quant"]._update_available_quantity(
                            line.product_id,
                            stock_loc,
                            -qty_needed,
                        )
                        uom_name = line.product_id.uom_id.name or "birlik"
                        consumed_notes.append(f"{line.product_id.name}: {qty_needed:.1f} {uom_name}")

                rec.raw_consumed = True
                if consumed_notes:
                    rec.message_post(
                        body=_(
                            "✂️ <b>Bichuv boshlandi — Xomashyo sarflandi:</b><br/>%s"
                        ) % ("<br/>".join(consumed_notes))
                    )

    def action_start(self):
        for rec in self:
            rec.state = "in_progress"
            if not rec.cutting_qty:
                rec.cutting_qty = rec.quantity
            rec._consume_raw_materials()

    def action_next_stage(self):
        """Partiyani keyingi bosqichga o'tkazish va bosqichlar hisobotini to'ldirish"""
        stage_order = ["cutting", "sewing", "subcontract", "ironing", "qc", "packing", "done"]
        for rec in self:
            if rec.state == "draft":
                rec.action_start()

            current_idx = stage_order.index(rec.stage) if rec.stage in stage_order else 0
            if current_idx < len(stage_order) - 1:
                next_stage = stage_order[current_idx + 1]
                rec.stage = next_stage

                # Bosqichlardagi natijalarni avtomatik to'ldirish
                if next_stage in ["sewing", "subcontract"]:
                    if not rec.cutting_qty:
                        rec.cutting_qty = rec.quantity
                    if next_stage == "subcontract" and not rec.sewing_qty:
                        rec.sewing_qty = rec.cutting_qty or rec.quantity
                elif next_stage == "ironing":
                    if not rec.sewing_qty:
                        rec.sewing_qty = rec.cutting_qty or rec.quantity
                elif next_stage == "qc":
                    if not rec.ironing_qty:
                        rec.ironing_qty = rec.sewing_qty or rec.quantity
                elif next_stage == "packing":
                    if not rec.qc_passed_qty:
                        rec.qc_passed_qty = rec.ironing_qty or rec.quantity
                elif next_stage == "done":
                    rec.state = "done"
                    if not rec.packed_qty:
                        rec.packed_qty = rec.qc_passed_qty or rec.ironing_qty or rec.quantity
                    rec._update_stock_finished_goods()

    def action_previous_stage(self):
        """Partiyani oldingi bosqichga qaytarish"""
        stage_order = ["cutting", "sewing", "subcontract", "ironing", "qc", "packing", "done"]
        for rec in self:
            if rec.stage in stage_order:
                current_idx = stage_order.index(rec.stage)
                if current_idx > 0:
                    prev_stage = stage_order[current_idx - 1]
                    rec.stage = prev_stage
                    if rec.state == "done":
                        rec.state = "in_progress"
