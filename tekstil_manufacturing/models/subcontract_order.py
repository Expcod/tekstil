# -*- coding: utf-8 -*-
from odoo import _, api, fields, models
from odoo.exceptions import UserError


class TekstilSubcontractOrder(models.Model):
    _name = "tekstil.subcontract.order"
    _description = "Sub-pudrat Buyurtmasi (Tashqi Xizmatlar: Bosma/Kashta)"
    _inherit = ["mail.thread", "mail.activity.mixin"]
    _order = "date_sent desc, id desc"

    name = fields.Char(
        string="Sub-pudrat Kodi",
        required=True,
        copy=False,
        default=lambda self: self.env["ir.sequence"].next_by_code("tekstil.subcontract.order") or _("SUB-Yangi"),
        tracking=True,
    )
    partner_id = fields.Many2one(
        "res.partner",
        string="Sub-pudratchi Korxona",
        required=True,
        tracking=True,
    )
    service_type = fields.Selection(
        [
            ("printing", "Ipak Bosma / DTF Print"),
            ("embroidery", "Kashtachilik (Embroidery)"),
            ("dyeing", "Matoni Bo'yash / Rang berish"),
            ("washing", "Kiyimni Yuvish / Varka / Silikon"),
            ("pleating", "Plisse / Maxsus ishlov"),
        ],
        string="Xizmat Turi",
        required=True,
        default="printing",
        tracking=True,
    )
    batch_id = fields.Many2one(
        "tekstil.production.batch",
        string="Partiya (Kroy)",
        required=True,
    )
    sent_qty = fields.Float(
        string="Yuborilgan Soni (Dona)",
        required=True,
        default=100.0,
        tracking=True,
    )
    received_qty = fields.Float(
        string="Qabul Qilingan Soni (Dona)",
        default=0.0,
        tracking=True,
    )
    defect_qty = fields.Float(
        string="Brak / Yo'qotish (Dona)",
        compute="_compute_defect",
        store=True,
    )
    cost_per_unit = fields.Float(
        string="1 dona xizmat narxi (so'm)",
        default=3500.0,
    )
    total_cost = fields.Float(
        string="Jami Xizmat Qiymati (so'm)",
        compute="_compute_cost",
        store=True,
    )
    date_sent = fields.Date(
        string="Yuborilgan Sana",
        default=fields.Date.contextToday,
        required=True,
    )
    date_expected = fields.Date(
        string="Kutilayotgan Qaytish Sanasi",
        required=True,
    )
    date_received = fields.Date(string="Haqiqiy Qabul Sanasi")
    state = fields.Selection(
        [
            ("draft", "Rejalashtirilgan"),
            ("sent", "Tashqariga Yuborilgan"),
            ("received", "Qabul Qilindi (Sexga Qaytdi)"),
            ("cancel", "Bekor Qilingan"),
        ],
        string="Holat",
        default="draft",
        tracking=True,
    )
    note = fields.Text(string="Dizayn / Talab / Izoh")

    @api.depends("sent_qty", "received_qty")
    def _compute_defect(self):
        for rec in self:
            if rec.received_qty > 0 and rec.sent_qty > rec.received_qty:
                rec.defect_qty = rec.sent_qty - rec.received_qty
            else:
                rec.defect_qty = 0.0

    @api.depends("received_qty", "sent_qty", "cost_per_unit")
    def _compute_cost(self):
        for rec in self:
            base_qty = rec.received_qty if rec.received_qty > 0 else rec.sent_qty
            rec.total_cost = base_qty * rec.cost_per_unit

    def action_send(self):
        for rec in self:
            rec.state = "sent"
            if rec.batch_id:
                rec.batch_id.stage = "subcontract"

    def action_receive(self):
        for rec in self:
            rec.state = "received"
            rec.date_received = fields.Date.contextToday(rec)
            if not rec.received_qty:
                rec.received_qty = rec.sent_qty
            # Partiyani dazmol bosqichiga o'tkazish
            if rec.batch_id and rec.batch_id.stage == "subcontract":
                rec.batch_id.stage = "ironing"
