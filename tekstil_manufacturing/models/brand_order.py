# -*- coding: utf-8 -*-
from odoo import _, api, fields, models
from odoo.exceptions import UserError


class TekstilBrandOrder(models.Model):
    _name = "tekstil.brand.order"
    _description = "B2B Brand Buyurtmasi (OEM / Private Label)"
    _inherit = ["mail.thread", "mail.activity.mixin"]
    _order = "delivery_date asc, id desc"

    name = fields.Char(
        string="Buyurtma Kodi",
        required=True,
        copy=False,
        default=lambda self: self.env["ir.sequence"].next_by_code("tekstil.brand.order") or _("ORD-Yangi"),
        tracking=True,
    )
    partner_id = fields.Many2one(
        "res.partner",
        string="Buyurtmachi (Mijoz)",
        required=True,
        tracking=True,
    )
    brand_name = fields.Char(
        string="Brand Nomi",
        required=True,
        help="Mahsulot ustiga qadaladigan yoki chiqariladigan mijoz brendi (Terra Pro, Just va h.k.)",
        tracking=True,
    )
    product_id = fields.Many2one(
        "product.product",
        string="Kiyim Modeli",
        required=True,
    )
    color = fields.Char(string="Rangi", default="Qora")
    
    # O'lchamlar
    qty_xs = fields.Integer(string="XS", default=0)
    qty_s = fields.Integer(string="S", default=0)
    qty_m = fields.Integer(string="M", default=0)
    qty_l = fields.Integer(string="L", default=0)
    qty_xl = fields.Integer(string="XL", default=0)
    qty_2xl = fields.Integer(string="2XL", default=0)

    total_qty = fields.Float(
        string="Jami Miqdor (Dona)",
        compute="_compute_totals",
        store=True,
    )
    unit_price = fields.Float(
        string="1 dona narxi (so'm)",
        default=45000.0,
    )
    total_amount = fields.Float(
        string="Jami Shartnoma Qiymati (so'm)",
        compute="_compute_totals",
        store=True,
    )
    delivery_date = fields.Date(
        string="Topshirish Muddati (Deadline)",
        required=True,
        tracking=True,
    )
    produced_qty = fields.Float(
        string="Tayyor Bo'lgan Miqdor",
        default=0.0,
        tracking=True,
    )
    completion_rate = fields.Float(
        string="Bajarilish (%)",
        compute="_compute_completion",
        store=True,
    )
    state = fields.Selection(
        [
            ("draft", "Kelishuvda"),
            ("confirmed", "Tasdiqlangan"),
            ("in_prod", "Ishlab Chiqarishda"),
            ("ready", "Tayyor (Omborda)"),
            ("shipped", "Yuklab Yuborilgan"),
            ("cancel", "Bekor Qilingan"),
        ],
        string="Holat",
        default="draft",
        tracking=True,
    )
    batch_ids = fields.One2many(
        "tekstil.production.batch",
        "brand_order_id",
        string="Bog'langan Partiyalar",
    )
    note = fields.Text(string="Talablar va Texnik Shartlar")

    @api.depends("qty_xs", "qty_s", "qty_m", "qty_l", "qty_xl", "qty_2xl", "unit_price")
    def _compute_totals(self):
        for rec in self:
            total = rec.qty_xs + rec.qty_s + rec.qty_m + rec.qty_l + rec.qty_xl + rec.qty_2xl
            rec.total_qty = float(total)
            rec.total_amount = rec.total_qty * rec.unit_price

    @api.depends("total_qty", "produced_qty")
    def _compute_completion(self):
        for rec in self:
            rec.completion_rate = (rec.produced_qty / rec.total_qty * 100.0) if rec.total_qty > 0 else 0.0

    def action_confirm(self):
        for rec in self:
            rec.state = "confirmed"

    def action_in_prod(self):
        for rec in self:
            rec.state = "in_prod"

    def action_ready(self):
        for rec in self:
            rec.state = "ready"
            rec.produced_qty = rec.total_qty

    def action_ship(self):
        for rec in self:
            rec.state = "shipped"
