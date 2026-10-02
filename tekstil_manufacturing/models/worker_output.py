# -*- coding: utf-8 -*-
from odoo import _, api, fields, models
from odoo.exceptions import UserError


class TekstilWorkerOutput(models.Model):
    _name = "tekstil.worker.output"
    _description = "Xodimlar Ishlab Chiqargan Mahsulotlar (Planshet Kiritmasi)"
    _order = "datetime desc, id desc"

    employee_id = fields.Many2one(
        "hr.employee",
        string="Xodim / Usta",
        required=True,
        index=True,
    )
    department = fields.Selection(
        [
            ("cutting", "Bichuv"),
            ("sewing", "Tikuv"),
            ("ironing", "Dazmol & Tozalash"),
            ("qc", "Sifat Nazorati (OTK)"),
            ("packing", "Qadoqlash"),
        ],
        string="Bo'lim / Sex",
        required=True,
        default="sewing",
    )
    batch_id = fields.Many2one(
        "tekstil.production.batch",
        string="Partiya (Kroy)",
        required=True,
        index=True,
    )
    product_id = fields.Many2one(
        related="batch_id.product_id",
        string="Mahsulot",
        store=True,
        readonly=True,
    )
    operation_name = fields.Char(
        string="Operatsiya Nomi",
        required=True,
        default="Asosiy tikuv / yig'ish",
        help="Masalan: Old-orqa biriktirish, Yoqa o'tkazish, Overlog, Tugma qadash",
    )
    quantity = fields.Float(
        string="Bajarilgan Soni (Dona)",
        required=True,
        default=1.0,
    )
    piece_rate = fields.Float(
        string="1 dona tarifi (so'm)",
        default=1500.0,
        help="Ushbu operatsiya uchun donabay to'lanadigan ish haqi",
    )
    total_wage = fields.Float(
        string="Jami Ish Haqi (so'm)",
        compute="_compute_wage",
        store=True,
    )
    date = fields.Date(
        string="Sana",
        default=fields.Date.contextToday,
        required=True,
        index=True,
    )
    datetime = fields.Datetime(
        string="Vaqti",
        default=fields.Datetime.now,
        required=True,
    )
    note = fields.Char(string="Izoh")

    @api.depends("quantity", "piece_rate")
    def _compute_wage(self):
        for rec in self:
            rec.total_wage = rec.quantity * rec.piece_rate

    @api.model
    def register_tablet_output(self, employee_id, batch_id, operation_name, quantity, department="sewing", piece_rate=1500.0):
        """Planshetdan (Kiosk) bitta tugma bilan natija kiritish"""
        batch = self.env["tekstil.production.batch"].browse(batch_id)
        if not batch.exists():
            raise UserError(_("Partiya topilmadi!"))
        
        output = self.create({
            "employee_id": employee_id,
            "batch_id": batch_id,
            "department": department,
            "operation_name": operation_name,
            "quantity": quantity,
            "piece_rate": piece_rate,
            "date": fields.Date.contextToday(self),
            "datetime": fields.Datetime.now(),
        })

        # Partiya natijasini yangilash
        if department == "cutting":
            batch.cutting_qty += quantity
        elif department == "sewing":
            batch.sewing_qty += quantity
        elif department == "ironing":
            batch.ironing_qty += quantity
        elif department == "packing":
            batch.packed_qty += quantity

        return {
            "success": True,
            "output_id": output.id,
            "message": _("%(qty)s dona muvaffaqiyatli saqlandi!", qty=int(quantity)),
        }
