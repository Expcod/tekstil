# -*- coding: utf-8 -*-
"""
Tekstil Demo Ma'lumotlarini Odoo 19 ga yuklash skripti
"""
import xmlrpc.client
from datetime import date, timedelta

URL = "https://demo.novaodoo.uz"
DB = "tekstil"
USER = "tekstil"
API_KEY = "9aad71bb0549141309df7a4fb98d65c38bc747af"

common = xmlrpc.client.ServerProxy(f"{URL}/xmlrpc/2/common")
uid = common.authenticate(DB, USER, API_KEY, {})
print(f"Authenticated UID: {uid}")

models = xmlrpc.client.ServerProxy(f"{URL}/xmlrpc/2/object")


def execute(model, method, *args, **kwargs):
    return models.execute_kw(DB, uid, API_KEY, model, method, args, kwargs)


today = date.today()

# --------------------------------------------------------------------------
# 1. HAMKORLAR / B2B BRANDLAR VA SUB-PUDRATCHILAR
# --------------------------------------------------------------------------
partners_data = [
    {"name": "Terra Pro MChJ", "customer_rank": 1, "supplier_rank": 0, "phone": "+998 71 200-11-22", "email": "b2b@terrapro.uz", "comment": "Yirik erkaklar kiyimi brendi"},
    {"name": "Just Brands O'zbekiston", "customer_rank": 1, "supplier_rank": 0, "phone": "+998 71 200-33-44", "email": "orders@just.uz", "comment": "Casual kiyimlar tarmog'i"},
    {"name": "D&M Collection", "customer_rank": 1, "supplier_rank": 0, "phone": "+998 90 123-45-67", "email": "info@dm-collection.uz", "comment": "Ayollar liboslari butiklar tarmog'i"},
    {"name": "Novatex Fashion Export", "customer_rank": 1, "supplier_rank": 0, "phone": "+998 97 777-88-99", "email": "export@novatex.uz", "comment": "MDH va Yevropa eksport hamkori"},
    {"name": "SilkPrint Master MChJ", "customer_rank": 0, "supplier_rank": 1, "phone": "+998 90 999-00-11", "email": "silkprint@mail.uz", "comment": "Ipak bosma va DTF print sexi (Sub-pudrat)"},
    {"name": "Zarafshon Kashtachilik MChJ", "customer_rank": 0, "supplier_rank": 1, "phone": "+998 93 555-44-33", "email": "embroidery@zarafshon.uz", "comment": "Kompyuterli kashtachilik (Sub-pudrat)"},
]

partner_ids = {}
for p in partners_data:
    existing = execute("res.partner", "search", [["name", "=", p["name"]]])
    if existing:
        pid = existing[0]
    else:
        pid = execute("res.partner", "create", p)
    partner_ids[p["name"]] = pid
print(f"Partners created: {len(partner_ids)}")

# --------------------------------------------------------------------------
# 2. XODIMLAR (HR EMPLOYEES)
# --------------------------------------------------------------------------
employees_data = [
    {"name": "Azizbek Karimov", "job_title": "Bosh Bichuvchi / Lekalochi"},
    {"name": "Malika Rahimova", "job_title": "1-Tikuv Liniyasi Brigadiri"},
    {"name": "Dilnoza Komilova", "job_title": "Tikuvchi-Usta (Yoqa bo'yicha)"},
    {"name": "Shahnoza Yusupova", "job_title": "Tikuvchi-Usta (Overlog)"},
    {"name": "Nodira Umarova", "job_title": "Bosh OTK Nazoratchisi"},
    {"name": "Sardor Aliyev", "job_title": "Dazmol va Qadoqlash Ustasi"},
    {"name": "Jasur Tursunov", "job_title": "Sub-pudrat Koordinatori"},
]

employee_ids = {}
for emp in employees_data:
    existing = execute("hr.employee", "search", [["name", "=", emp["name"]]])
    if existing:
        eid = existing[0]
    else:
        eid = execute("hr.employee", "create", emp)
    employee_ids[emp["name"]] = eid
print(f"Employees created: {len(employee_ids)}")

# --------------------------------------------------------------------------
# 3. MAHSULOTLAR (PRODUCT TEMPLATE & VARIANTS)
# --------------------------------------------------------------------------
# Birliklar (UoM)
kg_uom = execute("uom.uom", "search", [["name", "ilike", "kg"]], limit=1)
kg_id = kg_uom[0] if kg_uom else 1
unit_uom = execute("uom.uom", "search", [["name", "ilike", "Units"]], limit=1)
unit_id = unit_uom[0] if unit_uom else 1
m_uom = execute("uom.uom", "search", [["name", "ilike", "m"]], limit=1)
m_id = m_uom[0] if m_uom else 1

