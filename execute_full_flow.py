# -*- coding: utf-8 -*-
"""
Odoo 19 Tekstil To'liq End-to-End Ishlab Chiqarish va Tijorat Oqimi:
1. Xarid (Purchase) - Xomashyo xaridi (Mato, ip, furnitura)
2. Omborga Kirim (Warehouse Inbound) - Xomashyoni qabul qilish
3. Xarid Buxgalteriyasi (Vendor Bill & Payment) - Hisob-faktura va to'lov
4. Ishlab Chiqarish (MRP) - 500 dona futbolka tikish va yakunlash
5. Tekstil Sifat Nazorati (OTK & Planshet) - OTK sertifikati va ishbay haq
6. B2B Sotish (Sales Order) - Terra Pro ga buyurtma rasmiylashtirish
7. Ombor Chiqimi (Warehouse Delivery) - Mahsulotni xaridorga yetkazish
8. Sotuv Buxgalteriyasi (Customer Invoice & Payment) - Faktura va to'lov qabuli
9. Moliyaviy Tahlil - Foyda va pul oqimi hisoboti
"""
import sys
import xmlrpc.client
from datetime import date

URL = "https://demo.novaodoo.uz"
DB = "tekstil"
USER = "tekstil"
API_KEY = "9aad71bb0549141309df7a4fb98d65c38bc747af"

print(f"Connecting to Odoo {URL} (DB: {DB})...")
common = xmlrpc.client.ServerProxy(f"{URL}/xmlrpc/2/common")
uid = common.authenticate(DB, USER, API_KEY, {})
if not uid:
    print("Authentication failed!")
    sys.exit(1)
print(f"Authenticated successfully! UID: {uid}")

models = xmlrpc.client.ServerProxy(f"{URL}/xmlrpc/2/object")


def execute(model, method, *args, **kwargs):
    return models.execute_kw(DB, uid, API_KEY, model, method, list(args), kwargs)


today = date.today().strftime("%Y-%m-%d")

# --------------------------------------------------------------------------
# 0. Birlamchi ma'lumotlarni aniqlash
# --------------------------------------------------------------------------
vendor_ids = execute("res.partner", "search", [["name", "ilike", "Novatex"]])
vendor_id = vendor_ids[0] if vendor_ids else 15

customer_ids = execute("res.partner", "search", [["name", "ilike", "Terra Pro"]])
customer_id = customer_ids[0] if customer_ids else 10

bank_journals = execute("account.journal", "search", [["type", "=", "bank"]], limit=1)
bank_journal_id = bank_journals[0] if bank_journals else 6

product_fabric = execute("product.product", "search", [["name", "ilike", "Suprim Paxta Mato"]], limit=1)[0]
product_thread = execute("product.product", "search", [["name", "ilike", "Polyester Tikuv Ipi"]], limit=1)[0]
product_label = execute("product.product", "search", [["name", "ilike", "To'qima Brend"]], limit=1)[0]
product_poly = execute("product.product", "search", [["name", "ilike", "Polietilen Kiyim"]], limit=1)[0]
product_tshirt = execute("product.product", "search", [["name", "ilike", "Terra Pro Erkaklar Futbolkasi"]], limit=1)[0]

print(f"Vendor ID: {vendor_id}, Customer ID: {customer_id}, Bank Journal: {bank_journal_id}")
print(f"Products: Fabric={product_fabric}, Thread={product_thread}, Label={product_label}, Poly={product_poly}, T-shirt={product_tshirt}")

# --------------------------------------------------------------------------
# 1-QADAM: XARID (PURCHASE ORDER)
# --------------------------------------------------------------------------
print("\n" + "="*60)
print("1-BOSQICH: XARID (PURCHASE ORDER) - Xomashyo xaridi")
print("="*60)

