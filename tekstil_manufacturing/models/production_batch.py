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

    def action_start(self):
        for rec in self:
            rec.state = "in_progress"
            if not rec.cutting_qty:
                rec.cutting_qty = rec.quantity

    def action_next_stage(self):
        """Partiyani keyingi bosqichga o'tkazish"""
        stage_order = ["cutting", "sewing", "subcontract", "ironing", "qc", "packing", "done"]
        for rec in self:
            current_idx = stage_order.index(rec.stage)
            if current_idx < len(stage_order) - 1:
                next_stage = stage_order[current_idx + 1]
                rec.stage = next_stage
                if next_stage == "done":
                    rec.state = "done"
                    if not rec.packed_qty:
                        rec.packed_qty = rec.qc_passed_qty or rec.quantity