products_raw = [
    {"name": "Suprim Paxta Mato 100% (Oq, 180 gr/m2)", "type": "consu", "list_price": 52000, "standard_price": 45000, "uom_id": kg_id},
    {"name": "Ko'ylaklik Paxta Poplin Mato (Oq)", "type": "consu", "list_price": 28000, "standard_price": 22000, "uom_id": m_id},
    {"name": "Shtapel Viskoza Mato (Gulli bosma)", "type": "consu", "list_price": 34000, "standard_price": 26000, "uom_id": m_id},
    {"name": "Tvil Shimlik Paxta Mato (To'q ko'k)", "type": "consu", "list_price": 42000, "standard_price": 33000, "uom_id": m_id},
    {"name": "Polyester Tikuv Ipi 40/2 (Bobina)", "type": "consu", "list_price": 14000, "standard_price": 9500, "uom_id": unit_id},
    {"name": "Ko'ylak Tugmasi (Oq marvarid 11mm)", "type": "consu", "list_price": 250, "standard_price": 120, "uom_id": unit_id},
    {"name": "Shim Metall Molniyasi (18 sm)", "type": "consu", "list_price": 3500, "standard_price": 2200, "uom_id": unit_id},
    {"name": "Dublerin / Flizelin Yoqa uchun (Oq)", "type": "consu", "list_price": 18000, "standard_price": 12000, "uom_id": m_id},
    {"name": "To'qima Brend Yorlig'i (Main Label)", "type": "consu", "list_price": 800, "standard_price": 450, "uom_id": unit_id},
    {"name": "Polietilen Kiyim Paketi (Salafan)", "type": "consu", "list_price": 600, "standard_price": 300, "uom_id": unit_id},
]

raw_prod_ids = {}
for p in products_raw:
    existing = execute("product.product", "search", [["name", "=", p["name"]]])
    if existing:
        raw_prod_ids[p["name"]] = existing[0]
    else:
        pid = execute("product.product", "create", p)
        raw_prod_ids[p["name"]] = pid

products_finished = [
    {"name": "Terra Pro Erkaklar Futbolkasi (Oq, 100% Paxta)", "type": "consu", "list_price": 65000, "standard_price": 32000, "uom_id": unit_id},
    {"name": "Klassik Erkaklar Oq Ko'ylagi (Slim Fit)", "type": "consu", "list_price": 180000, "standard_price": 85000, "uom_id": unit_id},
    {"name": "Ayollar Yozgi Ko'ylagi (Gulli Viskoza)", "type": "consu", "list_price": 220000, "standard_price": 95000, "uom_id": unit_id},
    {"name": "Erkaklar Chinos Shimi (To'q ko'k)", "type": "consu", "list_price": 195000, "standard_price": 88000, "uom_id": unit_id},
    {"name": "Novatex Premium Polo Futbolka (Pikye)", "type": "consu", "list_price": 110000, "standard_price": 48000, "uom_id": unit_id},
]

finished_prod_ids = {}
for p in products_finished:
    existing = execute("product.product", "search", [["name", "=", p["name"]]])
    if existing:
        finished_prod_ids[p["name"]] = existing[0]
    else:
        pid = execute("product.product", "create", p)
        finished_prod_ids[p["name"]] = pid
print(f"Products created: Raw={len(raw_prod_ids)}, Finished={len(finished_prod_ids)}")

# --------------------------------------------------------------------------
# 4. BoM (BILL OF MATERIALS)
# --------------------------------------------------------------------------
# Terra Pro Futbolka BoM
tp_tshirt = finished_prod_ids["Terra Pro Erkaklar Futbolkasi (Oq, 100% Paxta)"]
tp_tmpl = execute("product.product", "read", [tp_tshirt], ["product_tmpl_id"])[0]["product_tmpl_id"][0]
existing_bom = execute("mrp.bom", "search", [["product_tmpl_id", "=", tp_tmpl]])
if not existing_bom:
    execute("mrp.bom", "create", {
        "product_tmpl_id": tp_tmpl,
        "product_qty": 1.0,
        "type": "normal",
        "bom_line_ids": [
            (0, 0, {"product_id": raw_prod_ids["Suprim Paxta Mato 100% (Oq, 180 gr/m2)"], "product_qty": 0.22}),
            (0, 0, {"product_id": raw_prod_ids["Polyester Tikuv Ipi 40/2 (Bobina)"], "product_qty": 0.04}),
            (0, 0, {"product_id": raw_prod_ids["To'qima Brend Yorlig'i (Main Label)"], "product_qty": 1.0}),
            (0, 0, {"product_id": raw_prod_ids["Polietilen Kiyim Paketi (Salafan)"], "product_qty": 1.0}),
        ]
    })

