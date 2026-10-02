# -*- coding: utf-8 -*-
from odoo import _, api, fields, models
from odoo.exceptions import UserError


class TekstilDefectType(models.Model):
    _name = "tekstil.defect.type"
    _description = "Tekstil Nuqson Turlari (OTK Klassifikator)"

    name = fields.Char(string="Nuqson Nomi", required=True)
    code = fields.Char(string="Kodi")
    category = fields.Selection(
        [
            ("sewing", "Tikuv Nuqsoni (Chok, yoqa, overlog)"),
            ("fabric", "Mato Nuqsoni (Teshik, ip tortilishi, rang)"),
            ("stain", "Dog' / Yog' / Ifloslanish"),
            ("dimension", "O'lcham Nomutanosibligi"),
            ("trim", "Furnitura / Tugma / Zanjir Nuqsoni"),
            ("other", "Boshqa"),
        ],
        string="Kategoriya",
        default="sewing",
        required=True,
    )
    description = fields.Text(string="Tavsifi")


class TekstilQualityCheck(models.Model):
    _name = "tekstil.quality.check"
    _description = "Sifat Nazorati (OTK Qabuli)"
    _inherit = ["mail.thread", "mail.activity.mixin"]
    _order = "check_date desc, id desc"

    name = fields.Char(
        string="Nazorat Raqami",
        required=True,
        copy=False,
        default=lambda self: self.env["ir.sequence"].next_by_code("tekstil.quality.check") or _("QC-Yangi"),
        tracking=True,
    )
    batch_id = fields.Many2one(
        "tekstil.production.batch",
        string="Partiya (Kroy)",
        required=True,
        index=True,
        tracking=True,
    )
    product_id = fields.Many2one(
        related="batch_id.product_id",
        string="Mahsulot",
        store=True,
        readonly=True,
    )
    inspector_id = fields.Many2one(
        "hr.employee",
        string="OTK Nazoratchisi",
        required=True,
        default=lambda self: self.env["hr.employee"].search([], limit=1),
        tracking=True,
    )
    check_date = fields.Date(
        string="Tekshiruv Sanasi",
        default=fields.Date.context_today,
        required=True,
        tracking=True,
    )
    inspected_qty = fields.Float(
        string="Tekshirilgan Jami Soni (Dona)",
        required=True,
        default=100.0,
        tracking=True,
    )
    grade_1_qty = fields.Float(
        string="1-Nav (Eksport / A'lo)",
        default=95.0,
        tracking=True,
        help="Talablarga 100% javob beruvchi yuqori sifatli mahsulot",
    )
    grade_2_qty = fields.Float(
        string="2-Nav (Kichik Kamchilik)",
        default=3.0,
        tracking=True,
        help="Ko'zga tashlanmaydigan kichik kamchilik bilan arzonroq sotuvga o'tadigan mahsulot",
    )
    rework_qty = fields.Float(
        string="Qayta Ishlashga (Tuzatish)",
        default=2.0,
        tracking=True,
        help="Tikuvchiga chokni qayta tikish yoki ipni tozalash uchun qaytariladigan mahsulot",
    )
    reject_qty = fields.Float(
        string="Brak (Yaroqsiz)",
        default=0.0,
        tracking=True,
        help="Tuzatib bo'lmaydigan jiddiy nuqsonli mahsulot",
    )
    pass_rate = fields.Float(
        string="Sifat Darajasi (1-nav %)",
        compute="_compute_pass_rate",
        store=True,
    )
    defect_type_ids = fields.Many2many(
        "tekstil.defect.type",
        string="Aniqlangan Nuqson Turlari",
    )
    defect_note = fields.Text(string="OTK Xulosasi va Kamchiliklar")
    state = fields.Selection(
        [
            ("draft", "Kutilmoqda"),
            ("passed", "Qabul Qilindi (Sifatli)"),
            ("rework", "Tuzatishga Qaytarildi"),
            ("rejected", "Rad Etildi (Brak)"),
        ],
        string="Holat",
        default="draft",
        tracking=True,
    )

    @api.depends("inspected_qty", "grade_1_qty")
    def _compute_pass_rate(self):
        for rec in self:
            if rec.inspected_qty > 0:
                rec.pass_rate = (rec.grade_1_qty / rec.inspected_qty) * 100.0
            else:
                rec.pass_rate = 0.0

    def action_pass(self):
        for rec in self:
            rec.state = "passed"
            rec.batch_id.qc_passed_qty = rec.grade_1_qty
            rec.batch_id.qc_defect_qty = rec.grade_2_qty + rec.reject_qty
            # Agar partiya qc bosqichida bo'lsa, qadoqlashga o'tkazamiz
            if rec.batch_id.stage == "qc":
                rec.batch_id.stage = "packing"

    def action_rework(self):
        for rec in self:
            rec.state = "rework"
            # Tikuvchiga qaytarish
            if rec.batch_id.stage == "qc":
                rec.batch_id.stage = "sewing"

    def action_reject(self):
        for rec in self:
            rec.state = "rejected"
