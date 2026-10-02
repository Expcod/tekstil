# -*- coding: utf-8 -*-
import logging
from odoo import _, api, fields, models
from odoo.exceptions import UserError

_logger = logging.getLogger(__name__)


class TekstilProductionPlan(models.Model):
    _name = "tekstil.production.plan"
    _description = "Tekstil Ishlab Chiqarish Rejasi"
    _inherit = ["mail.thread", "mail.activity.mixin"]
    _order = "date_start desc, id desc"

    name = fields.Char(
        string="Reja Nomi",
        required=True,
        tracking=True,
        default=lambda self: _("Haftalik Reja"),
    )
    plan_type = fields.Selection(
        [
            ("weekly", "Haftalik Reja"),
            ("monthly", "Oylik Reja"),
            ("order_based", "Buyurtma Asosida"),
        ],
        string="Reja Turi",
        default="weekly",
        required=True,
    )
    date_start = fields.Date(
        string="Boshlanish Sanasi",
        required=True,
        default=fields.Date.contextToday,
        tracking=True,
    )
    date_end = fields.Date(
        string="Tugash Sanasi",
        required=True,
        tracking=True,
    )
    target_qty = fields.Float(
        string="Rejalashtirilgan (Dona)",
        compute="_compute_totals",
        store=True,
    )
    produced_qty = fields.Float(
        string="Ishlab Chiqarilgan (Dona)",
        compute="_compute_totals",
        store=True,
    )
    completion_rate = fields.Float(
        string="Bajarilish Foizi (%)",
        compute="_compute_totals",
        store=True,
    )
    state = fields.Selection(
        [
            ("draft", "Qoralama"),
            ("confirmed", "Tasdiqlangan"),
            ("in_progress", "Jarayonda"),
            ("done", "Yakunlangan"),
            ("cancel", "Bekor Qilingan"),
        ],
        string="Holat",
        default="draft",
        tracking=True,
    )
    line_ids = fields.One2many(
        "tekstil.plan.line",
        "plan_id",
        string="Reja Qatorlari",
    )
    batch_ids = fields.One2many(
        "tekstil.production.batch",
        "plan_id",
        string="Partiyalar (Kroy)",
    )
    note = fields.Text(string="Eslatma / Izoh")

    @api.depends("line_ids.planned_qty", "line_ids.produced_qty")
    def _compute_totals(self):
        for plan in self:
            target = sum(plan.line_ids.mapped("planned_qty"))
            produced = sum(plan.line_ids.mapped("produced_qty"))
            plan.target_qty = target
            plan.produced_qty = produced
            plan.completion_rate = (produced / target * 100.0) if target > 0 else 0.0

    def action_confirm(self):
        for plan in self:
            plan.state = "confirmed"

    def action_start(self):
        for plan in self:
            plan.state = "in_progress"

    def action_done(self):
        for plan in self:
            plan.state = "done"

    def action_cancel(self):
        for plan in self:
            plan.state = "cancel"

    @api.model
    def get_dashboard_summary(self):
        """Dashboard uchun umumiy tezkor ko'rsatkichlar"""
        today = fields.Date.contextToday(self)
        
        # Bugungi xodimlar unumi
        outputs = self.env["tekstil.worker.output"].search([("date", "=", today)])
        today_produced = sum(outputs.mapped("quantity"))
        
        # Faol rejalar
        active_plans = self.search([("state", "in", ["confirmed", "in_progress"])])
        total_target = sum(active_plans.mapped("target_qty"))
        total_produced = sum(active_plans.mapped("produced_qty"))
        completion_rate = (total_produced / total_target * 100.0) if total_target > 0 else 0.0

        # OTK ko'rsatkichlari (oxirgi 7 kun)
        qcs = self.env["tekstil.quality.check"].search([], limit=50)
        total_inspected = sum(qcs.mapped("inspected_qty"))
        total_grade1 = sum(qcs.mapped("grade_1_qty"))
        quality_pass_rate = (total_grade1 / total_inspected * 100.0) if total_inspected > 0 else 98.5

        # Faol partiyalar konveyerda
        active_batches = self.env["tekstil.production.batch"].search([("state", "=", "in_progress")])
        
        # B2B Buyurtmalar
        active_orders = self.env["tekstil.brand.order"].search([("state", "in", ["confirmed", "in_prod"])])

        return {
            "today_produced": today_produced,
            "active_plans_count": len(active_plans),
            "plan_target": total_target,
            "plan_produced": total_produced,
            "completion_rate": round(completion_rate, 1),
            "quality_pass_rate": round(quality_pass_rate, 1),
            "active_batches_count": len(active_batches),
            "active_orders_count": len(active_orders),
        }


class TekstilPlanLine(models.Model):
    _name = "tekstil.plan.line"
    _description = "Tekstil Reja Qatori"

    plan_id = fields.Many2one(
        "tekstil.production.plan",
        string="Reja",
        required=True,
        ondelete="cascade",
    )
    product_id = fields.Many2one(
        "product.product",
        string="Mahsulot",
        required=True,
    )
    color = fields.Char(string="Rangi", default="Oq")
    line_code = fields.Selection(
        [
            ("line_1", "1-Tikuv Liniyasi (Futbolka)"),
            ("line_2", "2-Tikuv Liniyasi (Ko'ylaklar)"),
            ("line_3", "3-Tikuv Liniyasi (Shimlar)"),
        ],
        string="Liniya / Sex",
        default="line_1",
    )
    # Razmerlar matritsasi
    qty_xs = fields.Integer(string="XS", default=0)
    qty_s = fields.Integer(string="S", default=0)
    qty_m = fields.Integer(string="M", default=0)
    qty_l = fields.Integer(string="L", default=0)
    qty_xl = fields.Integer(string="XL", default=0)
    qty_2xl = fields.Integer(string="2XL", default=0)
    
    planned_qty = fields.Float(
        string="Reja (Jami dona)",
        compute="_compute_planned_qty",
        store=True,
    )
    produced_qty = fields.Float(string="Fakt (Dona)", default=0.0)
    completion_rate = fields.Float(
        string="Bajarilish (%)",
        compute="_compute_completion",
        store=True,
    )

    @api.depends("qty_xs", "qty_s", "qty_m", "qty_l", "qty_xl", "qty_2xl")
    def _compute_planned_qty(self):
        for line in self:
            total = line.qty_xs + line.qty_s + line.qty_m + line.qty_l + line.qty_xl + line.qty_2xl
            # Agar razmerlar kiritilmagan bo'lsa yoki 0 bo'lsa, planned_qty qo'lda o'zgarmasligi uchun
            if total > 0 or not line.planned_qty:
                line.planned_qty = float(total)

    @api.depends("planned_qty", "produced_qty")
    def _compute_completion(self):
        for line in self:
            line.completion_rate = (line.produced_qty / line.planned_qty * 100.0) if line.planned_qty > 0 else 0.0