# Klassik Oq Ko'ylak BoM
sh_id = finished_prod_ids["Klassik Erkaklar Oq Ko'ylagi (Slim Fit)"]
sh_tmpl = execute("product.product", "read", [sh_id], ["product_tmpl_id"])[0]["product_tmpl_id"][0]
existing_bom = execute("mrp.bom", "search", [["product_tmpl_id", "=", sh_tmpl]])
if not existing_bom:
    execute("mrp.bom", "create", {
        "product_tmpl_id": sh_tmpl,
        "product_qty": 1.0,
        "type": "normal",
        "bom_line_ids": [
            (0, 0, {"product_id": raw_prod_ids["Ko'ylaklik Paxta Poplin Mato (Oq)"], "product_qty": 1.4}),
            (0, 0, {"product_id": raw_prod_ids["Dublerin / Flizelin Yoqa uchun (Oq)"], "product_qty": 0.2}),
            (0, 0, {"product_id": raw_prod_ids["Ko'ylak Tugmasi (Oq marvarid 11mm)"], "product_qty": 8.0}),
            (0, 0, {"product_id": raw_prod_ids["Polyester Tikuv Ipi 40/2 (Bobina)"], "product_qty": 0.08}),
            (0, 0, {"product_id": raw_prod_ids["To'qima Brend Yorlig'i (Main Label)"], "product_qty": 1.0}),
            (0, 0, {"product_id": raw_prod_ids["Polietilen Kiyim Paketi (Salafan)"], "product_qty": 1.0}),
        ]
    })
print("BOMs created successfully")

# --------------------------------------------------------------------------
# 5. ISHLAB CHIQARISH REJASI (PRODUCTION PLAN)
# --------------------------------------------------------------------------
date_start = today - timedelta(days=today.weekday())
date_end = date_start + timedelta(days=6)

existing_plans = execute("tekstil.production.plan", "search", [["name", "ilike", "2026-H40"]])
if not existing_plans:
    plan_id = execute("tekstil.production.plan", "create", {
        "name": "2026-H40: Futbolka, Ko'ylak va Shimlar Haftalik Rejasi",
        "plan_type": "weekly",
        "date_start": str(date_start),
        "date_end": str(date_end),
        "state": "in_progress",
        "note": "Terra Pro va Just brendlari uchun eksport partiyalari. Sifatga qat'iy e'tibor qaratilsin!",
        "line_ids": [
            (0, 0, {
                "line_code": "line_1",
                "product_id": finished_prod_ids["Terra Pro Erkaklar Futbolkasi (Oq, 100% Paxta)"],
                "color": "Oq",
                "qty_xs": 200, "qty_s": 600, "qty_m": 1000, "qty_l": 800, "qty_xl": 400, "qty_2xl": 0,
                "produced_qty": 2450.0,
            }),
            (0, 0, {
                "line_code": "line_2",
                "product_id": finished_prod_ids["Klassik Erkaklar Oq Ko'ylagi (Slim Fit)"],
                "color": "Oq",
                "qty_xs": 0, "qty_s": 300, "qty_m": 500, "qty_l": 450, "qty_xl": 250, "qty_2xl": 0,
                "produced_qty": 1180.0,
            }),
            (0, 0, {
                "line_code": "line_2",
                "product_id": finished_prod_ids["Ayollar Yozgi Ko'ylagi (Gulli Viskoza)"],
                "color": "Gulli ko'k",
                "qty_xs": 100, "qty_s": 250, "qty_m": 450, "qty_l": 300, "qty_xl": 100, "qty_2xl": 0,
                "produced_qty": 980.0,
            }),
            (0, 0, {
                "line_code": "line_3",
                "product_id": finished_prod_ids["Erkaklar Chinos Shimi (To'q ko'k)"],
                "color": "To'q ko'k",
                "qty_xs": 0, "qty_s": 350, "qty_m": 650, "qty_l": 550, "qty_xl": 250, "qty_2xl": 0,
                "produced_qty": 1420.0,
            }),
        ]
    })
