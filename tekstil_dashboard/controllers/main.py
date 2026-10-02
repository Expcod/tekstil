# -*- coding: utf-8 -*-
import os
from odoo import http
from odoo.http import request


class TekstilDashboardController(http.Controller):

    @http.route(
        ["/tekstil_dashboard/app", "/dashboard", "/romol_erp"],
        type="http",
        auth="public",
        website=False,
        csrf=False,
    )
    def render_dashboard(self, **kwargs):
        """Ro'mol va Tekstil ERP to'liq boshqaruv panelini xizmat ko'rsatish"""
        html_file = os.path.join(os.path.dirname(__file__), "..", "static", "src", "html", "index.html")
        if not os.path.exists(html_file):
            return request.not_found()

        with open(html_file, "r", encoding="utf-8") as f:
            content = f.read()

        return request.make_response(
            content,
            [
                ("Content-Type", "text/html; charset=utf-8"),
                ("Cache-Control", "no-cache, no-store, must-revalidate"),
            ],
        )