# Mavjud P00001 bormi yoki yangi ochamiz
existing_pos = execute("purchase.order", "search", [["partner_id", "=", vendor_id], ["state", "in", ["draft", "purchase"]]], limit=1)
if existing_pos:
    po_id = existing_pos[0]
    po = execute("purchase.order", "read", [po_id], ["name", "amount_untaxed", "amount_tax", "amount_total", "state"])[0]
    if po["state"] == "draft":
        execute("purchase.order", "button_confirm", [po_id])
    print(f"[OK] Xarid buyurtmasi: {po['name']} (Holati: {po['state']})")
    print(f"     Summa: {po['amount_untaxed']:,.0f} so'm + QQS: {po['amount_tax']:,.0f} so'm = Jami: {po['amount_total']:,.0f} so'm")
else:
    po_lines = [
        (0, 0, {
            "product_id": product_fabric,
            "product_qty": 120.0,
            "price_unit": 65000.0,
            "name": "Suprim Paxta Mato 100% (Oq, 180 gr/m2)",
            "date_planned": today,
        }),
        (0, 0, {
            "product_id": product_thread,
            "product_qty": 25.0,
            "price_unit": 12000.0,
            "name": "Polyester Tikuv Ipi 40/2 (Bobina)",
            "date_planned": today,
        }),
        (0, 0, {
            "product_id": product_label,
            "product_qty": 550.0,
            "price_unit": 800.0,
            "name": "To'qima Brend Yorlig'i (Main Label)",
            "date_planned": today,
        }),
        (0, 0, {
            "product_id": product_poly,
            "product_qty": 550.0,
            "price_unit": 400.0,
            "name": "Polietilen Kiyim Paketi (Salafan)",
            "date_planned": today,
        }),
    ]
    po_id = execute("purchase.order", "create", {
        "partner_id": vendor_id,
        "date_order": today,
        "order_line": po_lines,
    })
    execute("purchase.order", "button_confirm", [po_id])
    po = execute("purchase.order", "read", [po_id], ["name", "amount_untaxed", "amount_tax", "amount_total", "state"])[0]
    print(f"[OK] Yangi xarid buyurtmasi yaratildi va tasdiqlandi: {po['name']}")
    print(f"     Summa: {po['amount_untaxed']:,.0f} so'm + QQS: {po['amount_tax']:,.0f} so'm = Jami: {po['amount_total']:,.0f} so'm")

# --------------------------------------------------------------------------
# 2-QADAM: OMBORGA KIRIM (WAREHOUSE RECEIPT)
# --------------------------------------------------------------------------
print("\n" + "="*60)
print("2-BOSQICH: OMBORGA KIRIM (WAREHOUSE RECEIPT) - Xomashyoni qabul qilish")
print("="*60)

po_data = execute("purchase.order", "read", [po_id], ["picking_ids"])[0]
receipt_id = po_data["picking_ids"][0]
receipt = execute("stock.picking", "read", [receipt_id], ["name", "move_ids", "state"])[0]
print(f"[..] Ombor qabuli hujjati: {receipt['name']} (Hozirgi holati: {receipt['state']})")

if receipt["state"] != "done":
    for move_id in receipt["move_ids"]:
        m = execute("stock.move", "read", [move_id], ["product_id", "product_uom_qty"])[0]
        execute("stock.move", "write", [move_id], {
            "quantity": m["product_uom_qty"],
            "picked": True,
        })
        print(f"     -> Qabul qilindi: {m['product_id'][1]} - {m['product_uom_qty']} birlik")

    execute("stock.picking", "button_validate", [receipt_id])
    receipt_updated = execute("stock.picking", "read", [receipt_id], ["state"])[0]
    print(f"[OK] Omborga kirim to'liq yakunlandi! (Yangi holati: {receipt_updated['state']})")
else:
    print(f"[OK] Omborga kirim allaqachon bajarilgan ({receipt['state']})")