else:
    plan_id = existing_plans[0]
print(f"Production Plan ID: {plan_id}")

# --------------------------------------------------------------------------
# 6. B2B BRAND BUYURTMALARI
# --------------------------------------------------------------------------
brand_orders = [
    {
        "partner_id": partner_ids["Terra Pro MChJ"],
        "brand_name": "Terra Pro",
        "product_id": finished_prod_ids["Terra Pro Erkaklar Futbolkasi (Oq, 100% Paxta)"],
        "color": "Oq",
        "qty_xs": 300, "qty_s": 1000, "qty_m": 1800, "qty_l": 1200, "qty_xl": 700, "qty_2xl": 0,
        "unit_price": 48000.0,
        "delivery_date": str(today + timedelta(days=12)),
        "produced_qty": 2450.0,
        "state": "in_prod",
        "note": "Brend to'qima yorlig'i va individual karton quti bilan qadoqlansin.",
    },
    {
        "partner_id": partner_ids["Just Brands O'zbekiston"],
        "brand_name": "Just",
        "product_id": finished_prod_ids["Klassik Erkaklar Oq Ko'ylagi (Slim Fit)"],
        "color": "Oq",
        "qty_xs": 0, "qty_s": 400, "qty_m": 800, "qty_l": 600, "qty_xl": 200, "qty_2xl": 0,
        "unit_price": 125000.0,
        "delivery_date": str(today + timedelta(days=18)),
        "produced_qty": 1180.0,
        "state": "in_prod",
        "note": "Yoqa dublerini qattiq bo'lsin. Tugmalar marvarid oq.",
    },
    {
        "partner_id": partner_ids["D&M Collection"],
        "brand_name": "D&M Exclusive",
        "product_id": finished_prod_ids["Ayollar Yozgi Ko'ylagi (Gulli Viskoza)"],
        "color": "Gulli Ko'k",
        "qty_xs": 150, "qty_s": 350, "qty_m": 500, "qty_l": 350, "qty_xl": 150, "qty_2xl": 0,
        "unit_price": 145000.0,
        "delivery_date": str(today + timedelta(days=22)),
        "produced_qty": 980.0,
        "state": "in_prod",
        "note": "Etagi plisse qilingan, kamar qo'shilgan holda topshirilsin.",
    },
]

brand_order_ids = {}
for bo in brand_orders:
    existing = execute("tekstil.brand.order", "search", [["brand_name", "=", bo["brand_name"]]])
    if existing:
        boid = existing[0]
    else:
        boid = execute("tekstil.brand.order", "create", bo)
    brand_order_ids[bo["brand_name"]] = boid
print(f"Brand orders created: {len(brand_order_ids)}")

