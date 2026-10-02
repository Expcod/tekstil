/** @odoo-module **/

import { Component, useState, onWillStart } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";

export class TekstilDashboardAction extends Component {
    static template = "tekstil_dashboard.Dashboard";
    static props = ["*"];

    setup() {
        this.orm = useService("orm");
        this.notification = useService("notification");
        this.action = useService("action");

        this.state = useState({
            loading: true,
            activeTab: "raw_materials", // 'dashboard', 'conveyor', 'raw_materials', 'finished_goods', 'clients', 'finance', 'history'
            categoryFilter: "all",
            searchQuery: "",
            selectedClient: null,
            activeModal: null,
            data: null,
        });

        onWillStart(async () => {
            await this.loadData();
        });
    }

    async loadData() {
        this.state.loading = true;
        try {
            const res = await this.orm.call("tekstil.dashboard", "get_real_dashboard_data", []);
            this.state.data = res;
        } catch (err) {
            console.error("Dashboard yuklashda xatolik:", err);
            if (this.notification) {
                this.notification.add("Ma'lumotlarni yuklashda xatolik yuz berdi", { type: "danger" });
            }
        } finally {
            this.state.loading = false;
        }
    }

    switchTab(tab) {
        this.state.activeTab = tab;
        this.state.searchQuery = "";
        this.state.categoryFilter = "all";
    }

    setCategoryFilter(cat) {
        this.state.categoryFilter = cat;
    }

    onSearchInput(ev) {
        this.state.searchQuery = ev.target.value.toLowerCase().trim();
    }

    openClientStatement(client) {
        this.state.selectedClient = client;
        this.state.activeModal = "statement";
    }

    closeModal() {
        this.state.activeModal = null;
        this.state.selectedClient = null;
    }

    formatMoney(val) {
        if (val === undefined || val === null) return "0 so'm";
        const rounded = Math.round(Number(val));
        return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
    }

    formatNumber(val) {
        if (val === undefined || val === null) return "0";
        return Number(val).toLocaleString("uz-UZ");
    }

    get filteredRawMaterials() {
        if (!this.state.data || !this.state.data.raw_materials) return [];
        let items = this.state.data.raw_materials.items || [];
        if (this.state.categoryFilter !== "all") {
            items = items.filter(item => item.category === this.state.categoryFilter);
        }
        if (this.state.searchQuery) {
            items = items.filter(item => item.name.toLowerCase().includes(this.state.searchQuery));
        }
        return items;
    }

    get filteredFinishedGoods() {
        if (!this.state.data || !this.state.data.finished_goods) return [];
        let items = this.state.data.finished_goods.items || [];
        if (this.state.searchQuery) {
            items = items.filter(item => item.name.toLowerCase().includes(this.state.searchQuery));
        }
        return items;
    }

    get filteredClients() {
        if (!this.state.data || !this.state.data.clients) return [];
        let items = this.state.data.clients.items || [];
        if (this.state.searchQuery) {
            items = items.filter(item => item.name.toLowerCase().includes(this.state.searchQuery));
        }
        return items;
    }

    get filteredHistory() {
        if (!this.state.data || !this.state.data.history) return [];
        let items = this.state.data.history || [];
        if (this.state.searchQuery) {
            items = items.filter(item =>
                item.doc_name.toLowerCase().includes(this.state.searchQuery) ||
                item.partner.toLowerCase().includes(this.state.searchQuery) ||
                item.details.toLowerCase().includes(this.state.searchQuery)
            );
        }
        return items;
    }

    printStatement() {
        window.print();
    }
}

registry.category("actions").add("tekstil_dashboard_app", TekstilDashboardAction);