# --------------------------------------------------------------------------
# 3-QADAM: XARID BUXGALTERIYASI (VENDOR BILL & TO'LOV)
# --------------------------------------------------------------------------
print("\n" + "="*60)
print("3-BOSQICH: XARID BUXGALTERIYASI - Yetkazib beruvchi hisob-fakturasi va to'lov")
print("="*60)

po_data = execute("purchase.order", "read", [po_id], ["invoice_ids", "amount_total"])[0]
if not po_data["invoice_ids"]:
    execute("purchase.order", "action_create_invoice", [po_id])
    po_data = execute("purchase.order", "read", [po_id], ["invoice_ids", "amount_total"])[0]

bill_id = po_data["invoice_ids"][0]
bill = execute("account.move", "read", [bill_id], ["name", "state", "payment_state", "amount_total"])[0]
print(f"[..] Hisob-faktura topildi: ID {bill_id} | Summa: {bill['amount_total']:,.0f} so'm (Holati: {bill['state']})")

if bill["state"] == "draft":
    execute("account.move", "write", [bill_id], {"invoice_date": today})
    execute("account.move", "action_post", [bill_id])
    bill = execute("account.move", "read", [bill_id], ["name", "state", "payment_state", "amount_total"])[0]
    print(f"[OK] Faktura tasdiqlandi (Posted): {bill['name']}")

if bill["payment_state"] not in ["paid", "in_payment"]:
    action = execute("account.move", "action_register_payment", [bill_id])
    ctx = action.get("context", {})
    wizard_ids = execute("account.payment.register", "create", [{}], context=ctx)
    wizard_id = wizard_ids[0] if isinstance(wizard_ids, list) else wizard_ids
    execute("account.payment.register", "action_create_payments", [wizard_id], context=ctx)
    bill_paid = execute("account.move", "read", [bill_id], ["payment_state"])[0]
    print(f"[OK] Bank orqali yetkazib beruvchiga {bill['amount_total']:,.0f} so'm to'landi! (To'lov holati: {bill_paid['payment_state']})")
else:
    print(f"[OK] Faktura allaqachon to'langan ({bill['payment_state']})")

# --------------------------------------------------------------------------
# 4-QADAM: ISHLAB CHIQARISH (MANUFACTURING / MRP)
# --------------------------------------------------------------------------
print("\n" + "="*60)
print("4-BOSQICH: ISHLAB CHIQARISH (MRP) - 500 dona futbolka tikish")
print("="*60)

existing_mos = execute("mrp.production", "search", [["product_id", "=", product_tshirt], ["state", "=", "done"]], limit=1)
if existing_mos:
    mo_id = existing_mos[0]
    mo = execute("mrp.production", "read", [mo_id], ["name", "product_qty", "state"])[0]
    print(f"[OK] Ishlab chiqarish buyurtmasi (MO) allaqachon bajarilgan: {mo['name']} ({mo['product_qty']} dona, Holati: {mo['state']})")
else:
    boms = execute("mrp.bom", "search", [["product_tmpl_id.product_variant_ids", "in", [product_tshirt]]])
    bom_id = boms[0] if boms else 1

    mo_id = execute("mrp.production", "create", {
        "product_id": product_tshirt,
        "product_qty": 500.0,
        "bom_id": bom_id,
        "date_start": today,
    })
    mo = execute("mrp.production", "read", [mo_id], ["name", "product_qty", "state"])[0]
    print(f"[OK] Ishlab chiqarish buyurtmasi (MO) ochildi: {mo['name']} ({mo['product_qty']} dona)")

    execute("mrp.production", "action_confirm", [mo_id])
    execute("mrp.production", "action_assign", [mo_id])
    print(f"[OK] Xomashyolar ombordan ishlab chiqarish uchun band qilindi (Reserved)")

    execute("mrp.production", "write", [mo_id], {"qty_producing": 500.0})

    mo_detail = execute("mrp.production", "read", [mo_id], ["move_raw_ids"])[0]
    for rm_id in mo_detail["move_raw_ids"]:
        rm = execute("stock.move", "read", [rm_id], ["product_id", "product_uom_qty"])[0]
        execute("stock.move", "write", [rm_id], {
            "quantity": rm["product_uom_qty"],
            "picked": True,
        })
        print(f"     -> Sarflandi (Mato/furnitura): {rm['product_id'][1]} - {rm['product_uom_qty']} birlik")

    execute("mrp.production", "button_mark_done", [mo_id])
    mo_done = execute("mrp.production", "read", [mo_id], ["state"])[0]
    print(f"[OK] Ishlab chiqarish muvaffaqiyatli yakunlandi! 500 dona tayyor futbolka omborga kirdi (Holati: {mo_done['state']})")