# --------------------------------------------------------------------------
# 7. KONVEYERDAGI PARTIYALAR (BATCHES)
# --------------------------------------------------------------------------
batches_data = [
    {
        "name": "PRT-2026-001",
        "product_id": finished_prod_ids["Terra Pro Erkaklar Futbolkasi (Oq, 100% Paxta)"],
        "plan_id": plan_id,
        "brand_order_id": brand_order_ids.get("Terra Pro"),
        "color": "Oq",
        "roll_number": "RUL-8841 (Suprim 180g)",
        "fabric_used_kg": 220.0,
        "quantity": 1000.0,
        "stage": "qc",
        "current_worker_id": employee_ids["Nodira Umarova"],
        "line_code": "line_1",
        "state": "in_progress",
        "cutting_qty": 1000.0,
        "sewing_qty": 1000.0,
        "ironing_qty": 1000.0,
        "qc_passed_qty": 965.0,
        "qc_defect_qty": 35.0,
    },
    {
        "name": "PRT-2026-002",
        "product_id": finished_prod_ids["Klassik Erkaklar Oq Ko'ylagi (Slim Fit)"],
        "plan_id": plan_id,
        "brand_order_id": brand_order_ids.get("Just"),
        "color": "Oq",
        "roll_number": "RUL-9102 (Poplin 120g)",
        "fabric_used_kg": 700.0,
        "quantity": 500.0,
        "stage": "sewing",
        "current_worker_id": employee_ids["Malika Rahimova"],
        "line_code": "line_2",
        "state": "in_progress",
        "cutting_qty": 500.0,
        "sewing_qty": 320.0,
    },
    {
        "name": "PRT-2026-003",
        "product_id": finished_prod_ids["Ayollar Yozgi Ko'ylagi (Gulli Viskoza)"],
        "plan_id": plan_id,
        "brand_order_id": brand_order_ids.get("D&M Exclusive"),
        "color": "Gulli Ko'k",
        "roll_number": "RUL-7430 (Viskoza 150g)",
        "fabric_used_kg": 880.0,
        "quantity": 400.0,
        "stage": "subcontract",
        "current_worker_id": employee_ids["Jasur Tursunov"],
        "line_code": "line_2",
        "state": "in_progress",
        "cutting_qty": 400.0,
    },
    {
        "name": "PRT-2026-004",
        "product_id": finished_prod_ids["Erkaklar Chinos Shimi (To'q ko'k)"],
        "plan_id": plan_id,
        "color": "To'q ko'k",
        "roll_number": "RUL-5519 (Tvil 240g)",
        "fabric_used_kg": 900.0,
        "quantity": 600.0,
        "stage": "ironing",
        "current_worker_id": employee_ids["Sardor Aliyev"],
        "line_code": "line_3",
        "state": "in_progress",
        "cutting_qty": 600.0,
        "sewing_qty": 600.0,
        "ironing_qty": 450.0,
    },
    {
        "name": "PRT-2026-005",
        "product_id": finished_prod_ids["Novatex Premium Polo Futbolka (Pikye)"],
        "plan_id": plan_id,
        "color": "Qora",
        "roll_number": "RUL-6230 (Pikye 220g)",
        "fabric_used_kg": 180.0,
        "quantity": 800.0,
        "stage": "cutting",
        "current_worker_id": employee_ids["Azizbek Karimov"],
        "line_code": "line_1",
        "state": "in_progress",
        "cutting_qty": 450.0,
    },
    {
        "name": "PRT-2026-006",
        "product_id": finished_prod_ids["Terra Pro Erkaklar Futbolkasi (Oq, 100% Paxta)"],
        "plan_id": plan_id,
        "brand_order_id": brand_order_ids.get("Terra Pro"),
        "color": "Oq",
        "roll_number": "RUL-8835 (Suprim 180g)",
        "fabric_used_kg": 265.0,
        "quantity": 1200.0,
        "stage": "done",
        "current_worker_id": employee_ids["Sardor Aliyev"],
        "line_code": "line_1",
        "state": "done",
        "cutting_qty": 1200.0,
        "sewing_qty": 1200.0,
        "ironing_qty": 1200.0,
        "qc_passed_qty": 1170.0,
        "qc_defect_qty": 30.0,
        "packed_qty": 1170.0,
    },
]

batch_ids = {}
for b in batches_data:
    existing = execute("tekstil.production.batch", "search", [["name", "=", b["name"]]])
    if existing:
        bid = existing[0]
    else:
        bid = execute("tekstil.production.batch", "create", b)
    batch_ids[b["name"]] = bid
print(f"Batches created: {len(batch_ids)}")

# --------------------------------------------------------------------------
# 8. SIFAT NAZORATI (OTK QABULLARI)
# --------------------------------------------------------------------------
defects = execute("tekstil.defect.type", "search", [])
defect_sewing = defects[0] if defects else False
defect_collar = defects[1] if len(defects) > 1 else False

qc_checks = [
    {
        "name": "OTK-2026-0001",
        "batch_id": batch_ids["PRT-2026-006"],
        "inspector_id": employee_ids["Nodira Umarova"],
        "check_date": str(today - timedelta(days=1)),
        "inspected_qty": 1200.0,
        "grade_1_qty": 1170.0,
        "grade_2_qty": 20.0,
        "rework_qty": 8.0,
        "reject_qty": 2.0,
        "state": "passed",
        "defect_note": "A'lo sifatli eksport partiyasi. 8 dona yoqa tikuvchiga chokni to'g'rilash uchun berildi.",
        "defect_type_ids": [(6, 0, [defect_sewing])] if defect_sewing else False,
    },
    {
        "name": "OTK-2026-0002",
        "batch_id": batch_ids["PRT-2026-004"],
        "inspector_id": employee_ids["Nodira Umarova"],
        "check_date": str(today),
        "inspected_qty": 600.0,
        "grade_1_qty": 582.0,
        "grade_2_qty": 12.0,
        "rework_qty": 5.0,
        "reject_qty": 1.0,
        "state": "passed",
        "defect_note": "Shim choklari tekis, molniyalar to'liq ishlaydi.",
    },
    {
        "name": "OTK-2026-0003",
        "batch_id": batch_ids["PRT-2026-001"],
        "inspector_id": employee_ids["Nodira Umarova"],
        "check_date": str(today),
        "inspected_qty": 1000.0,
        "grade_1_qty": 965.0,
        "grade_2_qty": 22.0,
        "rework_qty": 11.0,
        "reject_qty": 2.0,
        "state": "passed",
        "defect_note": "Oq futbolka partiyasi sifat talablariga mos keldi.",
        "defect_type_ids": [(6, 0, [defect_collar])] if defect_collar else False,
    },
]

