# -*- coding: utf-8 -*-
{
    "name": "Dashboard",
    "summary": "Ro'mol va Tekstil ERP: Xomashyo ombori, Tayyor ombor, Mijozlar & Nasiyalar, Moliya & P&L, Seh Harakatlari",
    "version": "19.0.1.0.0",
    "category": "Manufacturing/Textile",
    "author": "Expcod",
    "website": "https://demo.novaodoo.uz",
    "license": "LGPL-3",
    "depends": ["web", "base"],
    "data": [
        "views/menus.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "tekstil_dashboard/static/src/app/dashboard_action.js",
        ],
    },
    "installable": True,
    "application": True,
    "auto_install": False,
}
