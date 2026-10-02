/** @odoo-module **/

import { Component, xml } from "@odoo/owl";
import { registry } from "@web/core/registry";

export class RomolDashboardAction extends Component {
    static template = xml`
        <div class="o_action_romol_dashboard" style="position: absolute; inset: 0; width: 100%; height: 100%; overflow: hidden; background: #f4f5f8;">
            <iframe 
                src="/tekstil_dashboard/app" 
                style="width: 100%; height: 100%; border: none; display: block;" 
                title="Ro'mol ERP Dashboard"
            />
        </div>
    `;
    static props = ["*"];
}

registry.category("actions").add("tekstil_dashboard_app", RomolDashboardAction);
