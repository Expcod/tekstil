# -*- coding: utf-8 -*-
{
    "name": "Ishlab Chiqarish va Sifat Nazorati",
    "summary": "Tekstil korxonalari uchun rejalashtirish, konveyer monitoringi, sifat nazorati (OTK) va bo'lim plansheti",
    "description": """
Tekstil va Tikuv Korxonalari Boshqaruvi
=======================================

* Haftalik va Oylik Ishlab Chiqarish Rejasi (Planning)
* Konveyer & Partiyalar Nazorati (Bichuv -> Tikuv -> Sub-pudrat -> Dazmol -> OTK -> Qadoq)
* Tezkor Sifat Nazorati (OTK): 1-nav, 2-nav, brak, qayta ishlash va nuqsonlar tahlili
* Bo'lim Plansheti (Tablet / Kiosk mode): Xodimlar bajargan ishlarini kiritish va ishbay haq hisobi
* B2B Brand buyurtmalari (OEM / Private Label) va O'lchamlar matritsasi
* Sub-pudrat boshqaruvi (Bosma, Kashtachilik, Bo'yash)
* Xomashyo yetarliligi va BoM sarf me'yorlari tahlili
    """,
    "author": "Nova Code",
    "website": "https://novaodoo.uz",
    "category": "Manufacturing",
    "version": "19.0.1.0.0",
    "license": "LGPL-3",
    "depends": [
        "web",
        "mail",
        "mrp",
        "stock",
        "hr",
        "sale",
    ],
    "data": [
        "security/security.xml",
        "security/ir.model.access.csv",
        "data/initial_data.xml",
        "views/menus.xml",
        "views/plan_views.xml",
        "views/batch_views.xml",
        "views/quality_views.xml",
        "views/worker_output_views.xml",
        "views/brand_order_views.xml",
        "views/subcontract_views.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "tekstil_manufacturing/static/src/app/dashboard.scss",
            "tekstil_manufacturing/static/src/app/dashboard.xml",
            "tekstil_manufacturing/static/src/app/dashboard.js",
        ],
    },
    "installable": True,
    "application": True,
}