for qc in qc_checks:
    existing = execute("tekstil.quality.check", "search", [["name", "=", qc["name"]]])
    if not existing:
        execute("tekstil.quality.check", "create", qc)
print("QC Checks created")

# --------------------------------------------------------------------------
# 9. XODIMLAR UNUMI (PLANSHET YOZUVLARI)
# --------------------------------------------------------------------------
worker_records = [
    {
        "employee_id": employee_ids["Malika Rahimova"],
        "batch_id": batch_ids["PRT-2026-001"],
        "department": "sewing",
        "operation_name": "Old-orqa biriktirish va yig'ish",
        "quantity": 140.0,
        "piece_rate": 1500.0,
        "date": str(today),
    },
    {
        "employee_id": employee_ids["Dilnoza Komilova"],
        "batch_id": batch_ids["PRT-2026-001"],
        "department": "sewing",
        "operation_name": "Yoqa o'tqazish va bosiq chok",
        "quantity": 125.0,
        "piece_rate": 1800.0,
        "date": str(today),
    },
    {
        "employee_id": employee_ids["Shahnoza Yusupova"],
        "batch_id": batch_ids["PRT-2026-001"],
        "department": "sewing",
        "operation_name": "4-ipli overlog va yon chok",
        "quantity": 130.0,
        "piece_rate": 1400.0,
        "date": str(today),
    },
    {
        "employee_id": employee_ids["Azizbek Karimov"],
        "batch_id": batch_ids["PRT-2026-005"],
        "department": "cutting",
        "operation_name": "Lekalo bo'yicha to'shamani bichish",
        "quantity": 450.0,
        "piece_rate": 800.0,
        "date": str(today),
    },
    {
        "employee_id": employee_ids["Sardor Aliyev"],
        "batch_id": batch_ids["PRT-2026-004"],
        "department": "ironing",
        "operation_name": "Bug'li dazmollash va iplarni tozalash",
        "quantity": 220.0,
        "piece_rate": 600.0,
        "date": str(today),
    },
]

for wr in worker_records:
    execute("tekstil.worker.output", "create", wr)
print("Worker outputs recorded")

# --------------------------------------------------------------------------
# 10. SUB-PUDRAT BUYURTMALARI
# --------------------------------------------------------------------------
subcontracts_data = [
    {
        "name": "SUB-2026-001",
        "partner_id": partner_ids["SilkPrint Master MChJ"],
        "service_type": "printing",
        "batch_id": batch_ids["PRT-2026-003"],
        "sent_qty": 400.0,
        "received_qty": 0.0,
        "cost_per_unit": 4000.0,
        "date_sent": str(today - timedelta(days=2)),
        "date_expected": str(today + timedelta(days=1)),
        "state": "sent",
        "note": "Ko'krak qismiga Terra Pro yozuvi ipak bosma (serigrafiya) texnologiyasida tushirilsin.",
    },
    {
        "name": "SUB-2026-002",
        "partner_id": partner_ids["Zarafshon Kashtachilik MChJ"],
        "service_type": "embroidery",
        "batch_id": batch_ids["PRT-2026-005"],
        "sent_qty": 800.0,
        "received_qty": 0.0,
        "cost_per_unit": 3500.0,
        "date_sent": str(today),
        "date_expected": str(today + timedelta(days=3)),
        "state": "sent",
        "note": "Novatex logotipi kumushrang metall ipda kashta qilinsin.",
    },
]

for sc in subcontracts_data:
    existing = execute("tekstil.subcontract.order", "search", [["name", "=", sc["name"]]])
    if not existing:
        execute("tekstil.subcontract.order", "create", sc)
print("Subcontracts created")

print("=== BARCHA TEKSTIL DEMO MA'LUMOTLARI MUVAFFAQIYATLI YUKLANDI! ===")
