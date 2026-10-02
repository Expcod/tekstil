/** @odoo-module **/

import { Component, useState, onWillStart } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";

const STAGES = [
    { key: "cutting", label: "1. Bichuv", icon: "✂️" },
    { key: "sewing", label: "2. Tikuv", icon: "🪡" },
    { key: "subcontract", label: "3. Sub-pudrat", icon: "🎨" },
    { key: "ironing", label: "4. Dazmol", icon: "💨" },
    { key: "qc", label: "5. OTK Sifat", icon: "🔍" },
    { key: "packing", label: "6. Qadoqlash", icon: "📦" },
    { key: "done", label: "7. Tayyor Ombor", icon: "✅" },
];

export class TekstilManufacturingDashboard extends Component {
    static template = "tekstil_manufacturing.Dashboard";
    static props = ["*"];

    setup() {
        this.orm = useService("orm");
        this.action = useService("action");
        this.notification = useService("notification");

        this.stagesList = STAGES;

        this.state = useState({
            loading: true,
            activeTab: "overview", // overview, conveyor, planning, tablet, quality, workers, brands, subcontract
            data: {
                stats: {
                    today_produced: 0,
                    plan_target: 0,
                    plan_produced: 0,
                    plan_rate: 0,
                    quality_pass_rate: 98,
                    qc_totals: { inspected: 0, grade_1: 0, grade_2: 0, rework: 0, reject: 0 },
                    active_batches_count: 0,
                    active_orders_count: 0,
                },
                plans: [],
                batches: [],
                qc_checks: [],
                worker_outputs: [],
                employees: [],
                brand_orders: [],
                subcontracts: [],
                defect_types: [],
                products: [],
            },
            // Planshet holati (Kiosk)
            tablet: {
                dept: "sewing",
                employeeId: null,
                batchId: null,
                operationName: "Asosiy tikuv / yig'ish",
                quantity: 10,
                pieceRate: 1500,
            },
            // OTK shakli
            qcForm: {
                batchId: null,
                inspectedQty: 100,
                grade1: 96,
                grade2: 2,
                rework: 2,
                reject: 0,
                passRate: 96.0,
                defectTypeId: "",
                note: "",
            },
        });

        onWillStart(async () => {
            await this.loadData();
        });
    }

    async loadData() {
        this.state.loading = true;
        try {
            const res = await this.orm.call("tekstil.dashboard.service", "get_dashboard_data", []);
            if (res) {
                this.state.data = res;
                // Birlamchi qiymatlarni to'ldirish
                if (res.employees && res.employees.length && !this.state.tablet.employeeId) {
                    this.state.tablet.employeeId = res.employees[0].id;
                }
                if (res.batches && res.batches.length && !this.state.tablet.batchId) {
                    this.state.tablet.batchId = res.batches[0].id;
                    this.state.qcForm.batchId = res.batches[0].id;
                    this.state.qcForm.inspectedQty = res.batches[0].quantity || 100;
                    this.recalcQcRates();
                }
            }
        } catch (e) {
            console.error("Tekstil dashboard load error:", e);
            this.notification.add("Ma'lumotlarni yuklashda xatolik yuz berdi", { type: "danger" });
        } finally {
            this.state.loading = false;
        }
    }

    get currentTabTitle() {
        const titles = {
            overview: "📊 Umumiy Boshqaruv & Monitoring",
            conveyor: "🔄 Konveyer Oqimi & Partiyalar (WIP)",
            planning: "📅 Ishlab Chiqarish Rejalari (Haftalik / Oylik)",
            tablet: "📱 Bo'lim Plansheti (Kiosk Rejimi)",
            quality: "🔍 Sifat Nazorati (OTK Qabuli)",
            workers: "👥 Xodimlar Unumdorligi & Ishbay Haq",
            brands: "🏷️ B2B Brand Buyurtmalari (OEM / Private Label)",
            subcontract: "🏭 Sub-pudrat Xizmatlari (Bosma & Kashta)",
        };
        return titles[this.state.activeTab] || "Ishlab Chiqarish";
    }

    switchTab(tabName) {
        this.state.activeTab = tabName;
    }

    getBatchesInStage(stageKey) {
        return (this.state.data.batches || []).filter((b) => b.stage === stageKey);
    }

    formatNumber(num) {
        return new Intl.NumberFormat("uz-UZ").format(Math.round(num || 0));
    }

    // -------------------------------------------------------------------------
    // KONVEYER AMALLARI
    // -------------------------------------------------------------------------
    async advanceBatch(batchId) {
        try {
            await this.orm.call("tekstil.dashboard.service", "batch_move_next_stage", [batchId]);
            this.notification.add("Partiya keyingi bosqichga o'tkazildi!", { type: "success" });
            await this.loadData();
        } catch (e) {
            console.error(e);
            this.notification.add("Bosqichni o'zgartirib bo'lmadi", { type: "danger" });
        }
    }