# --------------------------------------------------------------------------
# 5-QADAM: TEKSTIL SIFAT NAZORATI VA BO'LIM PLANSHETI (OTK & KIOSK)
# --------------------------------------------------------------------------
print("\n" + "="*60)
print("5-BOSQICH: TEKSTIL MODULI - Partiyani OTK Sifat tekshiruvi va Ishbay haq")
print("="*60)

existing_batches = execute("tekstil.production.batch", "search", [["name", "=", "PRT-2026-009"]], limit=1)
if existing_batches:
    batch_id = existing_batches[0]
else:
    batch_id = execute("tekstil.production.batch", "create", {
        "name": "PRT-2026-009",
        "product_id": product_tshirt,
        "quantity": 500.0,
        "color": "Oq (White)",
        "roll_number": "RUL-9901 (Suprim 180g)",
        "stage": "done",
        "state": "done",
        "cutting_qty": 500.0,
        "sewing_qty": 500.0,
        "ironing_qty": 500.0,
        "qc_passed_qty": 494.0,
        "packed_qty": 494.0,
    })

existing_qcs = execute("tekstil.quality.check", "search", [["batch_id", "=", batch_id]], limit=1)
if existing_qcs:
    qc_id = existing_qcs[0]
else:
    defect_types = execute("tekstil.defect.type", "search", [], limit=1)
    qc_id = execute("tekstil.quality.check", "create", {
        "name": "OTK-2026-0005",
        "batch_id": batch_id,
        "check_date": today,
        "inspected_qty": 500.0,
        "grade_1_qty": 494.0,
        "grade_2_qty": 4.0,
        "rework_qty": 2.0,
        "reject_qty": 0.0,
        "defect_type_ids": [(6, 0, defect_types)],
        "defect_note": "A'lo sifatli eksport partiyasi. 2 dona yoqa chokini to'g'rilashga yo'naltirildi.",
        "state": "passed",
    })
qc = execute("tekstil.quality.check", "read", [qc_id], ["pass_rate"])[0]
print(f"[OK] OTK Tekshiruvi rasmiylashtirildi: 500 dona tekshirildi, 494 dona 1-Nav (Sifat darajasi: {qc['pass_rate']:.1f}%)")

emp_dilnoza = execute("hr.employee", "search", [["name", "ilike", "Dilnoza"]], limit=1)[0]
emp_shahnoza = execute("hr.employee", "search", [["name", "ilike", "Shahnoza"]], limit=1)[0]

existing_w_outs = execute("tekstil.worker.output", "search", [["batch_id", "=", batch_id]], limit=2)
if not existing_w_outs:
    out1 = execute("tekstil.worker.output", "create", {
        "employee_id": emp_dilnoza,
        "batch_id": batch_id,
        "operation_name": "Yoqa tikish va yig'ish",
        "department": "sewing",
        "quantity": 250.0,
        "piece_rate": 1800.0,
        "date": today,
    })
    out2 = execute("tekstil.worker.output", "create", {
        "employee_id": emp_shahnoza,
        "batch_id": batch_id,
        "operation_name": "Overlog va yon choklar",
        "department": "sewing",
        "quantity": 250.0,
        "piece_rate": 1400.0,
        "date": today,
    })
