# -*- coding: utf-8 -*-
from odoo import _, api, fields, models
from odoo.exceptions import UserError


class TekstilDashboardService(models.AbstractModel):
    _name = "tekstil.dashboard.service"
    _description = "Tekstil Dashboard & Planshet API Xizmati"

    @api.model
    def get_dashboard_data(self):
        """Barcha dashboard va planshet ma'lumotlarini 1 ta tezkor RPC da qaytaradi"""
        today = fields.Date.contextToday(self)
        
        # 1. Umumiy KPI ko'rsatkichlar
        today_outputs = self.env["tekstil.worker.output"].search([("date", "=", today)])
        today_produced = sum(today_outputs.mapped("quantity"))
        
        active_plans = self.env["tekstil.production.plan"].search([("state", "in", ["confirmed", "in_progress"])])
        plan_target = sum(active_plans.mapped("target_qty"))
        plan_produced = sum(active_plans.mapped("produced_qty"))
        plan_rate = (plan_produced / plan_target * 100.0) if plan_target > 0 else 0.0

        all_qcs = self.env["tekstil.quality.check"].search([], limit=100)
        total_inspected = sum(all_qcs.mapped("inspected_qty"))
        total_grade1 = sum(all_qcs.mapped("grade_1_qty"))
        total_grade2 = sum(all_qcs.mapped("grade_2_qty"))
        total_reject = sum(all_qcs.mapped("reject_qty"))
        total_rework = sum(all_qcs.mapped("rework_qty"))
        pass_rate = (total_grade1 / total_inspected * 100.0) if total_inspected > 0 else 98.2

        active_batches = self.env["tekstil.production.batch"].search([("state", "!=", "cancel")], order="id desc", limit=30)
        active_orders = self.env["tekstil.brand.order"].search([("state", "!=", "cancel")], order="delivery_date asc", limit=20)
        subcontracts = self.env["tekstil.subcontract.order"].search([], order="date_sent desc", limit=20)

        # 2. Xodimlar unumi (Bugungi reyting va ishbay haq)
        worker_summary = {}
        for out in today_outputs:
            emp_id = out.employee_id.id
            if emp_id not in worker_summary:
                worker_summary[emp_id] = {
                    "id": emp_id,
                    "name": out.employee_id.name,
                    "job_title": out.employee_id.job_title or "Tikuvchi",
                    "department": out.department,
                    "quantity": 0,
                    "total_wage": 0,
                }
            worker_summary[emp_id]["quantity"] += out.quantity
            worker_summary[emp_id]["total_wage"] += out.total_wage

        workers_list = sorted(list(worker_summary.values()), key=lambda x: x["quantity"], reverse=True)

        # 3. Xodimlar ro'yxati (Planshet uchun)
        all_employees = self.env["hr.employee"].search([], order="name asc")
        employee_data = [
            {
                "id": emp.id,
                "name": emp.name,
                "job_title": emp.job_title or "Ishchi",
                "department_name": emp.department_id.name or "Tikuv sexi",
            }
            for emp in all_employees
        ]

        # 4. Partiyalar ro'yxati
        batch_data = []
        stage_labels = dict(self.env["tekstil.production.batch"]._fields["stage"].selection)
        for b in active_batches:
            batch_data.append({
                "id": b.id,
                "name": b.name,
                "product_name": b.product_id.display_name,
                "product_id": b.product_id.id,
                "color": b.color or "",
                "roll_number": b.roll_number or "-",
                "quantity": int(b.quantity),
                "stage": b.stage,
                "stage_label": stage_labels.get(b.stage, b.stage),
                "current_worker": b.current_worker_id.name if b.current_worker_id else "Biriktirilmagan",
                "brand_order": b.brand_order_id.brand_name if b.brand_order_id else "",
                "cutting_qty": int(b.cutting_qty),
                "sewing_qty": int(b.sewing_qty),
                "ironing_qty": int(b.ironing_qty),
                "qc_passed_qty": int(b.qc_passed_qty),
                "packed_qty": int(b.packed_qty),
                "state": b.state,
            })

        # 5. Sifat nazorati yozuvlari
        qc_data = []
        for q in all_qcs[:25]:
            qc_data.append({
                "id": q.id,
                "name": q.name,
                "batch_name": q.batch_id.name,
                "product_name": q.product_id.display_name if q.product_id else "-",
                "inspector": q.inspector_id.name,
                "check_date": str(q.check_date),
                "inspected_qty": int(q.inspected_qty),
                "grade_1_qty": int(q.grade_1_qty),
                "grade_2_qty": int(q.grade_2_qty),
                "rework_qty": int(q.rework_qty),
                "reject_qty": int(q.reject_qty),
                "pass_rate": round(q.pass_rate, 1),
                "state": q.state,
                "defects": ", ".join(q.defect_type_ids.mapped("name")) if q.defect_type_ids else "Nuqsonsiz",
                "note": q.defect_note or "",
            })

        # 6. Rejalar
        plan_data = []
        for p in active_plans:
            lines = []
            for l in p.line_ids:
                lines.append({
                    "id": l.id,
                    "product_name": l.product_id.display_name,
                    "color": l.color or "Oq",
                    "line_code": l.line_code,
                    "sizes": f"S:{l.qty_s} M:{l.qty_m} L:{l.qty_l} XL:{l.qty_xl}",
                    "planned_qty": int(l.planned_qty),
                    "produced_qty": int(l.produced_qty),
                    "completion_rate": round(l.completion_rate, 1),
                })
            plan_data.append({
                "id": p.id,
                "name": p.name,
                "date_start": str(p.date_start),
                "date_end": str(p.date_end),
                "target_qty": int(p.target_qty),
                "produced_qty": int(p.produced_qty),
                "completion_rate": round(p.completion_rate, 1),
                "state": p.state,
                "lines": lines,
            })

        # 7. B2B Brand buyurtmalari
        brand_data = []
        for o in active_orders:
            brand_data.append({
                "id": o.id,
                "name": o.name,
                "partner_name": o.partner_id.name,
                "brand_name": o.brand_name,
                "product_name": o.product_id.display_name,
                "color": o.color or "-",
                "sizes": f"S:{o.qty_s} M:{o.qty_m} L:{o.qty_l} XL:{o.qty_xl}",
                "total_qty": int(o.total_qty),
                "produced_qty": int(o.produced_qty),
                "completion_rate": round(o.completion_rate, 1),
                "total_amount": o.total_amount,
                "delivery_date": str(o.delivery_date),
                "state": o.state,
            })

        # 8. Sub-pudrat
        subcontract_data = []
        service_labels = dict(self.env["tekstil.subcontract.order"]._fields["service_type"].selection)
        for s in subcontracts:
            subcontract_data.append({
                "id": s.id,
                "name": s.name,
                "partner_name": s.partner_id.name,
                "service_label": service_labels.get(s.service_type, s.service_type),
                "batch_name": s.batch_id.name,
                "sent_qty": int(s.sent_qty),
                "received_qty": int(s.received_qty),
                "defect_qty": int(s.defect_qty),
                "date_sent": str(s.date_sent),
                "date_expected": str(s.date_expected),
                "state": s.state,
            })

        # 9. Nuqson turlari
        defect_types = self.env["tekstil.defect.type"].search([])
        defects_list = [{"id": d.id, "name": d.name, "category": d.category} for d in defect_types]

        # 10. Mahsulotlar (Kiyimlar)
        products = self.env["product.product"].search([("sale_ok", "=", True)], limit=30)
        product_list = [{"id": pr.id, "name": pr.display_name} for pr in products]

        return {
            "stats": {
                "today_produced": int(today_produced),
                "plan_target": int(plan_target),
                "plan_produced": int(plan_produced),
                "plan_rate": round(plan_rate, 1),
                "quality_pass_rate": round(pass_rate, 1),
                "qc_totals": {
                    "inspected": int(total_inspected),
                    "grade_1": int(total_grade1),
                    "grade_2": int(total_grade2),
                    "rework": int(total_rework),
                    "reject": int(total_reject),
                },
                "active_batches_count": len(active_batches),
                "active_orders_count": len(active_orders),
            },
            "plans": plan_data,
            "batches": batch_data,
            "qc_checks": qc_data,
            "worker_outputs": workers_list,
            "employees": employee_data,
            "brand_orders": brand_data,
            "subcontracts": subcontract_data,
            "defect_types": defects_list,
            "products": product_list,
        }

    @api.model
    def tablet_submit_output(self, employee_id, batch_id, operation_name, quantity, department="sewing", piece_rate=1500.0):
        """Planshetdan xodim natijasini saqlash"""
        return self.env["tekstil.worker.output"].register_tablet_output(
            employee_id=employee_id,
            batch_id=batch_id,
            operation_name=operation_name,
            quantity=quantity,
            department=department,
            piece_rate=piece_rate,
        )

    @api.model
    def qc_submit_check(self, batch_id, inspected_qty, grade_1_qty, grade_2_qty, rework_qty, reject_qty, defect_type_ids=None, note=""):
        """OTK Sifat nazoratini tezkor kiritish"""
        batch = self.env["tekstil.production.batch"].browse(batch_id)
        if not batch.exists():
            raise UserError(_("Partiya topilmadi!"))

        qc = self.env["tekstil.quality.check"].create({
            "batch_id": batch_id,
            "inspected_qty": inspected_qty,
            "grade_1_qty": grade_1_qty,
            "grade_2_qty": grade_2_qty,
            "rework_qty": rework_qty,
            "reject_qty": reject_qty,
            "defect_type_ids": [(6, 0, defect_type_ids or [])],
            "defect_note": note,
            "state": "passed" if grade_1_qty >= (inspected_qty * 0.9) else "rework",
        })
        qc.action_pass() if qc.state == "passed" else qc.action_rework()

        return {
            "success": True,
            "qc_id": qc.id,
            "pass_rate": round(qc.pass_rate, 1),
            "message": _("OTK tekshiruvi saqlandi! Sifat darajasi: %s%%", round(qc.pass_rate, 1)),
        }

    @api.model
    def batch_move_next_stage(self, batch_id):
        """Partiyani konveyer bo'yicha keyingi bosqichga o'tkazish"""
        batch = self.env["tekstil.production.batch"].browse(batch_id)
        if not batch.exists():
            raise UserError(_("Partiya topilmadi!"))
        batch.action_next_stage()
        return {"success": True, "new_stage": batch.stage}