    openBatchForm(batchId) {
        this.action.doAction({
            type: "ir.actions.act_window",
            res_model: "tekstil.production.batch",
            res_id: batchId,
            views: [[false, "form"]],
            target: "current",
        });
    }

    openQuickBatchModal() {
        this.action.doAction({
            type: "ir.actions.act_window",
            res_model: "tekstil.production.batch",
            views: [[false, "form"]],
            target: "new",
        });
    }

    // -------------------------------------------------------------------------
    // PLANSHET (TABLET / KIOSK) AMALLARI
    // -------------------------------------------------------------------------
    setTabletDept(dept) {
        this.state.tablet.dept = dept;
        const defaultOps = {
            cutting: "Rulon to'shash va bichish",
            sewing: "Asosiy tikuv / yig'ish",
            ironing: "Dazmol va ortiqcha ip qirqish",
            packing: "Yorliq qadash va paketlash",
        };
        const rates = { cutting: 800, sewing: 1500, ironing: 600, packing: 400 };
        this.state.tablet.operationName = defaultOps[dept] || "Operatsiya";
        this.state.tablet.pieceRate = rates[dept] || 1000;
    }

    selectTabletEmployee(empId) {
        this.state.tablet.employeeId = empId;
    }

    addTabletQty(amount) {
        this.state.tablet.quantity = (this.state.tablet.quantity || 0) + amount;
    }

    resetTabletQty() {
        this.state.tablet.quantity = 0;
    }

    async submitTabletOutput() {
        const { employeeId, batchId, operationName, quantity, dept, pieceRate } = this.state.tablet;
        if (!employeeId) {
            this.notification.add("Iltimos, avval xodimni tanlang!", { type: "warning" });
            return;
        }
        if (!batchId) {
            this.notification.add("Partiya tanlanmagan!", { type: "warning" });
            return;
        }
        if (!quantity || quantity <= 0) {
            this.notification.add("Dona sonini kiritmadingiz!", { type: "warning" });
            return;
        }

        try {
            const res = await this.orm.call("tekstil.dashboard.service", "tablet_submit_output", [
                parseInt(employeeId),
                parseInt(batchId),
                operationName,
                parseFloat(quantity),
                dept,
                parseFloat(pieceRate),
            ]);
            if (res && res.success) {
                this.notification.add(res.message || "Bajarilgan ish muvaffaqiyatli saqlandi!", { type: "success" });
                // Miqdorni tozalash
                this.state.tablet.quantity = 10;
                await this.loadData();
            }
        } catch (e) {
            console.error(e);
            this.notification.add("Saqlashda xatolik yuz berdi", { type: "danger" });
        }
    }

    // -------------------------------------------------------------------------
    // OTK SIFAT NAZORATI AMALLARI
    // -------------------------------------------------------------------------
    onQcBatchChange(ev) {
        const bId = parseInt(ev.target.value);
        this.state.qcForm.batchId = bId;
        const batch = (this.state.data.batches || []).find((b) => b.id === bId);
        if (batch) {
            this.state.qcForm.inspectedQty = batch.quantity || 100;
            this.state.qcForm.grade1 = Math.round(this.state.qcForm.inspectedQty * 0.96);
            this.state.qcForm.grade2 = Math.round(this.state.qcForm.inspectedQty * 0.02);
            this.state.qcForm.rework = this.state.qcForm.inspectedQty - this.state.qcForm.grade1 - this.state.qcForm.grade2;
            this.state.qcForm.reject = 0;
            this.recalcQcRates();
        }
    }

    recalcQcRates() {
        const total = parseFloat(this.state.qcForm.inspectedQty) || 0;
        const g1 = parseFloat(this.state.qcForm.grade1) || 0;
        if (total > 0) {
            this.state.qcForm.passRate = Math.round((g1 / total) * 1000) / 10;
        } else {
            this.state.qcForm.passRate = 0;
        }
    }

    async submitQcCheck() {
        const { batchId, inspectedQty, grade1, grade2, rework, reject, defectTypeId, note } = this.state.qcForm;
        if (!batchId) {
            this.notification.add("Partiya tanlanmagan!", { type: "warning" });
            return;
        }
        try {
            const defectIds = defectTypeId ? [parseInt(defectTypeId)] : [];
            const res = await this.orm.call("tekstil.dashboard.service", "qc_submit_check", [
                parseInt(batchId),
                parseFloat(inspectedQty),
                parseFloat(grade1),
                parseFloat(grade2),
                parseFloat(rework),
                parseFloat(reject),
                defectIds,
                note,
            ]);
            if (res && res.success) {
                this.notification.add(res.message || "OTK xulosasi tasdiqlandi!", { type: "success" });
                await this.loadData();
            }
        } catch (e) {
            console.error(e);
            this.notification.add("OTK ma'lumotlarini saqlashda xatolik", { type: "danger" });
        }
    }
}

registry.category("actions").add("tekstil_manufacturing_dashboard", TekstilManufacturingDashboard);