print(f"[OK] Bo'lim plansheti orqali xodimlarga ishbay maosh qayd etildi:")
print(f"     -> Dilnoza Komilova: 250 dona * 1,800 so'm = 450,000 so'm")
print(f"     -> Shahnoza Yusupova: 250 dona * 1,400 so'm = 350,000 so'm")

# --------------------------------------------------------------------------
# 6-QADAM: B2B SOTISH (SALES ORDER)
# --------------------------------------------------------------------------
print("\n" + "="*60)
print("6-BOSQICH: B2B SOTISH (SALES ORDER) - Terra Pro ga sotuv shartnomasi")
print("="*60)

so_lines = [
    (0, 0, {
        "product_id": product_tshirt,
        "product_uom_qty": 500.0,
        "price_unit": 48000.0,
        "name": "Terra Pro Erkaklar Futbolkasi (Oq, 100% Paxta) - 500 dona (S:100, M:200, L:150, XL:50)",
    }),
]

so_id = execute("sale.order", "create", {
    "partner_id": customer_id,
    "date_order": today,
    "order_line": so_lines,
})

so = execute("sale.order", "read", [so_id], ["name", "amount_untaxed", "amount_tax", "amount_total"])[0]
print(f"[OK] Sotuv buyurtmasi rasmiylashtirildi: {so['name']}")
print(f"     Sotuv summasi: {so['amount_untaxed']:,.0f} so'm + QQS: {so['amount_tax']:,.0f} so'm = Jami: {so['amount_total']:,.0f} so'm")

execute("sale.order", "action_confirm", [so_id])
print(f"[OK] Sotuv buyurtmasi tasdiqlandi (Holati: Sales Order)")

# --------------------------------------------------------------------------
# 7-QADAM: OMBOR CHIQIMI (WAREHOUSE OUTBOUND DELIVERY)
# --------------------------------------------------------------------------
print("\n" + "="*60)
print("7-BOSQICH: OMBOR CHIQIMI - Mahsulotni xaridorga yetkazib berish (Delivery)")
print("="*60)

so_data = execute("sale.order", "read", [so_id], ["picking_ids"])[0]
delivery_id = so_data["picking_ids"][0]
delivery = execute("stock.picking", "read", [delivery_id], ["name", "move_ids", "state"])[0]
print(f"[..] Yetkazib berish hujjati: {delivery['name']} (Holati: {delivery['state']})")

if delivery["state"] != "done":
    for move_id in delivery["move_ids"]:
        m = execute("stock.move", "read", [move_id], ["product_id", "product_uom_qty"])[0]
        execute("stock.move", "write", [move_id], {
            "quantity": m["product_uom_qty"],
            "picked": True,
        })
        print(f"     -> Yuklandi va jo'natildi: {m['product_id'][1]} - {m['product_uom_qty']} dona")

    execute("stock.picking", "button_validate", [delivery_id], context={"skip_sms": True})
    delivery_updated = execute("stock.picking", "read", [delivery_id], ["state"])[0]
    print(f"[OK] Tayyor mahsulot xaridorga jo'natildi! (Holati: {delivery_updated['state']})")
else:
    print(f"[OK] Yetkazib berish allaqachon bajarilgan (done)")

# --------------------------------------------------------------------------
# 8-QADAM: SOTUV BUXGALTERIYASI (CUSTOMER INVOICE & TO'LOV QABULI)
# --------------------------------------------------------------------------
print("\n" + "="*60)
print("8-BOSQICH: SOTUV BUXGALTERIYASI - Mijoz hisob-fakturasi va pul tushumi")
print("="*60)

so_data = execute("sale.order", "read", [so_id], ["invoice_ids"])[0]
if not so_data["invoice_ids"]:
    wiz_ids = execute("sale.advance.payment.inv", "create", [{"advance_payment_method": "delivered"}], context={"active_ids": [so_id], "active_model": "sale.order"})
    wiz_id = wiz_ids[0] if isinstance(wiz_ids, list) else wiz_ids
    execute("sale.advance.payment.inv", "create_invoices", [wiz_id], context={"active_ids": [so_id], "active_model": "sale.order"})
    so_data = execute("sale.order", "read", [so_id], ["invoice_ids"])[0]

inv_id = so_data["invoice_ids"][0]
inv = execute("account.move", "read", [inv_id], ["name", "amount_total", "state", "payment_state"])[0]
print(f"[..] Mijoz hisob-fakturasi: {inv['name'] or 'Yangi'} (ID {inv_id}) | Summa: {inv['amount_total']:,.0f} so'm")

if inv["state"] == "draft":
    execute("account.move", "write", [inv_id], {"invoice_date": today})
    execute("account.move", "action_post", [inv_id])
    inv = execute("account.move", "read", [inv_id], ["name", "state", "payment_state", "amount_total"])[0]
    print(f"[OK] Hisob-faktura tasdiqlandi (Posted): {inv['name']}")

if inv["payment_state"] not in ["paid", "in_payment"]:
    action = execute("account.move", "action_register_payment", [inv_id])
    ctx = action.get("context", {})
    wizard_ids = execute("account.payment.register", "create", [{}], context=ctx)
    wizard_id = wizard_ids[0] if isinstance(wizard_ids, list) else wizard_ids
    execute("account.payment.register", "action_create_payments", [wizard_id], context=ctx)
    inv_paid = execute("account.move", "read", [inv_id], ["payment_state"])[0]
    print(f"[OK] Mijozdan bank hisob raqamimizga {inv['amount_total']:,.0f} so'm pul tushdi! (To'lov holati: {inv_paid['payment_state']})")
else:
    print(f"[OK] Mijoz to'lovi allaqachon qabul qilingan ({inv['payment_state']})")

# --------------------------------------------------------------------------
# 9-QADAM: YAKUNIY MOLIYAVIY VA OPERATSION TAHLIL (PROFIT & P&L)
# --------------------------------------------------------------------------
print("\n" + "="*60)
print("9-BOSQICH: TO'LIQ OQIM BO'YICHA MOLIYAVIY XULOSA VA TAHLIL")
print("="*60)

revenue_untaxed = so["amount_untaxed"]
labor_cost = 450000.0 + 350000.0

# 500 dona futbolka uchun haqiqiy xomashyo sarfi:
# 110 kg mato @ 65000 = 7,150,000
# 20 bobina ip @ 12000 = 240,000
# 500 yorliq @ 800 = 400,000
# 500 paket @ 400 = 200,000
cogs_actual = (110 * 65000) + (20 * 12000) + (500 * 800) + (500 * 400)
gross_profit = revenue_untaxed - cogs_actual - labor_cost
margin_pct = (gross_profit / revenue_untaxed) * 100.0

print(f"1. Sotuv daromadi (Revenue):             {revenue_untaxed:14,.0f} so'm")
print(f"2. Xomashyo tannarxi (COGS Material):    {cogs_actual:14,.0f} so'm")
print(f"3. Ishbay ish haqi xarajati (Labor):     {labor_cost:14,.0f} so'm")
print(f"----------------------------------------------------------------")
print(f"4. Yalpi Foyda (Gross Profit):           {gross_profit:14,.0f} so'm")
print(f"5. Rentabellik (Gross Margin %):         {margin_pct:14.1f} %")
print(f"6. Xarid qilingan xomashyo qoldig'i:      Omborda zaxira sifatida saqlanib qoldi")
print("="*60)
print("TO'LIQ END-TO-END OQIM MUVAFFAQIYATLI SHAKLLANTIRILDI VA YAKUNLANDI!")
