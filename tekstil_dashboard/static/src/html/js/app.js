/**
 * Ro'mol ishlab chiqarish mini-ERP - Boltshift Bar Chart & Modular State (app.js)
 */

const STATE_VERSION = "v12_clients_oldi_berdi";

const DEFAULT_APP_DATA = {
  rawMaterials: [
    {
      id: "raw-1",
      name: "Shifon 'Zumrad' keng rulon",
      category: "fabric",
      unit: "metr",
      stock: 420,
      minStock: 100,
      price: 22000,
      color: "Yashil / Zumrad",
      yieldPerMeter: 3,
      updatedAt: "2026-09-25 10:30"
    },
    {
      id: "raw-2",
      name: "Shoyi 'Atlas Gullik' rulon",
      category: "fabric",
      unit: "metr",
      stock: 180,
      minStock: 50,
      price: 26000,
      color: "Qizil / Gullik",
      yieldPerMeter: 3,
      updatedAt: "2026-09-25 11:15"
    },
    {
      id: "raw-3",
      name: "Swarovski DMS bezak toshlari",
      category: "accessory",
      unit: "dona",
      stock: 4800,
      minStock: 1000,
      price: 120,
      color: "Yaltiroq billur",
      yieldPerMeter: null,
      updatedAt: "2026-09-24 16:40"
    },
    {
      id: "raw-4",
      name: "Overlog tikuv iplari (Yashil/Oq)",
      category: "accessory",
      unit: "bobina",
      stock: 18,
      minStock: 5,
      price: 14000,
      color: "Yashil / Oq",
      yieldPerMeter: null,
      updatedAt: "2026-09-24 15:20"
    },
    {
      id: "raw-5",
      name: "Brend to'qima etiketkasi",
      category: "packaging",
      unit: "dona",
      stock: 850,
      minStock: 200,
      price: 700,
      color: "Zarhal logotip",
      yieldPerMeter: null,
      updatedAt: "2026-09-23 09:00"
    },
    {
      id: "raw-6",
      name: "Logotipli polietilen salafan paket",
      category: "packaging",
      unit: "dona",
      stock: 920,
      minStock: 200,
      price: 500,
      color: "Shaffof / Oltin",
      yieldPerMeter: null,
      updatedAt: "2026-09-23 09:00"
    }
  ],
  boms: [
    {
      id: "BOM-01",
      name: "Klassik Zumrad Shifon",
      size: "100x100 sm",
      fabricId: "raw-1",
      yieldPerMeter: 3,
      stoneId: "raw-3",
      stonesPerPiece: 25,
      threadCost: 360,
      labelCost: 700,
      packageCost: 500,
      laborCost: 5000,
      overheadCost: 1200,
      sellingPrice: 45000,
      retailPrice: 75000,
      notes: "Burchaklariga Swarovski tosh teriladi, yonlari zich overlog"
    },
    {
      id: "BOM-02",
      name: "Atlas Gullik Shifon",
      size: "95x95 sm",
      fabricId: "raw-2",
      yieldPerMeter: 3,
      stoneId: null,
      stonesPerPiece: 0,
      threadCost: 360,
      labelCost: 700,
      packageCost: 500,
      laborCost: 4000,
      overheadCost: 1200,
      sellingPrice: 38000,
      retailPrice: 65000,
      notes: "Milliy naqshli, toshsiz, yengil ipak mato"
    }
  ],
  batches: [
    {
      id: "BATCH-101",
      bomId: "BOM-01",
      name: "Klassik Zumrad Shifon",
      size: "100x100 sm",
      rollNumber: "RULON-#ZUM-01",
      fabricMetersCut: 20,
      yieldPerMeter: 3,
      quantity: 60,
      currentStage: "sewing",
      fabricId: "raw-1",
      stoneId: "raw-3",
      startDate: "2026-09-25",
      operator: "Dilnoza Tikuvchi",
      notes: "Overlog tikuv mashinasida yonlari tikilmoqda"
    },
    {
      id: "BATCH-102",
      bomId: "BOM-01",
      name: "Klassik Zumrad Shifon",
      size: "100x100 sm",
      rollNumber: "RULON-#ZUM-02",
      fabricMetersCut: 30,
      yieldPerMeter: 3,
      quantity: 90,
      currentStage: "stone",
      fabricId: "raw-1",
      stoneId: "raw-3",
      startDate: "2026-09-25",
      operator: "Nodira Termopresschi",
      notes: "Termopressda Swarovski toshlar yopishtirilmoqda"
    },
    {
      id: "BATCH-103",
      bomId: "BOM-02",
      name: "Atlas Gullik Shifon",
      size: "95x95 sm",
      rollNumber: "RULON-#ATL-01",
      fabricMetersCut: 20,
      yieldPerMeter: 3,
      quantity: 60,
      currentStage: "ironing",
      fabricId: "raw-2",
      stoneId: null,
      startDate: "2026-09-24",
      operator: "Malika Dazmolchi",
      notes: "Dazmollash va sifat nazorati stolidan o'tmoqda"
    },
    {
      id: "BATCH-104",
      bomId: "BOM-01",
      name: "Klassik Zumrad Shifon",
      size: "100x100 sm",
      rollNumber: "RULON-#ZUM-03",
      fabricMetersCut: 20,
      yieldPerMeter: 3,
      quantity: 60,
      currentStage: "cutting",
      fabricId: "raw-1",
      stoneId: "raw-3",
      startDate: "2026-09-25",
      operator: "Anvar Bichuvchi",
      notes: "Bichuv stolida 20 metr rulon kesilmoqda"
    }
  ],
  finishedGoods: [
    {
      id: "FG-201",
      name: "Klassik Zumrad Shifon",
      sku: "ROMOL-ZUM-100",
      size: "100x100 sm",
      color: "Zumrad Yashil",
      decorType: "Swarovski Toshli",
      stock: 140,
      price: 45000,
      costPrice: 18100,
      lastProduced: "2026-09-25"
    },
    {
      id: "FG-202",
      name: "Atlas Gullik Shifon",
      sku: "ROMOL-ATL-95",
      size: "95x95 sm",
      color: "Milliy Naqshli",
      decorType: "Toshsiz",
      stock: 95,
      price: 38000,
      costPrice: 15400,
      lastProduced: "2026-09-24"
    }
  ],
  financials: {
    monthlySalesVolume: 1150,
    monthlyRevenue: 48500000,
    totalRawMaterialsCost: 12850000,
    totalLaborCost: 5600000,
    totalOverheadCost: 3500000,
    netProfit: 26550000,
    profitMargin: 54.7
  },
  historyLogs: [
    {
      id: "LOG-1001",
      timestamp: "2026-09-25 15:20",
      action: "sale_out",
      description: "Chiqim: 50 dona \"Klassik Zumrad Shifon\" ('Chorsu Bozor' do'koni) ga sotildi. Jami: 2,250,000 so'm.",
      user: "Seh boshlig'i"
    },
    {
      id: "LOG-1002",
      timestamp: "2026-09-25 14:10",
      action: "batch_complete",
      description: "#BATCH-099 to'liq salafanlandi va 80 dona tayyor omborga qabul qilindi!",
      user: "Salafanlovchi"
    },
    {
      id: "LOG-1003",
      timestamp: "2026-09-25 11:30",
      action: "stage_move",
      description: "#BATCH-102 \"Tosh yopishtirish\" bosqichiga o'tkazildi (2,250 dona tosh sarflandi).",
      user: "Termopresschi"
    },
    {
      id: "LOG-1004",
      timestamp: "2026-09-25 10:00",
      action: "batch_start",
      description: "Yangi partiya #BATCH-104 (RULON-#ZUM-03, 60 dona) Bichuvga berildi. 20m rulon ochildi.",
      user: "Anvar Bichuvchi"
    },
    {
      id: "LOG-1005",
      timestamp: "2026-09-25 09:15",
      action: "raw_in",
      description: "Xomashyo kirimi: +150 metr \"Shifon 'Zumrad' keng rulon\" (22,000 so'mdan). Yangi o'rtacha tannarx: 22,000 so'm/metr.",
      user: "Omborchi"
    }
  ],
  clients: [
    {
      id: "cli-1",
      name: "Gulbahor Butik",
      contactPerson: "Gulbahor opa",
      phone: "+998 90 123-45-67",
      address: "Toshkent sh., Chorsu bozori, 4-qator 12-do'kon",
      balance: 8500000,
      totalPurchased: 18500000,
      totalPaid: 10000000,
      lastActivity: "2026-09-25 15:20",
      transactions: [
        {
          id: "tx-101",
          date: "2026-09-20 11:30",
          type: "sale",
          title: "Klassik Zumrad Shifon (160 dona)",
          amount: 7200000,
          paid: 4000000,
          debtChange: 3200000,
          balanceAfter: 3200000,
          paymentMethod: "Naqd pul",
          notes: "Boshlang'ich buyurtma yuborildi"
        },
        {
          id: "tx-102",
          date: "2026-09-23 16:45",
          type: "sale",
          title: "Klassik Zumrad (200 dona) + Atlas Gullik (50 dona)",
          amount: 10900000,
          paid: 3000000,
          debtChange: 7900000,
          balanceAfter: 11100000,
          paymentMethod: "Aralash",
          notes: "Katta partiya yetkazildi"
        },
        {
          id: "tx-103",
          date: "2026-09-25 15:20",
          type: "payment",
          title: "Qisman qarz to'lovi",
          amount: 2600000,
          paid: 2600000,
          debtChange: -2600000,
          balanceAfter: 8500000,
          paymentMethod: "Karta orqali (Click / Payme)",
          notes: "Bank ilovasi orqali o'tkazildi"
        }
      ]
    },
    {
      id: "cli-2",
      name: "Nafis Ro'mol Ulgurji",
      contactPerson: "Otabek aka",
      phone: "+998 93 456-78-90",
      address: "Qo'qon sh., Yangi bozor, Ulgurji savdo rastasi",
      balance: 0,
      totalPurchased: 12000000,
      totalPaid: 12000000,
      lastActivity: "2026-09-24 17:00",
      transactions: [
        {
          id: "tx-201",
          date: "2026-09-21 14:00",
          type: "sale",
          title: "Atlas Gullik Shifon (200 dona)",
          amount: 7600000,
          paid: 7600000,
          debtChange: 0,
          balanceAfter: 0,
          paymentMethod: "Naqd pul",
          notes: "Yuk olishda to'liq to'landi"
        },
        {
          id: "tx-202",
          date: "2026-09-24 17:00",
          type: "sale",
          title: "Atlas Gullik Shifon (115 dona)",
          amount: 4400000,
          paid: 4400000,
          debtChange: 0,
          balanceAfter: 0,
          paymentMethod: "Perechisleniye",
          notes: "Bank hisob raqamidan to'landi"
        }
      ]
    },
    {
      id: "cli-3",
      name: "Atlas Savdo",
      contactPerson: "Madina Karimova",
      phone: "+998 97 789-01-23",
      address: "Samarqand sh., Registon savdo majmuasi",
      balance: 4200000,
      totalPurchased: 7600000,
      totalPaid: 3400000,
      lastActivity: "2026-09-24 12:15",
      transactions: [
        {
          id: "tx-301",
          date: "2026-09-18 10:20",
          type: "sale",
          title: "Klassik Zumrad Shifon (80 dona)",
          amount: 3600000,
          paid: 2000000,
          debtChange: 1600000,
          balanceAfter: 1600000,
          paymentMethod: "Naqd pul",
          notes: "Birinchi buyurtma"
        },
        {
          id: "tx-302",
          date: "2026-09-24 12:15",
          type: "sale",
          title: "Atlas Gullik Shifon (105 dona)",
          amount: 4000000,
          paid: 1400000,
          debtChange: 2600000,
          balanceAfter: 4200000,
          paymentMethod: "Karta orqali",
          notes: "Qoldiq 10 kunda beriladi"
        }
      ]
    },
    {
      id: "cli-4",
      name: "Hilol Ro'mollari",
      contactPerson: "Jamshid aka",
      phone: "+998 91 333-22-11",
      address: "Andijon sh., Eski shahar bozori",
      balance: 0,
      totalPurchased: 5400000,
      totalPaid: 5400000,
      lastActivity: "2026-09-22 18:30",
      transactions: [
        {
          id: "tx-401",
          date: "2026-09-22 18:30",
          type: "sale",
          title: "Klassik Zumrad Shifon (120 dona)",
          amount: 5400000,
          paid: 5400000,
          debtChange: 0,
          balanceAfter: 0,
          paymentMethod: "Naqd pul",
          notes: "To'liq naqd to'langan"
        }
      ]
    }
  ]
};

let state = {
  rawMaterials: [],
  boms: [],
  batches: [],
  finishedGoods: [],
  financials: { ...DEFAULT_APP_DATA.financials },
  historyLogs: [],
  clients: [],
  activeTab: "dashboard",
  conveyorSubTab: "pipeline",
  rawFilter: "all",
  clientFilter: "all",
  searchQuery: "",
  clientSearchQuery: "",
  selectedRollId: null,
  selectedFinanceBomId: "",
  selectedStatementClientId: null
};

// Keshni tekshirish va ma'lumotlarni yuklash (Sahifa yangilanganda ma'lumot yo'qolmasligi kafolatlangan)
function loadInitialState() {
  try {
    const savedVersion = localStorage.getItem("romol_erp_version");
    const savedState = localStorage.getItem("romol_erp_state");

    // Versiya yangilanganda yoki dastlabki kirishda tushunarli demo ma'lumotlarni yuklash
    if (savedVersion !== STATE_VERSION || !savedState) {
      localStorage.setItem("romol_erp_version", STATE_VERSION);
      state.rawMaterials = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.rawMaterials));
      state.boms = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.boms));
      state.batches = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.batches));
      state.finishedGoods = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.finishedGoods));
      state.financials = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.financials));
      state.historyLogs = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.historyLogs));
      state.clients = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.clients));
      saveState();
      return;
    }

    const parsed = JSON.parse(savedState);
    state.rawMaterials = Array.isArray(parsed.rawMaterials) ? parsed.rawMaterials : JSON.parse(JSON.stringify(DEFAULT_APP_DATA.rawMaterials));
    state.boms = Array.isArray(parsed.boms) ? parsed.boms : JSON.parse(JSON.stringify(DEFAULT_APP_DATA.boms));
    state.batches = Array.isArray(parsed.batches) ? parsed.batches : JSON.parse(JSON.stringify(DEFAULT_APP_DATA.batches));
    state.finishedGoods = Array.isArray(parsed.finishedGoods) ? parsed.finishedGoods : JSON.parse(JSON.stringify(DEFAULT_APP_DATA.finishedGoods));
    state.financials = (parsed.financials && typeof parsed.financials === 'object')
      ? parsed.financials
      : JSON.parse(JSON.stringify(DEFAULT_APP_DATA.financials));
    state.historyLogs = Array.isArray(parsed.historyLogs) ? parsed.historyLogs : JSON.parse(JSON.stringify(DEFAULT_APP_DATA.historyLogs));
    state.clients = Array.isArray(parsed.clients) ? parsed.clients : JSON.parse(JSON.stringify(DEFAULT_APP_DATA.clients));
  } catch (e) {
    console.error("Lokal ma'lumotlarni o'qishda xatolik:", e);
  }
}

function saveState() {
  try {
    localStorage.setItem("romol_erp_version", STATE_VERSION);
    localStorage.setItem("romol_erp_state", JSON.stringify({
      rawMaterials: state.rawMaterials,
      boms: state.boms,
      batches: state.batches,
      finishedGoods: state.finishedGoods,
      financials: state.financials,
      historyLogs: state.historyLogs,
      clients: state.clients
    }));
  } catch (e) {
    console.error("Lokal xotiraga saqlashda xatolik:", e);
  }
}

function resetDemoData() {
  if (confirm("Haqiqatan ham tushunarli namunaviy demo ma'lumotlarni qayta tiklamoqchimisiz?")) {
    localStorage.removeItem("romol_erp_state");
    localStorage.setItem("romol_erp_version", STATE_VERSION);
    state.rawMaterials = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.rawMaterials));
    state.boms = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.boms));
    state.batches = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.batches));
    state.finishedGoods = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.finishedGoods));
    state.financials = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.financials));
    state.historyLogs = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.historyLogs));
    state.clients = JSON.parse(JSON.stringify(DEFAULT_APP_DATA.clients));
    saveState();
    renderApp();
    showToast("Namunaviy demo ma'lumotlar qayta tiklandi!", "info");
  }
}

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  let icon = type === "danger" ? "✕" : (type === "info" ? "ℹ" : "✓");
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function addLog(action, description, user = "Seh boshlig'i") {
  const newLog = {
    id: "LOG-" + Date.now().toString().slice(-4),
    timestamp: new Date().toLocaleString("uz-UZ", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit"
    }).replace(",", ""),
    action: action,
    description: description,
    user: user
  };
  state.historyLogs.unshift(newLog);
  saveState();
}

// Tab almashtirish
function switchTab(tabId) {
  state.activeTab = tabId;
  document.querySelectorAll(".sidebar-nav-item, .pill-item").forEach(item => {
    item.classList.toggle("active", item.dataset.tab === tabId);
  });

  const tabTitles = {
    dashboard: "📊 Ishlab Chiqarish va Ombor (Umumiy Boshqaruv)",
    conveyor: "🔄 Konveyer & BoM (7 Bosqichli Texnologik Zanjir)",
    raw_materials: "🧵 Xomashyo Ombori va Xaridlar",
    finished_goods: "📦 Tayyor Ro'mollar Ombori va Sotuv",
    clients: "🤝 Mijozlar Boshqaruvi va Oldi-Berdi (Nasiyalar & To'lovlar)",
    finance: "💵 Moliya, Tannarx va Foyda/Zarar (P&L Tahlili)",
    history: "📜 Harakatlar Qaydnomasi va Tarix"
  };
  const elTitle = document.getElementById("topbar-current-tab-title");
  if (elTitle) elTitle.textContent = tabTitles[tabId] || tabId;

  const tabs = ["dashboard", "conveyor", "raw_materials", "finished_goods", "clients", "finance", "history"];
  tabs.forEach(t => {
    const el = document.getElementById(`tab-content-${t}`);
    if (el) el.style.display = (t === tabId) ? "block" : "none";
  });

  renderApp();
}

function switchConveyorSubTab(subTab) {
  state.conveyorSubTab = subTab;
  document.getElementById("subtab-btn-pipeline").classList.toggle("active", subTab === "pipeline");
  document.getElementById("subtab-btn-bom").classList.toggle("active", subTab === "bom");

  document.getElementById("conveyor-pipeline-view").style.display = subTab === "pipeline" ? "block" : "none";
  document.getElementById("conveyor-bom-view").style.display = subTab === "bom" ? "block" : "none";

  if (subTab === "pipeline") {
    renderRollTracker();
    render7StageConveyor();
  } else {
    renderBOMView();
  }
}

// Asosiy render
function renderApp() {
  updateBadges();

  renderDashboardKPIs();
  renderConveyorKPIs();
  renderRawMaterialsKPIs();
  renderFinishedGoodsKPIs();
  renderClientsKPIs();
  renderFinanceKPIs();
  renderHistoryKPIs();

  if (state.activeTab === "dashboard") {
    renderDashboardView();
  } else if (state.activeTab === "conveyor") {
    switchConveyorSubTab(state.conveyorSubTab);
  } else if (state.activeTab === "raw_materials") {
    renderRawMaterialsTable();
  } else if (state.activeTab === "finished_goods") {
    renderFinishedGoodsTable();
  } else if (state.activeTab === "clients") {
    renderClientsTable();
  } else if (state.activeTab === "finance") {
    renderFinanceView();
  } else if (state.activeTab === "history") {
    renderHistoryTable();
  }
}

function updateBadges() {
  const activeBatchesCount = state.batches.filter(b => b.currentStage !== "completed").length;
  const conveyorBadge = document.getElementById("badge-conveyor-count");
  if (conveyorBadge) conveyorBadge.textContent = activeBatchesCount;

  // Mijozlar nasiya nishoni
  const debtors = (state.clients || []).filter(c => (c.balance || 0) > 0);
  const clientBadge = document.getElementById("badge-clients-debt");
  if (clientBadge) {
    if (debtors.length > 0) {
      clientBadge.style.display = "inline-flex";
      clientBadge.textContent = debtors.length + " ta nasiya";
    } else {
      clientBadge.style.display = "none";
    }
  }
}

// -------------------------------------------------------------
// 1. DASHBOARD MAXSUS KPI VA VERTIKAL USTUNLI GRAFIK (BAR CHART)
// -------------------------------------------------------------
function updateRadialGauge(percent) {
  const svg = document.getElementById("gauge-radial-svg");
  if (!svg) return;
  const lines = svg.querySelectorAll("line");
  const totalTicks = lines.length;
  const activeCount = Math.round((percent / 100) * totalTicks);
  lines.forEach((line, idx) => {
    line.setAttribute("stroke", idx < activeCount ? "#1e60ff" : "#e2e8f0");
  });
}

function renderDashboardKPIs() {
  const totalFinished = state.finishedGoods.reduce((sum, item) => sum + item.stock, 0);
  const totalInProcess = state.batches.filter(b => b.currentStage !== "completed").reduce((sum, b) => sum + b.quantity, 0);
  const totalFabricMeters = state.rawMaterials.filter(r => r.category === "fabric").reduce((sum, r) => sum + r.stock, 0);

  const target = 1500;
  const planPercent = Math.min(100, Math.round((totalFinished / target) * 100));

  const elFin = document.getElementById("dash-kpi-finished");
  if (elFin) elFin.textContent = totalFinished.toLocaleString() + " dona";

  const elProc = document.getElementById("dash-kpi-process");
  if (elProc) elProc.textContent = totalInProcess.toLocaleString() + " dona";

  const elFab = document.getElementById("dash-kpi-fabric");
  if (elFab) elFab.textContent = totalFabricMeters.toLocaleString() + " m";

  const elPlan = document.getElementById("dash-kpi-plan");
  if (elPlan) elPlan.textContent = planPercent + "%";

  const gaugePercent = document.getElementById("gauge-percent-text");
  if (gaugePercent) gaugePercent.textContent = planPercent + "%";

  const gaugeTotal = document.getElementById("gauge-subcard-total");
  if (gaugeTotal) gaugeTotal.textContent = (totalFinished + totalInProcess).toLocaleString() + " dona";

  updateRadialGauge(planPercent);
}

// BOLTSHIFT VERTIKAL USTUNLI GRAFIKNI CHIZISH
function renderDashboardBarChart() {
  const container = document.getElementById("dashboard-bar-chart-container");
  if (!container) return;

  const stages = [
    { id: "cutting", label: "1. Bichuv", fullName: "✂️ 1. Bichuv (Rulon kesish)", count: 0 },
    { id: "splitting", label: "2. Donalash", fullName: "📐 2. Donalash (3 bo'lakka)", count: 0 },
    { id: "sewing", label: "3. Tikish", fullName: "🪡 3. Yonlarini tikish", count: 0 },
    { id: "stone", label: "4. Tosh", fullName: "✨ 4. Tosh yopishtirish", count: 0 },
    { id: "ironing", label: "5. Dazmol", fullName: "💨 5. Dazmollash", count: 0 },
    { id: "labeling", label: "6. Etiketka", fullName: "🏷️ 6. Etiketka qadash", count: 0 },
    { id: "packaging", label: "7. Salafan", fullName: "📦 7. Salafan & Ombor", count: 0 }
  ];

  state.batches.forEach(b => {
    const st = stages.find(s => s.id === b.currentStage);
    if (st) st.count += b.quantity;
  });

  const maxVal = Math.max(...stages.map(s => s.count));
  const maxCount = Math.max(250, maxVal);
  const ySteps = [250, 180, 100, 0];

  // Eng faol ustun faqat qachonki qiymat > 0 bo'lsa
  let peakStage = null;
  if (maxVal > 0) {
    peakStage = stages.find(s => s.count === maxVal);
  }

  const yAxisHtml = `
    <div class="chart-y-scale">
      ${ySteps.map(step => `<span>${step}</span>`).join("")}
    </div>
  `;

  const gridLinesHtml = `
    <div class="chart-dash-lines">
      ${ySteps.map(() => `<div class="chart-dash-line"></div>`).join("")}
    </div>
  `;

  const columnsHtml = stages.map(st => {
    const isPeak = peakStage && st.id === peakStage.id && st.count > 0;
    const barHeightPercent = st.count === 0 ? 0 : Math.max(8, Math.round((st.count / maxCount) * 100));

    const tooltipHtml = isPeak ? `
      <div class="bolt-floating-tooltip">
        <div class="tooltip-badge-title">${st.fullName}</div>
        <div class="tooltip-badge-val">Jami: ${st.count} dona ro'mol</div>
      </div>
    ` : '';

    return `
      <div class="chart-stage-column" onclick="switchTab('conveyor')">
        ${tooltipHtml}
        <div class="chart-stage-bar ${isPeak ? 'active-highlight' : ''}" style="height: ${barHeightPercent}%;"></div>
        <div class="chart-stage-label">${st.label}</div>
      </div>
    `;
  }).join("");

  container.innerHTML = `
    ${yAxisHtml}
    <div class="chart-stage-area">
      ${gridLinesHtml}
      ${columnsHtml}
    </div>
  `;
}

function renderDashboardView() {
  renderDashboardBarChart();

  const recentTableEl = document.getElementById("dashboard-recent-batches");
  if (recentTableEl) {
    const search = state.searchQuery.toLowerCase();
    const activeBatches = state.batches
      .filter(b => b.currentStage !== "completed")
      .filter(b => b.name.toLowerCase().includes(search) || b.id.toLowerCase().includes(search) || (b.rollNumber && b.rollNumber.toLowerCase().includes(search)));

    if (activeBatches.length === 0) {
      recentTableEl.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:#94a3b8;">Faol partiyalar topilmadi</td></tr>`;
      return;
    }

    recentTableEl.innerHTML = activeBatches.map(b => {
      const stageLabels = {
        cutting: "✂️ 1. Bichuv", splitting: "📐 2. Donalash", sewing: "🪡 3. Tikish",
        stone: "✨ 4. Tosh", ironing: "💨 5. Dazmol", labeling: "🏷️ 6. Etiketka", packaging: "📦 7. Salafan"
      };
      const nextBtnLabel = b.currentStage === "packaging" ? "✅ Omborga" : "Keyingisiga ➔";

      return `
        <tr>
          <td><input type="checkbox"></td>
          <td><span style="font-weight:700; color:#1e60ff;">#${b.id}</span></td>
          <td><span class="roll-tag">${b.rollNumber || "RULON-X"}</span></td>
          <td><strong style="color:#0f172a;">${b.name}</strong> <span style="font-size:12px; color:#64748b;">(${b.size})</span></td>
          <td>${b.fabricMetersCut || Math.ceil(b.quantity / 3)} m</td>
          <td><strong style="color:#0f172a; font-size:15px;">${b.quantity} dona</strong></td>
          <td><span class="pill-status status-sewing">${stageLabels[b.currentStage] || b.currentStage}</span></td>
          <td>
            <button class="pill-action-btn btn-primary" style="padding: 6px 14px; font-size: 12.5px;" onclick="advanceBatchStage('${b.id}')">
              ${nextBtnLabel}
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }
}

// -------------------------------------------------------------
// 2. KONVEYER VIEW (RULONLAR & 7 BOSQICH KANBAN)
// -------------------------------------------------------------
function renderConveyorKPIs() {
  const activeBatches = state.batches.filter(b => b.currentStage !== "completed");
  const activeRollsCount = activeBatches.length;

  let cuttingQty = 0;
  let sewingQty = 0;
  let finishingQty = 0;

  activeBatches.forEach(b => {
    if (b.currentStage === "cutting" || b.currentStage === "splitting") cuttingQty += b.quantity;
    else if (b.currentStage === "sewing" || b.currentStage === "stone") sewingQty += b.quantity;
    else if (b.currentStage === "ironing" || b.currentStage === "labeling" || b.currentStage === "packaging") finishingQty += b.quantity;
  });

  const elRolls = document.getElementById("conv-kpi-rolls");
  if (elRolls) elRolls.textContent = activeRollsCount + " ta rulon";

  const elCut = document.getElementById("conv-kpi-cutting");
  if (elCut) elCut.textContent = cuttingQty.toLocaleString() + " dona";

  const elSew = document.getElementById("conv-kpi-sewing");
  if (elSew) elSew.textContent = sewingQty.toLocaleString() + " dona";

  const elFin = document.getElementById("conv-kpi-finishing");
  if (elFin) elFin.textContent = finishingQty.toLocaleString() + " dona";
}

function renderRollTracker() {
  const rollListEl = document.getElementById("roll-tracker-list");
  if (!rollListEl) return;

  const activeBatches = state.batches.filter(b => b.currentStage !== "completed");
  const badgeEl = document.getElementById("roll-count-badge");
  if (badgeEl) badgeEl.textContent = activeBatches.length + " ta";

  if (activeBatches.length === 0) {
    rollListEl.innerHTML = `<div style="text-align:center; padding:20px; color:#94a3b8; font-size:13px;">Faol rulonlar yo'q</div>`;
    return;
  }

  const stageIcons = {
    cutting: "✂️ Bichuvda", splitting: "📐 Donalashda", sewing: "🪡 Tikuvda",
    stone: "✨ Toshda", ironing: "💨 Dazmolda", labeling: "🏷️ Etiketkada", packaging: "📦 Salafanda"
  };

  rollListEl.innerHTML = activeBatches.map(b => {
    const isSelected = state.selectedRollId === b.id;
    return `
      <div class="roll-item-box ${isSelected ? 'active-roll' : ''}" onclick="focusRollBatch('${b.id}')">
        <div class="roll-item-top">
          <span class="roll-tag">${b.rollNumber || b.id}</span>
          <span class="roll-stage-pill">${stageIcons[b.currentStage] || b.currentStage}</span>
        </div>
        <div class="roll-name-text">${b.name}</div>
        <div class="roll-metrics-row">
          <span>Kesilgan: <strong>${b.fabricMetersCut || Math.ceil(b.quantity / 3)} m</strong></span>
          <span>Chiqish: <strong>${b.quantity} dona</strong></span>
        </div>
        <div style="font-size:11.5px; color:#64748b; display:flex; justify-content:space-between; align-items:center; border-top:1px dashed #e2e8f0; padding-top:6px; margin-top:2px;">
          <span>👤 ${b.operator || "Usta"}</span>
          <span style="color:#1e60ff; font-weight:700;">1m ➔ 3 ta</span>
        </div>
      </div>
    `;
  }).join("");
}

function focusRollBatch(batchId) {
  state.selectedRollId = state.selectedRollId === batchId ? null : batchId;
  renderRollTracker();
  render7StageConveyor();
}

function render7StageConveyor() {
  const boardEl = document.getElementById("pipeline-7-board");
  if (!boardEl) return;

  const stages = [
    { id: "cutting", title: "1. Bichuv", sub: "Rulon kesish", icon: "✂️" },
    { id: "splitting", title: "2. Donalash", sub: "3 bo'lakka", icon: "📐" },
    { id: "sewing", title: "3. Tikish", sub: "Yonlari overlog", icon: "🪡" },
    { id: "stone", title: "4. Tosh", sub: "Yopishtirish", icon: "✨" },
    { id: "ironing", title: "5. Dazmol", sub: "Sifat nazorati", icon: "💨" },
    { id: "labeling", title: "6. Etiketka", sub: "Qadash", icon: "🏷️" },
    { id: "packaging", title: "7. Salafan", sub: "Tayyor ombor", icon: "📦" }
  ];

  boardEl.innerHTML = stages.map(st => {
    let stageBatches = state.batches.filter(b => b.currentStage === st.id);
    if (state.selectedRollId) {
      stageBatches = stageBatches.filter(b => b.id === state.selectedRollId);
    }
    const totalQty = stageBatches.reduce((sum, b) => sum + b.quantity, 0);

    const cardsHtml = stageBatches.length > 0
      ? stageBatches.map(b => {
          const stageIds = ["cutting", "splitting", "sewing", "stone", "ironing", "labeling", "packaging"];
          const stageIdx = stageIds.indexOf(b.currentStage);
          const nextBtnText = b.currentStage === "packaging" ? "✅ Tayyor ombor" : "Keyingisiga ➔";
          const isSelected = state.selectedRollId === b.id;

          const stepBarHtml = `
            <div class="batch-step-bar" title="7 bosqichdan ${stageIdx + 1}-bosqichda (${stageIdx + 1}/7)">
              ${stageIds.map((s, idx) => `<span class="step-segment ${idx <= stageIdx ? 'filled' : ''}"></span>`).join('')}
              <span class="step-label">${stageIdx + 1}/7</span>
            </div>
          `;

          return `
            <div class="stage-batch-card" style="${isSelected ? 'border-color: #1e60ff; box-shadow:0 4px 15px rgba(30,96,255,0.2);' : ''}">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="roll-tag">${b.rollNumber || b.id}</span>
                <span style="font-size:12px; font-weight:800; color:#0f172a;">${b.quantity} dona</span>
              </div>
              ${stepBarHtml}
              <div style="font-size:13.5px; font-weight:700; color:#0f172a; line-height:1.3; margin-top:2px;">${b.name}</div>
              <div style="font-size:11.5px; color:#64748b; background:#f8fafc; padding:6px 8px; border-radius:8px;">
                <div>Kesilgan: <b>${b.fabricMetersCut || Math.ceil(b.quantity / 3)}m</b> (1m ➔ 3 ta)</div>
                <div>O'lcham: <b>${b.size}</b></div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                <span style="font-size:11.5px; color:#64748b;">👤 ${b.operator || "Usta"}</span>
                <button class="pill-action-btn btn-primary" style="padding:4px 10px; font-size:11.5px;" onclick="advanceBatchStage('${b.id}')">
                  ${nextBtnText}
                </button>
              </div>
            </div>
          `;
        }).join("")
      : `<div style="text-align:center; padding:35px 10px; color:#94a3b8; font-size:12px; border:1px dashed #cbd5e1; border-radius:10px;">Partiya yo'q</div>`;

    return `
      <div class="stage-7-col">
        <div class="stage-7-header">
          <div class="stage-7-title">
            <span>${st.icon} ${st.title}</span>
            <span class="stage-7-count">${stageBatches.length} ta</span>
          </div>
          <div style="font-size:11px; color:#64748b;">${st.sub} (${totalQty} dona)</div>
        </div>
        <div class="stage-7-cards">
          ${cardsHtml}
        </div>
      </div>
    `;
  }).join("");
}

function advanceBatchStage(batchId) {
  const batch = state.batches.find(b => b.id === batchId);
  if (!batch) return;

  const stageOrder = ["cutting", "splitting", "sewing", "stone", "ironing", "labeling", "packaging", "completed"];
  const currentIndex = stageOrder.indexOf(batch.currentStage);
  if (currentIndex === -1 || currentIndex >= stageOrder.length - 1) return;

  let nextStage = stageOrder[currentIndex + 1];

  if (nextStage === "stone" && (!batch.stoneId || batch.stoneId === "")) {
    nextStage = "ironing";
  }

  if (nextStage === "sewing") {
    const thread = state.rawMaterials.find(r => r.category === "accessory" && r.unit === "bobina");
    if (thread && thread.stock >= 0.5) {
      const consumed = (batch.quantity * 0.02).toFixed(2);
      thread.stock = Math.max(0, thread.stock - consumed);
      addLog("raw_consume", `#${batch.id} tikuvga kirdi: ~${consumed} bobina tikuv ipi sarflandi.`);
    }
  }

  if (nextStage === "stone" && batch.stoneId) {
    const stone = state.rawMaterials.find(r => r.id === batch.stoneId);
    const bom = state.boms.find(bm => bm.id === batch.bomId);
    const stonesPerPc = bom ? bom.stonesPerPiece : 25;
    const totalStones = batch.quantity * stonesPerPc;

    if (stone && stone.stock >= totalStones) {
      stone.stock -= totalStones;
      addLog("raw_consume", `#${batch.id} uchun ${totalStones} dona tosh (${stone.name}) yopishtirildi.`);
    }
  }

  if (nextStage === "labeling") {
    const label = state.rawMaterials.find(r => r.category === "packaging" && r.name.toLowerCase().includes("etiketka"));
    if (label && label.stock >= batch.quantity) {
      label.stock -= batch.quantity;
      addLog("raw_consume", `#${batch.id} uchun ${batch.quantity} dona brend etiketkasi sarflandi.`);
    }
  }

  if (nextStage === "packaging") {
    const pkg = state.rawMaterials.find(r => r.category === "packaging" && r.name.toLowerCase().includes("salafan"));
    if (pkg && pkg.stock >= batch.quantity) {
      pkg.stock -= batch.quantity;
      addLog("raw_consume", `#${batch.id} uchun ${batch.quantity} dona salafan paket sarflandi.`);
    }
  }

  if (nextStage === "completed") {
    batch.currentStage = "completed";
    let existingGoods = state.finishedGoods.find(g => g.name === batch.name && g.size === batch.size);
    if (existingGoods) {
      existingGoods.stock += batch.quantity;
      existingGoods.lastProduced = new Date().toISOString().slice(0, 10);
    } else {
      state.finishedGoods.push({
        id: "FG-" + Date.now().toString().slice(-4),
        name: batch.name,
        sku: "ROMOL-" + Math.floor(100 + Math.random() * 900),
        size: batch.size,
        color: "Standart",
        decorType: batch.stoneId ? "Toshli" : "Toshsiz",
        stock: batch.quantity,
        price: 95000,
        costPrice: 46000,
        lastProduced: new Date().toISOString().slice(0, 10)
      });
    }

    addLog("batch_complete", `#${batch.id} (${batch.rollNumber}) to'liq salafanlandi va ${batch.quantity} dona tayyor omborga qabul qilindi!`);
    showToast(`${batch.quantity} dona tayyor ro'mol omborga qabul qilindi!`, "success");
    saveState();
    renderApp();
    return;
  }

  batch.currentStage = nextStage;
  const stageLabels = {
    cutting: "Bichuv", splitting: "Donalash", sewing: "Tikish", stone: "Tosh yopishtirish",
    ironing: "Dazmollash", labeling: "Etiketka", packaging: "Salafanlash"
  };

  addLog("stage_move", `#${batch.id} "${stageLabels[nextStage]}" bosqichiga o'tkazildi.`);
  showToast(`#${batch.id} "${stageLabels[nextStage]}"ga o'tkazildi.`, "info");
  saveState();
  renderApp();
}

// -------------------------------------------------------------
// BoM VIEW
// -------------------------------------------------------------
function renderBOMView() {
  const container = document.getElementById("bom-cards-grid");
  if (!container) return;

  if (state.boms.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: #ffffff; border-radius: 16px; border: 1px dashed #cbd5e1;">
        <div style="font-size: 36px; margin-bottom: 8px;">📋</div>
        <strong style="color: #0f172a; font-size: 16px;">Hozircha BoM retseptlari kiritilmagan</strong>
        <p style="font-size: 13px; color: #64748b; margin-top: 4px; margin-bottom: 16px;">
          Yangi partiyalar ochish va tannarxni hisoblash uchun avval mahsulot BoM retseptini kiriting.
        </p>
        <button class="pill-action-btn btn-primary" onclick="openBOMModal()">
          <span>➕ Yangi BoM Kiritish</span>
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = state.boms.map(bom => {
    const fabric = state.rawMaterials.find(r => r.id === bom.fabricId);
    const fabricName = fabric ? fabric.name : "Rulon Mato";
    const stone = state.rawMaterials.find(r => r.id === bom.stoneId);
    const stoneName = stone ? stone.name : (bom.stonesPerPiece > 0 ? "Bezak tosh" : "Toshsiz");

    return `
      <div class="bom-card">
        <div class="bom-header">
          <div>
            <span class="roll-tag">${bom.id}</span>
            <div class="bom-title" style="margin-top:4px;">${bom.name}</div>
            <div style="font-size:12px; color:#64748b;">O'lcham: <b>${bom.size}</b></div>
          </div>
          <span class="bom-yield-badge">1m ➔ ${bom.yieldPerMeter || 3} dona</span>
        </div>

        <div class="bom-recipe-list">
          <div class="bom-recipe-row"><span>Rulon mato:</span><strong>${fabricName}</strong></div>
          <div class="bom-recipe-row"><span>Bichuv normasi:</span><strong>1 dona = ${(1 / (bom.yieldPerMeter || 3)).toFixed(2)} metr</strong></div>
          <div class="bom-recipe-row"><span>Tosh sarfi:</span><strong>${bom.stonesPerPiece > 0 ? `${bom.stonesPerPiece} dona (${stoneName})` : "Toshsiz model"}</strong></div>
          <div class="bom-recipe-row"><span>Tikuv ipi:</span><strong>${bom.threadPerPiece || 0.02} bobina</strong></div>
          <div class="bom-recipe-row"><span>Qadoqlash:</span><strong>1 ta etiketka + 1 ta salafan</strong></div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f3f7; padding-top:12px;">
          <button class="pill-action-btn" style="padding:6px 14px; font-size:12.5px;" onclick="openBOMModal('${bom.id}')">✏️ Tahrirlash</button>
          <button class="pill-action-btn btn-primary" style="padding:6px 14px; font-size:12.5px;" onclick="openNewBatchModal('${bom.id}')">⚡ Partiya Boshlash</button>
        </div>
      </div>
    `;
  }).join("");
}

function openBOMModal(bomId = null) {
  const fabricSelect = document.getElementById("bom-fabric-select");
  const stoneSelect = document.getElementById("bom-stone-select");

  const fabrics = state.rawMaterials.filter(r => r.category === "fabric");
  if (fabrics.length === 0) {
    fabricSelect.innerHTML = `<option value="">⚠️ Hozircha rulon mato yo'q (Avval omborga kirim qiling)</option>`;
  } else {
    fabricSelect.innerHTML = fabrics.map(f => `<option value="${f.id}">${f.name} (${f.stock} metr qoldiq)</option>`).join("");
  }

  const stones = state.rawMaterials.filter(r => r.category === "accessory" && r.unit === "dona");
  stoneSelect.innerHTML = `<option value="">Toshsiz / Oddiy chekka</option>` + stones.map(s => `<option value="${s.id}">${s.name} (${s.stock} dona)</option>`).join("");

  if (bomId) {
    const bom = state.boms.find(b => b.id === bomId);
    if (bom) {
      document.getElementById("bom-modal-title").textContent = `✏️ BoM Retseptini Tahrirlash (${bom.id})`;
      document.getElementById("bom-edit-id").value = bom.id;
      document.getElementById("bom-name").value = bom.name;
      document.getElementById("bom-size").value = bom.size;
      document.getElementById("bom-fabric-select").value = bom.fabricId;
      document.getElementById("bom-yield").value = bom.yieldPerMeter || 3;
      document.getElementById("bom-stone-select").value = bom.stoneId || "";
      document.getElementById("bom-stones-count").value = bom.stonesPerPiece || 0;
      document.getElementById("bom-notes").value = bom.notes || "";
    }
  } else {
    document.getElementById("bom-modal-title").textContent = `➕ Yangi BoM Retsepti Kiritish`;
    document.getElementById("bom-edit-id").value = "";
    document.getElementById("bom-name").value = "";
    document.getElementById("bom-size").value = "100x100 sm";
    document.getElementById("bom-yield").value = 3;
    document.getElementById("bom-stone-select").value = "";
    document.getElementById("bom-stones-count").value = 20;
    document.getElementById("bom-notes").value = "";
  }

  document.getElementById("modal-bom").classList.add("open");
}

function saveBOM(e) {
  e.preventDefault();
  const editId = document.getElementById("bom-edit-id").value;
  const name = document.getElementById("bom-name").value.trim();
  const size = document.getElementById("bom-size").value;
  const fabricId = document.getElementById("bom-fabric-select").value;
  const yieldPerMeter = parseInt(document.getElementById("bom-yield").value) || 3;
  const stoneId = document.getElementById("bom-stone-select").value || null;
  const stonesPerPiece = parseInt(document.getElementById("bom-stones-count").value) || 0;
  const notes = document.getElementById("bom-notes").value.trim();

  if (!name) return;

  if (editId) {
    const bom = state.boms.find(b => b.id === editId);
    if (bom) {
      bom.name = name;
      bom.size = size;
      bom.fabricId = fabricId;
      bom.yieldPerMeter = yieldPerMeter;
      bom.stoneId = stoneId;
      bom.stonesPerPiece = stonesPerPiece;
      bom.notes = notes;
      addLog("bom_update", `BoM #${editId} ("${name}") tahrirlandi.`);
      showToast(`BoM retsepti saqlandi!`, "success");
    }
  } else {
    const newId = "BOM-0" + (state.boms.length + 1);
    state.boms.push({
      id: newId, name: name, size: size, fabricId: fabricId,
      yieldPerMeter: yieldPerMeter, stoneId: stoneId, stonesPerPiece: stonesPerPiece,
      threadCost: 360, labelCost: 800, packageCost: 600,
      laborCost: 5000, overheadCost: 1200, sellingPrice: 45000, retailPrice: 85000,
      notes: notes
    });
    addLog("bom_create", `Yangi BoM #${newId} ("${name}") kiritildi.`);
    showToast(`Yangi BoM #${newId} yaratildi!`, "success");
  }

  saveState();
  closeModal("modal-bom");
  renderBOMView();
}

// -------------------------------------------------------------
// YANGI PARTIYA BOSH LASH MODALI
// -------------------------------------------------------------
function openNewBatchModal(selectedBomId = null) {
  if (state.boms.length === 0) {
    alert("Ishlab chiqarish partiyasini ochishdan avval kamida 1 ta Mahsulot BoM (retsepti) kiritilgan bo'lishi kerak! Hozir sizni BoM kiritish oynasiga o'tkazaman.");
    switchTab('conveyor');
    switchConveyorSubTab('bom');
    openBOMModal();
    return;
  }

  const bomSelect = document.getElementById("batch-bom-select");
  bomSelect.innerHTML = state.boms.map(b => `
    <option value="${b.id}" ${b.id === selectedBomId ? 'selected' : ''}>
      ${b.name} (${b.size}) - 1m ➔ ${b.yieldPerMeter || 3} dona
    </option>
  `).join("");

  onBatchBOMChange();
  document.getElementById("modal-new-batch").classList.add("open");
}

function onBatchBOMChange() {
  const bomId = document.getElementById("batch-bom-select").value;
  const bom = state.boms.find(b => b.id === bomId) || state.boms[0];
  if (!bom) return;

  document.getElementById("batch-name").value = bom.name;
  document.getElementById("batch-size").value = bom.size;
  document.getElementById("batch-roll-number").value = `RULON-#${Math.floor(100 + Math.random() * 899)}`;
  document.getElementById("batch-quantity").value = 120;
  calculateBatchNeeds();
}

function calculateBatchNeeds() {
  const bomId = document.getElementById("batch-bom-select").value;
  const bom = state.boms.find(b => b.id === bomId) || state.boms[0];
  const qty = parseInt(document.getElementById("batch-quantity").value) || 0;
  const calcBox = document.getElementById("batch-calc-info");
  if (!bom || !calcBox) return;

  const yieldPerMeter = bom.yieldPerMeter || 3;
  const neededMeters = Math.ceil(qty / yieldPerMeter);
  const fabric = state.rawMaterials.find(r => r.id === bom.fabricId);
  const currentStock = fabric ? fabric.stock : 0;
  const isEnough = currentStock >= neededMeters;
  const totalStones = qty * (bom.stonesPerPiece || 0);

  calcBox.innerHTML = `
    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
      <span>Bichuv normasi:</span><span><b>1 metr rulondan ${yieldPerMeter} dona ro'mol</b></span>
    </div>
    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
      <span>Kerakli rulon metri:</span><span>${qty} / ${yieldPerMeter} = <b>${neededMeters} metr</b></span>
    </div>
    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
      <span>Ombordagi rulon astatkasi:</span>
      <span style="color:${isEnough ? '#059669' : '#dc2626'}; font-weight:700;">
        ${currentStock} m (${isEnough ? 'Yetarli ✓' : 'Yetarli emas ✕'})
      </span>
    </div>
    ${bom.stonesPerPiece > 0 ? `
      <div style="display:flex; justify-content:space-between; border-top:1px dashed rgba(30,96,255,0.3); padding-top:4px; margin-top:4px;">
        <span>Kerakli tosh soni:</span><span><b>${totalStones} dona</b> (${bom.stonesPerPiece} ta/dona)</span>
      </div>
    ` : ''}
  `;
}

function submitNewBatch(e) {
  e.preventDefault();
  const bomId = document.getElementById("batch-bom-select").value;
  const bom = state.boms.find(b => b.id === bomId);
  const name = document.getElementById("batch-name").value.trim();
  const size = document.getElementById("batch-size").value;
  const rollNumber = document.getElementById("batch-roll-number").value.trim();
  const quantity = parseInt(document.getElementById("batch-quantity").value);

  if (!bom || isNaN(quantity) || quantity <= 0) return;

  const yieldPerMeter = bom.yieldPerMeter || 3;
  const neededMeters = Math.ceil(quantity / yieldPerMeter);

  const fabric = state.rawMaterials.find(r => r.id === bom.fabricId);
  if (fabric && fabric.stock < neededMeters) {
    if (!confirm(`Omborda faqat ${fabric.stock}m mato bor. Sizga ${neededMeters}m kerak. Baribir davom ettirilsinmi?`)) {
      return;
    }
  }

  if (fabric) {
    fabric.stock = Math.max(0, fabric.stock - neededMeters);
    fabric.updatedAt = new Date().toISOString().slice(0, 16).replace("T", " ");
  }

  const newBatchId = "BATCH-" + Math.floor(105 + Math.random() * 890);
  const newBatch = {
    id: newBatchId,
    bomId: bom.id,
    name: name,
    size: size,
    rollNumber: rollNumber,
    fabricMetersCut: neededMeters,
    yieldPerMeter: yieldPerMeter,
    quantity: quantity,
    currentStage: "cutting",
    fabricId: bom.fabricId,
    stoneId: bom.stoneId,
    startDate: new Date().toISOString().slice(0, 10),
    operator: "Nodir Bichuvchi",
    notes: "BoM retsepti asosida ishga tushirildi"
  };

  state.batches.unshift(newBatch);
  addLog("batch_start", `Yangi partiya #${newBatchId} (${rollNumber}, ${quantity} dona) Bichuvga berildi. ${neededMeters}m rulon ochildi.`);
  saveState();
  closeModal("modal-new-batch");
  renderApp();
  showToast(`Partiya #${newBatchId} (${rollNumber}) ishga tushirildi!`, "success");
}

// -------------------------------------------------------------
// 3. XOMASHYO OMBORI VA YANGI TUR QO'SHISH
// -------------------------------------------------------------
function renderRawMaterialsKPIs() {
  const totalFabrics = state.rawMaterials.filter(r => r.category === "fabric").reduce((sum, r) => sum + r.stock, 0);
  const totalStones = state.rawMaterials.filter(r => r.category === "accessory" && r.unit === "dona").reduce((sum, r) => sum + r.stock, 0);
  const totalThreads = state.rawMaterials.filter(r => r.unit === "bobina").reduce((sum, r) => sum + r.stock, 0);
  const totalPackaging = state.rawMaterials.filter(r => r.category === "packaging").reduce((sum, r) => sum + r.stock, 0);

  const elFab = document.getElementById("raw-kpi-fabrics");
  if (elFab) elFab.textContent = totalFabrics.toLocaleString() + " m";

  const elStn = document.getElementById("raw-kpi-stones");
  if (elStn) elStn.textContent = totalStones.toLocaleString() + " dona";

  const elThr = document.getElementById("raw-kpi-threads");
  if (elThr) elThr.textContent = totalThreads.toLocaleString() + " bobina";

  const elPkg = document.getElementById("raw-kpi-packaging");
  if (elPkg) elPkg.textContent = totalPackaging.toLocaleString() + " dona";
}

function setRawFilter(category) {
  state.rawFilter = category;
  document.querySelectorAll(".raw-filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === category);
  });
  renderRawMaterialsTable();
}

function renderRawMaterialsTable() {
  const tableBody = document.getElementById("raw-materials-table-body");
  if (!tableBody) return;

  const search = state.searchQuery.toLowerCase();
  const filtered = state.rawMaterials.filter(item => {
    const matchesFilter = state.rawFilter === "all" || item.category === state.rawFilter;
    const matchesSearch = item.name.toLowerCase().includes(search) || (item.color && item.color.toLowerCase().includes(search));
    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:45px 20px; color:#94a3b8;">
          <div style="font-size:32px; margin-bottom:6px;">🧵</div>
          <strong style="color:#0f172a; font-size:15px;">Xomashyo ombori hozircha bo'sh</strong>
          <div style="font-size:13px; color:#64748b; margin-top:4px;">Yuqoridagi «+ Kirim Qilish» tugmasini bosib, mato, tosh, ip yoki qadoqlarni kirim qiling.</div>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(item => {
    const isLow = item.stock <= item.minStock;
    const catLabels = { fabric: "Rulon Mato", accessory: "Tosh & Ip", packaging: "Qadoq" };

    return `
      <tr>
        <td>
          <div style="font-weight:700; color:#0f172a; font-size:14.5px;">${item.name}</div>
          <div style="font-size:12px; color:#64748b;">Rangi: ${item.color || "Standart"}</div>
        </td>
        <td><span style="background:#f1f5f9; padding:3px 10px; border-radius:9999px; font-size:12px; font-weight:600;">${catLabels[item.category] || item.category}</span></td>
        <td>
          <div style="font-size:15px; font-weight:800; color: ${isLow ? '#ef4444' : '#0f172a'};">
            ${item.stock.toLocaleString()} ${item.unit}
          </div>
          <div style="font-size:11.5px; color:#94a3b8;">Minimal: ${item.minStock} ${item.unit}</div>
        </td>
        <td>
          ${item.yieldPerMeter ? `<span class="roll-tag">1m ➔ ${item.yieldPerMeter} ta</span>` : `<span style="color:#94a3b8;">—</span>`}
        </td>
        <td>
          ${isLow ? `<span class="pill-status status-warning">⚠️ Kam qolgan</span>` : `<span class="pill-status status-packaging">✓ Yetarli</span>`}
        </td>
        <td><strong>${(item.price).toLocaleString()}</strong> so'm / ${item.unit}</td>
        <td style="color:#64748b; font-size:13px;">${item.updatedAt || "2026-09-25"}</td>
        <td>
          <button class="pill-action-btn" style="padding:6px 14px; font-size:12.5px;" onclick="openRawInboundModal('${item.id}')">+ Kirim</button>
        </td>
      </tr>
    `;
  }).join("");
}

function openNewRawMaterialModal() {
  document.getElementById("modal-new-raw-type").classList.add("open");
}

function submitNewRawType(e) {
  e.preventDefault();
  const name = document.getElementById("newraw-name").value.trim();
  const category = document.getElementById("newraw-category").value;
  const unit = document.getElementById("newraw-unit").value;
  const stock = parseFloat(document.getElementById("newraw-stock").value) || 0;
  const minStock = parseFloat(document.getElementById("newraw-min").value) || 0;
  const price = parseFloat(document.getElementById("newraw-price").value) || 0;

  if (!name) return;

  const newId = "raw-" + Date.now().toString().slice(-4);
  state.rawMaterials.push({
    id: newId,
    name: name,
    category: category,
    unit: unit,
    stock: stock,
    minStock: minStock,
    price: price,
    color: "Standart",
    yieldPerMeter: category === "fabric" ? 3 : null,
    updatedAt: new Date().toISOString().slice(0, 16).replace("T", " ")
  });

  addLog("raw_in", `Yangi xomashyo turi kiritildi: "${name}" (${stock} ${unit}).`);
  saveState();
  closeModal("modal-new-raw-type");
  renderApp();
  showToast(`Yangi xomashyo "${name}" bazaga qo'shildi!`, "success");
}

function openRawInboundModal(selectedRawId = null) {
  if (state.rawMaterials.length === 0) {
    alert("Xomashyo ombori bo'sh. Kirim qilishdan avval kamida 1 ta xomashyo turini (rulon mato, tosh yoki ip) qo'shing. Hozir sizga yangi tur qo'shish oynasi ochiladi.");
    openNewRawMaterialModal();
    return;
  }

  const selectEl = document.getElementById("inbound-raw-select");
  selectEl.innerHTML = state.rawMaterials.map(r => `
    <option value="${r.id}" ${r.id === selectedRawId ? "selected" : ""}>
      ${r.name} (Hozirgi qoldiq: ${r.stock} ${r.unit})
    </option>
  `).join("");

  document.getElementById("inbound-quantity").value = "";
  onInboundRawChange();
  document.getElementById("modal-raw-inbound").classList.add("open");
}

function onInboundRawChange() {
  const rawId = document.getElementById("inbound-raw-select").value;
  const raw = state.rawMaterials.find(r => r.id === rawId);
  const priceInput = document.getElementById("inbound-price");
  if (raw && priceInput) {
    priceInput.value = raw.price || "";
  }
  calculateInboundAverage();
}

function calculateInboundAverage() {
  const rawId = document.getElementById("inbound-raw-select").value;
  const raw = state.rawMaterials.find(r => r.id === rawId);
  const qtyInput = document.getElementById("inbound-quantity");
  const priceInput = document.getElementById("inbound-price");
  const calcBox = document.getElementById("inbound-calc-info");

  if (!raw || !qtyInput || !priceInput || !calcBox) return;

  const quantity = parseFloat(qtyInput.value) || 0;
  const inboundPrice = parseFloat(priceInput.value) || 0;

  if (quantity <= 0 || inboundPrice <= 0) {
    calcBox.style.display = "none";
    return;
  }

  const oldStock = raw.stock;
  const oldPrice = raw.price;
  const newStock = oldStock + quantity;
  const newAveragePrice = (oldStock > 0)
    ? Math.round(((oldStock * oldPrice) + (quantity * inboundPrice)) / newStock)
    : inboundPrice;

  calcBox.style.display = "block";
  calcBox.innerHTML = `
    <div style="font-weight:700; color:#1e40af; margin-bottom:4px;">📊 O'rtacha tannarx hisob-kitobi (O'rtacha tortilgan usul):</div>
    <div>Hozirgi ombor: <b>${oldStock} ${raw.unit}</b> × ${oldPrice.toLocaleString()} so'm = <b>${(oldStock * oldPrice).toLocaleString()} so'm</b></div>
    <div>Yangi kirim: <b>+${quantity} ${raw.unit}</b> × ${inboundPrice.toLocaleString()} so'm = <b>${(quantity * inboundPrice).toLocaleString()} so'm</b></div>
    <div style="border-top:1px dashed #93c5fd; padding-top:4px; margin-top:4px;">
      ➔ Yangi umumiy qoldiq: <b>${newStock} ${raw.unit}</b> | Yangi o'rtacha tannarx: <b style="color:#059669; font-size:13.5px;">${newAveragePrice.toLocaleString()} so'm / ${raw.unit}</b>
    </div>
  `;
}

function submitRawInbound(e) {
  e.preventDefault();
  const rawId = document.getElementById("inbound-raw-select").value;
  const quantity = parseFloat(document.getElementById("inbound-quantity").value);
  const inboundPrice = parseFloat(document.getElementById("inbound-price").value);

  if (isNaN(quantity) || quantity <= 0) return;

  const raw = state.rawMaterials.find(r => r.id === rawId);
  if (raw) {
    const oldStock = raw.stock;
    const oldPrice = raw.price;
    const unitPrice = (!isNaN(inboundPrice) && inboundPrice > 0) ? inboundPrice : oldPrice;
    const newStock = oldStock + quantity;
    const newAveragePrice = (oldStock > 0)
      ? Math.round(((oldStock * oldPrice) + (quantity * unitPrice)) / newStock)
      : unitPrice;

    raw.stock = newStock;
    raw.price = newAveragePrice;
    raw.updatedAt = new Date().toISOString().slice(0, 16).replace("T", " ");

    addLog("raw_in", `Xomashyo kirimi: +${quantity} ${raw.unit} "${raw.name}" (${unitPrice.toLocaleString()} so'mdan). Yangi o'rtacha tannarx: ${newAveragePrice.toLocaleString()} so'm/${raw.unit}.`);
    saveState();
    closeModal("modal-raw-inbound");
    renderApp();
    showToast(`${quantity} ${raw.unit} "${raw.name}" qabul qilindi! O'rtacha tannarx: ${newAveragePrice.toLocaleString()} so'm`, "success");
  }
}

// -------------------------------------------------------------
// 4. TAYYOR RO'MOLLAR VA SOTUV
// -------------------------------------------------------------
function renderFinishedGoodsKPIs() {
  const totalStock = state.finishedGoods.reduce((sum, g) => sum + g.stock, 0);
  const totalValue = state.finishedGoods.reduce((sum, g) => sum + (g.stock * g.price), 0);

  let topModel = state.finishedGoods[0];
  state.finishedGoods.forEach(g => {
    if (!topModel || g.stock > topModel.stock) topModel = g;
  });

  const elStock = document.getElementById("fg-kpi-stock");
  if (elStock) elStock.textContent = totalStock.toLocaleString() + " dona";

  const elVal = document.getElementById("fg-kpi-value");
  if (elVal) elVal.textContent = (totalValue / 1000000).toFixed(1) + " mln";

  const elTop = document.getElementById("fg-kpi-topmodel");
  if (elTop) {
    elTop.textContent = topModel ? (topModel.name.split(" ")[0] + " (" + topModel.stock + ")") : "Mavjud emas";
  }

  const elSales = document.getElementById("fg-kpi-sales");
  if (elSales) {
    const saleLogs = state.historyLogs.filter(l => l.action === "sale_out");
    elSales.textContent = saleLogs.length > 0 ? (saleLogs.length + " ta chiqim") : "0 dona";
  }
}

function renderFinishedGoodsTable() {
  const tableBody = document.getElementById("finished-goods-table-body");
  if (!tableBody) return;

  const search = state.searchQuery.toLowerCase();
  const filtered = state.finishedGoods.filter(g => 
    g.name.toLowerCase().includes(search) || g.sku.toLowerCase().includes(search)
  );

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:45px 20px; color:#94a3b8;">
          <div style="font-size:32px; margin-bottom:6px;">📦</div>
          <strong style="color:#0f172a; font-size:15px;">Tayyor mahsulotlar ombori hozircha bo'sh</strong>
          <div style="font-size:13px; color:#64748b; margin-top:4px;">Konveyerda partiyalar 7-bosqich (Salafan)dan o'tib qabul qilingach, tayyor ro'mollar bu yerda paydo bo'ladi.</div>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(item => `
    <tr>
      <td><span style="font-family:monospace; font-weight:700; color:#1e60ff;">${item.sku}</span></td>
      <td><strong style="color:#0f172a; font-size:14.5px;">${item.name}</strong></td>
      <td><span style="color:#64748b;">${item.size}</span></td>
      <td>
        <span style="background:#f1f5f9; padding:2px 8px; border-radius:9999px; font-size:12px; color:#334155;">${item.color}</span>
        <span style="background:#eff6ff; color:#1d4ed8; padding:2px 8px; border-radius:9999px; font-size:12px;">${item.decorType}</span>
      </td>
      <td><strong style="font-size:16px; color:#0f172a;">${item.stock} dona</strong></td>
      <td><strong style="color:#1e60ff; font-size:15px;">${(item.price).toLocaleString()} so'm</strong></td>
      <td style="color:#64748b; font-size:13px;">${(item.costPrice).toLocaleString()} so'm</td>
      <td>
        <button class="pill-action-btn btn-primary" style="padding:6px 14px; font-size:12.5px;" onclick="openSaleModal('${item.id}')">Chiqim (Sotuv)</button>
      </td>
    </tr>
  `).join("");
}

function openSaleModal(goodsId, preselectedClientId = null) {
  const item = state.finishedGoods.find(g => g.id === goodsId) || state.finishedGoods[0];
  if (!item) return;

  document.getElementById("sale-goods-id").value = item.id;
  document.getElementById("sale-goods-name").textContent = `${item.name} (${item.size})`;
  document.getElementById("sale-goods-stock").textContent = `${item.stock} dona`;
  const elPrice = document.getElementById("sale-goods-price");
  if (elPrice) elPrice.textContent = `${(item.price).toLocaleString()} so'm/dona`;

  const qtyInput = document.getElementById("sale-quantity");
  qtyInput.value = item.stock >= 10 ? 10 : item.stock;
  qtyInput.max = item.stock;

  // Mijozlar ro'yxatini to'ldirish
  const clientSelect = document.getElementById("sale-client-select");
  if (clientSelect) {
    let html = `<option value="">-- Ro'yxatdan tanlang --</option>`;
    (state.clients || []).forEach(c => {
      const debtText = (c.balance || 0) > 0 ? ` (Qarz: ${(c.balance).toLocaleString()} so'm)` : ` (Qarzi yo'q)`;
      const sel = (preselectedClientId === c.id) ? "selected" : "";
      html += `<option value="${c.id}" ${sel}>${c.name} - ${c.contactPerson}${debtText}</option>`;
    });
    html += `<option value="new">+ Yangi xaridor / do'kon (qo'lda kiritish)</option>`;
    clientSelect.innerHTML = html;
  }

  // To'lov shakli
  const payTypeSelect = document.getElementById("sale-payment-type");
  if (payTypeSelect) payTypeSelect.value = "full_cash";
  
  const customGroup = document.getElementById("sale-custom-client-group");
  if (customGroup) customGroup.style.display = "none";
  const customInput = document.getElementById("sale-custom-client");
  if (customInput) customInput.value = "";

  const partialGroup = document.getElementById("sale-partial-amount-group");
  if (partialGroup) partialGroup.style.display = "none";
  const partialInput = document.getElementById("sale-paid-amount");
  if (partialInput) partialInput.value = "";

  calculateSaleTotal();
  document.getElementById("modal-sale").classList.add("open");
}

function onSaleClientChange() {
  const select = document.getElementById("sale-client-select");
  const customGroup = document.getElementById("sale-custom-client-group");
  if (customGroup) {
    customGroup.style.display = (select.value === "new") ? "block" : "none";
  }
  calculateSaleTotal();
}

function onSalePaymentTypeChange() {
  const payType = document.getElementById("sale-payment-type").value;
  const partialGroup = document.getElementById("sale-partial-amount-group");
  if (partialGroup) {
    partialGroup.style.display = (payType === "partial") ? "block" : "none";
  }
  calculateSaleTotal();
}

function calculateSaleTotal() {
  const goodsId = document.getElementById("sale-goods-id").value;
  const item = state.finishedGoods.find(g => g.id === goodsId);
  const qty = parseInt(document.getElementById("sale-quantity").value) || 0;
  const payType = document.getElementById("sale-payment-type").value;
  const partialInput = document.getElementById("sale-paid-amount");
  const calcBox = document.getElementById("sale-calc-box");

  if (!item || !calcBox) return;

  const total = qty * item.price;
  let paid = total;
  let debt = 0;

  if (payType === "debt") {
    paid = 0;
    debt = total;
  } else if (payType === "partial") {
    const pVal = parseFloat(partialInput.value) || 0;
    paid = Math.min(pVal, total);
    debt = total - paid;
  }

  calcBox.innerHTML = `
    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
      <span>Jami summa:</span>
      <strong>${qty} dona &times; ${(item.price).toLocaleString()} = ${(total).toLocaleString()} so'm</strong>
    </div>
    <div style="display:flex; justify-content:space-between; margin-bottom:4px; color:${paid > 0 ? '#059669' : '#64748b'};">
      <span>To'lanayotgan naqd/karta:</span>
      <strong>${(paid).toLocaleString()} so'm</strong>
    </div>
    <div style="display:flex; justify-content:space-between; color:${debt > 0 ? '#dc2626' : '#059669'}; font-weight:700;">
      <span>Nasiyaga (Qarzga) yozilmoqda:</span>
      <span>${debt > 0 ? "+ " + (debt).toLocaleString() + " so'm (Nasiya)" : "0 so'm (To'liq to'landi)"}</span>
    </div>
  `;
}

function submitSale(e) {
  e.preventDefault();
  const goodsId = document.getElementById("sale-goods-id").value;
  const quantity = parseInt(document.getElementById("sale-quantity").value);
  const item = state.finishedGoods.find(g => g.id === goodsId);
  if (!item || isNaN(quantity) || quantity <= 0) return;

  if (quantity > item.stock) {
    alert(`Omborda yetarli qoldiq yo'q! Hozirda faqat ${item.stock} dona mavjud.`);
    return;
  }

  const clientId = document.getElementById("sale-client-select").value;
  let clientName = "";
  let clientObj = null;

  const now = new Date().toLocaleString("uz-UZ", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit"
  }).replace(",", "");

  if (clientId === "new") {
    clientName = document.getElementById("sale-custom-client").value.trim() || "Yangi xaridor";
    clientObj = {
      id: "cli-" + Date.now().toString().slice(-4),
      name: clientName,
      contactPerson: "Xaridor",
      phone: "-",
      address: "-",
      balance: 0,
      totalPurchased: 0,
      totalPaid: 0,
      lastActivity: now,
      transactions: []
    };
    state.clients.push(clientObj);
  } else if (clientId) {
    clientObj = state.clients.find(c => c.id === clientId);
    clientName = clientObj ? clientObj.name : "Xaridor";
  } else {
    clientName = "Umumiy xaridor";
  }

  const totalAmount = quantity * item.price;
  const payType = document.getElementById("sale-payment-type").value;
  let paidAmount = totalAmount;
  let debtAmount = 0;

  if (payType === "debt") {
    paidAmount = 0;
    debtAmount = totalAmount;
  } else if (payType === "partial") {
    const pVal = parseFloat(document.getElementById("sale-paid-amount").value) || 0;
    paidAmount = Math.min(pVal, totalAmount);
    debtAmount = totalAmount - paidAmount;
  }

  // Ombor astatkasidan ayirish
  item.stock -= quantity;

  // Mijoz balansini va akt-sverka harakatini yangilash
  if (clientObj) {
    clientObj.totalPurchased = (clientObj.totalPurchased || 0) + totalAmount;
    clientObj.totalPaid = (clientObj.totalPaid || 0) + paidAmount;
    clientObj.balance = (clientObj.balance || 0) + debtAmount;
    clientObj.lastActivity = now;

    let paymentMethodLabel = "Naqd pul";
    if (payType === "debt") paymentMethodLabel = "Nasiya (To'lanmadi)";
    else if (payType === "partial") paymentMethodLabel = `Qisman to'lov (${(paidAmount).toLocaleString()} so'm)`;

    if (!Array.isArray(clientObj.transactions)) clientObj.transactions = [];
    clientObj.transactions.push({
      id: "tx-" + Date.now().toString().slice(-5),
      date: now,
      type: "sale",
      title: `${item.name} (${quantity} dona)`,
      amount: totalAmount,
      paid: paidAmount,
      debtChange: debtAmount,
      balanceAfter: clientObj.balance,
      paymentMethod: paymentMethodLabel,
      notes: debtAmount > 0 ? `${(debtAmount).toLocaleString()} so'm nasiyaga qoldi` : "To'liq to'landi"
    });
  }

  // Moliyaviy ko'rsatkichlarni yangilash
  state.financials.monthlySalesVolume = (state.financials.monthlySalesVolume || 0) + quantity;
  state.financials.monthlyRevenue = (state.financials.monthlyRevenue || 0) + totalAmount;
  const totalExpenses = (state.financials.totalRawMaterialsCost + state.financials.totalLaborCost + state.financials.totalOverheadCost);
  state.financials.netProfit = state.financials.monthlyRevenue - totalExpenses;
  state.financials.profitMargin = parseFloat(((state.financials.netProfit / state.financials.monthlyRevenue) * 100).toFixed(1));

  // Harakatlar jurnaliga yozish
  const debtNote = debtAmount > 0 ? ` (Nasiyaga: ${(debtAmount).toLocaleString()} so'm)` : " (To'liq to'landi)";
  addLog("sale_out", `Chiqim: ${quantity} dona "${item.name}" (${clientName}) ga berildi. Jami: ${(totalAmount).toLocaleString()} so'm${debtNote}.`);

  saveState();
  closeModal("modal-sale");
  renderApp();
  showToast(`${quantity} dona ro'mol chiqim qilindi!`, "success");
}

function exportFinishedGoodsCSV() {
  let csv = "Artikul,Model,Olcham,Rangi,Qoldiq,Narxi,Tannarxi\n";
  state.finishedGoods.forEach(g => {
    csv += `"${g.sku}","${g.name}","${g.size}","${g.color}",${g.stock},${g.price},${g.costPrice}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Tayyor_romollar_astatkasi_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  showToast("Astatka vedomosti CSV formatida yuklab olindi", "info");
}

// -------------------------------------------------------------
// 4.5. MIJOZLAR & OLDI-BERDI (NASIYA, TO'LOVLAR VA AKT-SVERKA)
// -------------------------------------------------------------
function renderClientsKPIs() {
  const clients = state.clients || [];

  const totalDebt = clients.reduce((sum, c) => sum + Math.max(0, c.balance || 0), 0);
  const totalPaid = clients.reduce((sum, c) => sum + (c.totalPaid || 0), 0);
  const debtors = clients.filter(c => (c.balance || 0) > 0);

  // Eng katta xaridor
  let topClient = null;
  if (clients.length > 0) {
    topClient = [...clients].sort((a, b) => (b.totalPurchased || 0) - (a.totalPurchased || 0))[0];
  }

  const elDebt = document.getElementById("client-kpi-debt");
  if (elDebt) elDebt.textContent = (totalDebt / 1000000).toFixed(1) + " mln so'm";

  const elDebtCount = document.getElementById("client-kpi-debt-count");
  if (elDebtCount) elDebtCount.textContent = debtors.length + " ta do'konda";

  const elDebtSub = document.getElementById("client-kpi-debt-sub");
  if (elDebtSub) elDebtSub.textContent = debtors.length > 0 ? "Mijozlardan kutilayotgan nasiya" : "Barcha hisob-kitoblar toza!";

  const elPaid = document.getElementById("client-kpi-paid");
  if (elPaid) elPaid.textContent = (totalPaid / 1000000).toFixed(1) + " mln so'm";

  const elCount = document.getElementById("client-kpi-count");
  if (elCount) elCount.textContent = clients.length + " ta";

  const elCountSub = document.getElementById("client-kpi-count-sub");
  if (elCountSub) elCountSub.textContent = `${debtors.length} ta nasiya, ${clients.length - debtors.length} ta toza`;

  const elTop = document.getElementById("client-kpi-top");
  if (elTop) {
    elTop.textContent = topClient ? topClient.name : "-";
  }
  const elTopSub = document.getElementById("client-kpi-top-sub");
  if (elTopSub) {
    elTopSub.textContent = topClient ? `Jami xarid: ${((topClient.totalPurchased || 0) / 1000000).toFixed(1)} mln so'm` : "Xaridlar mavjud emas";
  }
}

function setClientFilter(filter) {
  state.clientFilter = filter;
  ["all", "debtors", "cleared"].forEach(f => {
    const btn = document.getElementById(`filter-client-${f}`);
    if (btn) btn.classList.toggle("active", f === filter);
  });
  renderClientsTable();
}

function handleClientSearch(val) {
  state.clientSearchQuery = (val || "").trim().toLowerCase();
  renderClientsTable();
}

function renderClientsTable() {
  const tbody = document.getElementById("clients-table-body");
  if (!tbody) return;

  let list = state.clients || [];

  // Filtrlash
  if (state.clientFilter === "debtors") {
    list = list.filter(c => (c.balance || 0) > 0);
  } else if (state.clientFilter === "cleared") {
    list = list.filter(c => (c.balance || 0) <= 0);
  }

  // Qidiruv
  if (state.clientSearchQuery) {
    const q = state.clientSearchQuery;
    list = list.filter(c => 
      (c.name || "").toLowerCase().includes(q) ||
      (c.contactPerson || "").toLowerCase().includes(q) ||
      (c.phone || "").toLowerCase().includes(q) ||
      (c.address || "").toLowerCase().includes(q)
    );
  }

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:45px 20px; color:#94a3b8;">
          <div style="font-size:32px; margin-bottom:6px;">🤝</div>
          <strong style="color:#0f172a; font-size:15px;">Mijozlar topilmadi</strong>
          <div style="font-size:13px; color:#64748b; margin-top:4px;">Qidiruv mezonlariga mos xaridor yoki do'kon mavjud emas.</div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map(c => {
    const bal = c.balance || 0;
    let balanceBadge = "";
    if (bal > 0) {
      balanceBadge = `<span class="badge-debt-red">⚠️ ${(bal).toLocaleString()} so'm</span>`;
    } else if (bal === 0) {
      balanceBadge = `<span class="badge-debt-green">✓ Toza (0 so'm)</span>`;
    } else {
      balanceBadge = `<span style="background:#eff6ff; color:#1d4ed8; padding:3px 9px; border-radius:9999px; font-weight:700; font-size:12px;">+ Avans (${Math.abs(bal).toLocaleString()} so'm)</span>`;
    }

    return `
      <tr>
        <td>
          <strong style="color:#0f172a; font-size:14.5px;">${c.name}</strong>
        </td>
        <td>
          <div style="font-weight:600; color:#334155;">${c.contactPerson || "-"}</div>
          <div style="font-size:12px; color:#64748b; font-family:monospace;">${c.phone || "-"}</div>
        </td>
        <td>
          <span style="font-size:13px; color:#475569;">${c.address || "-"}</span>
        </td>
        <td>
          <strong style="color:#0f172a;">${(c.totalPurchased || 0).toLocaleString()} so'm</strong>
        </td>
        <td>
          <span style="color:#059669; font-weight:600;">${(c.totalPaid || 0).toLocaleString()} so'm</span>
        </td>
        <td>
          ${balanceBadge}
        </td>
        <td>
          <span style="font-size:12px; color:#64748b;">${c.lastActivity || "-"}</span>
        </td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="pill-action-btn" style="padding:5px 10px; font-size:12px; background:#ecfdf5; color:#059669; border-color:#a7f3d0;" onclick="openClientPaymentModal('${c.id}')" title="To'lov qabul qilish">💵 To'lov</button>
            <button class="pill-action-btn" style="padding:5px 10px; font-size:12px;" onclick="viewClientStatement('${c.id}')" title="Akt-sverkani ko'rish">📑 Sverka</button>
            <button class="pill-action-btn btn-primary" style="padding:5px 10px; font-size:12px;" onclick="openSaleForClient('${c.id}')" title="Ushbu mijozga tovar berish">📦 Sotuv</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function openSaleForClient(clientId) {
  const firstItem = state.finishedGoods[0];
  if (!firstItem) {
    alert("Omborda tayyor mahsulot yo'q!");
    return;
  }
  openSaleModal(firstItem.id, clientId);
}

function openNewClientModal() {
  document.getElementById("newcli-name").value = "";
  document.getElementById("newcli-person").value = "";
  document.getElementById("newcli-phone").value = "";
  document.getElementById("newcli-address").value = "";
  document.getElementById("newcli-initial-debt").value = 0;
  document.getElementById("modal-new-client").classList.add("open");
}

function submitNewClient(e) {
  e.preventDefault();
  const name = document.getElementById("newcli-name").value.trim();
  const person = document.getElementById("newcli-person").value.trim();
  const phone = document.getElementById("newcli-phone").value.trim();
  const address = document.getElementById("newcli-address").value.trim();
  const initialDebt = parseFloat(document.getElementById("newcli-initial-debt").value) || 0;

  if (!name) return;

  const now = new Date().toLocaleString("uz-UZ", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit"
  }).replace(",", "");

  const newClient = {
    id: "cli-" + Date.now().toString().slice(-4),
    name: name,
    contactPerson: person || "Mas'ul xodim",
    phone: phone || "-",
    address: address || "-",
    balance: initialDebt,
    totalPurchased: initialDebt,
    totalPaid: 0,
    lastActivity: now,
    transactions: initialDebt > 0 ? [{
      id: "tx-" + Date.now().toString().slice(-5),
      date: now,
      type: "sale",
      title: "Boshlang'ich qarz balansi",
      amount: initialDebt,
      paid: 0,
      debtChange: initialDebt,
      balanceAfter: initialDebt,
      paymentMethod: "Boshlang'ich qoldiq",
      notes: "Eski hisob-kitobdan o'tkazilgan qarz"
    }] : []
  };

  state.clients.unshift(newClient);
  addLog("client_add", `Yangi mijoz qo'shildi: "${name}" (${person || 'Mijoz'}). Boshlang'ich qarz: ${(initialDebt).toLocaleString()} so'm.`);

  saveState();
  closeModal("modal-new-client");
  renderApp();
  showToast(`"${name}" mijozlar ro'yxatiga qo'shildi!`, "success");
}

function openClientPaymentModal(preselectedClientId = null) {
  const select = document.getElementById("pay-client-select");
  if (!select) return;

  let html = `<option value="">-- Mijozni tanlang --</option>`;
  (state.clients || []).forEach(c => {
    const sel = (preselectedClientId === c.id) ? "selected" : "";
    const debtStr = (c.balance || 0) > 0 ? ` (Qarz: ${(c.balance).toLocaleString()} so'm)` : ` (Qarzi yo'q)`;
    html += `<option value="${c.id}" ${sel}>${c.name} - ${c.contactPerson}${debtStr}</option>`;
  });
  select.innerHTML = html;

  if (preselectedClientId) {
    select.value = preselectedClientId;
  }
  onPaymentClientSelectChange();

  document.getElementById("pay-notes").value = "";
  document.getElementById("modal-client-payment").classList.add("open");
}

function onPaymentClientSelectChange() {
  const clientId = document.getElementById("pay-client-select").value;
  const client = (state.clients || []).find(c => c.id === clientId);
  const infoBox = document.getElementById("pay-client-info");
  const amountInput = document.getElementById("pay-amount");
  const quickBtn = document.getElementById("btn-quick-full-debt");

  if (!client) {
    if (infoBox) infoBox.style.display = "none";
    if (amountInput) amountInput.value = "";
    if (quickBtn) quickBtn.style.display = "none";
    onPayAmountInput();
    return;
  }

  if (quickBtn) {
    quickBtn.style.display = (client.balance > 0) ? "inline-flex" : "none";
  }

  if (infoBox) {
    infoBox.style.display = "block";
    const bal = client.balance || 0;
    infoBox.innerHTML = `
      <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
        <span>Do'kon / Mas'ul:</span>
        <strong>${client.name} (${client.contactPerson})</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
        <span>Jami xarid hajmi:</span>
        <span>${(client.totalPurchased || 0).toLocaleString()} so'm</span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
        <span>Jami to'langan:</span>
        <span style="color:#059669; font-weight:600;">${(client.totalPaid || 0).toLocaleString()} so'm</span>
      </div>
      <div style="display:flex; justify-content:space-between; border-top:1px solid #bfdbfe; padding-top:4px; font-size:14px;">
        <span>Hozirgi qarz (Bizning haqqimiz):</span>
        <strong style="color:${bal > 0 ? '#dc2626' : '#059669'};">${bal > 0 ? (bal).toLocaleString() + " so'm" : "0 so'm (Qarzi yo'q)"}</strong>
      </div>
    `;
  }

  if (amountInput) {
    amountInput.value = client.balance > 0 ? client.balance : "";
    onPayAmountInput();
  }
}

function fillFullDebt() {
  const clientId = document.getElementById("pay-client-select").value;
  const client = (state.clients || []).find(c => c.id === clientId);
  if (!client || (client.balance || 0) <= 0) return;

  const amountInput = document.getElementById("pay-amount");
  amountInput.value = client.balance;
  onPayAmountInput();
  showToast(`To'liq qarz summasi (${(client.balance).toLocaleString()} so'm) kiritildi ⚡`, "info");
}

function onPayAmountInput() {
  const amountInput = document.getElementById("pay-amount");
  const liveText = document.getElementById("pay-amount-live-text");
  if (!amountInput || !liveText) return;

  const val = parseFloat(amountInput.value);
  if (!isNaN(val) && val > 0) {
    liveText.style.display = "block";
    liveText.innerHTML = `✓ Kiritilgan summa: <strong>${(val).toLocaleString()} so'm</strong>`;
  } else {
    liveText.style.display = "none";
  }
}

function submitClientPayment(e) {
  e.preventDefault();
  const clientId = document.getElementById("pay-client-select").value;
  const amount = parseFloat(document.getElementById("pay-amount").value);
  const method = document.getElementById("pay-method").value;
  const notes = document.getElementById("pay-notes").value.trim() || "Qarz to'lovi";

  const client = (state.clients || []).find(c => c.id === clientId);
  if (!client || isNaN(amount) || amount <= 0) {
    alert("Iltimos, mijozni va to'g'ri to'lov summasini kiriting!");
    return;
  }

  client.balance = (client.balance || 0) - amount;
  client.totalPaid = (client.totalPaid || 0) + amount;

  const now = new Date().toLocaleString("uz-UZ", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit"
  }).replace(",", "");

  client.lastActivity = now;

  if (!Array.isArray(client.transactions)) client.transactions = [];
  client.transactions.push({
    id: "tx-" + Date.now().toString().slice(-5),
    date: now,
    type: "payment",
    title: "To'lov qabul qilindi",
    amount: amount,
    paid: amount,
    debtChange: -amount,
    balanceAfter: client.balance,
    paymentMethod: method,
    notes: notes
  });

  addLog("payment_in", `To'lov: "${client.name}" dan ${(amount).toLocaleString()} so'm qabul qilindi (${method}). Qoldiq qarz: ${(client.balance).toLocaleString()} so'm.`);

  saveState();
  closeModal("modal-client-payment");
  renderApp();
  showToast(`"${client.name}" dan ${(amount).toLocaleString()} so'm to'lov qabul qilindi!`, "success");
}

function viewClientStatement(clientId) {
  const client = (state.clients || []).find(c => c.id === clientId);
  if (!client) return;

  state.selectedStatementClientId = clientId;
  const content = document.getElementById("client-statement-content");
  if (!content) return;

  const bal = client.balance || 0;
  const statusBadge = bal > 0 
    ? `<span class="badge-debt-red">⚠️ Qarz: ${(bal).toLocaleString()} so'm</span>`
    : `<span class="badge-debt-green">✓ Hisob toza (0 so'm)</span>`;

  let rows = "";
  if (!client.transactions || client.transactions.length === 0) {
    rows = `<tr><td colspan="7" style="text-align:center; padding:20px; color:#94a3b8;">Hali hech qanday harakat qayd etilmagan</td></tr>`;
  } else {
    rows = client.transactions.map((tx) => {
      const isSale = tx.type === "sale";
      const badge = isSale 
        ? `<span style="background:#eff6ff; color:#1e40af; padding:2px 8px; border-radius:9999px; font-size:11.5px; font-weight:600;">📦 Sotuv</span>`
        : `<span style="background:#ecfdf5; color:#059669; padding:2px 8px; border-radius:9999px; font-size:11.5px; font-weight:600;">💵 To'lov</span>`;
      
      const debtColor = tx.debtChange > 0 ? "#dc2626" : (tx.debtChange < 0 ? "#059669" : "#64748b");
      const debtSign = tx.debtChange > 0 ? "+" : "";

      return `
        <tr>
          <td style="font-size:12.5px; color:#64748b;">${tx.date}</td>
          <td>${badge} <strong style="font-size:13px; color:#0f172a; margin-left:4px;">${tx.title}</strong></td>
          <td style="font-size:12.5px; color:#475569;">${tx.paymentMethod || "-"}</td>
          <td style="text-align:right; font-weight:600; color:#0f172a;">${(tx.amount || 0).toLocaleString()}</td>
          <td style="text-align:right; font-weight:600; color:#059669;">${(tx.paid || 0).toLocaleString()}</td>
          <td style="text-align:right; font-weight:700; color:${debtColor};">${debtSign}${(tx.debtChange || 0).toLocaleString()}</td>
          <td style="text-align:right; font-weight:700; color:#0f172a;">${(tx.balanceAfter || 0).toLocaleString()}</td>
        </tr>
      `;
    }).join("");
  }

  content.innerHTML = `
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:18px; margin-bottom:18px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
          <h2 style="font-size:18px; font-weight:800; color:#0f172a; margin-bottom:4px;">${client.name}</h2>
          <div style="font-size:13px; color:#475569;">
            Mas'ul: <strong>${client.contactPerson || "-"}</strong> | Tel: <strong>${client.phone || "-"}</strong>
          </div>
          <div style="font-size:12.5px; color:#64748b; margin-top:2px;">
            Manzil: ${client.address || "-"}
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:12px; color:#64748b; margin-bottom:4px;">Joriy hisob holati:</div>
          <div>${statusBadge}</div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; margin-top:14px; padding-top:14px; border-top:1px solid #e2e8f0;">
        <div style="background:#ffffff; padding:10px 14px; border-radius:10px; border:1px solid #eaedf2;">
          <div style="font-size:11.5px; color:#64748b; font-weight:600;">JAMI XARID QILINDI</div>
          <div style="font-size:16px; font-weight:800; color:#0f172a; margin-top:2px;">${(client.totalPurchased || 0).toLocaleString()} so'm</div>
        </div>
        <div style="background:#ffffff; padding:10px 14px; border-radius:10px; border:1px solid #eaedf2;">
          <div style="font-size:11.5px; color:#64748b; font-weight:600;">JAMI TO'LANDI</div>
          <div style="font-size:16px; font-weight:800; color:#059669; margin-top:2px;">${(client.totalPaid || 0).toLocaleString()} so'm</div>
        </div>
        <div style="background:#ffffff; padding:10px 14px; border-radius:10px; border:1px solid #eaedf2;">
          <div style="font-size:11.5px; color:#64748b; font-weight:600;">QARZ QOLDIG'I (HAQQIMIZ)</div>
          <div style="font-size:16px; font-weight:800; color:${bal > 0 ? '#dc2626' : '#059669'}; margin-top:2px;">${(bal).toLocaleString()} so'm</div>
        </div>
      </div>
    </div>

    <div style="font-size:14px; font-weight:700; color:#0f172a; margin-bottom:10px;">
      Harakatlar va Hisob-Kitoblar Xronologiyasi:
    </div>

    <div style="overflow-x:auto;">
      <table class="clean-table" style="font-size:13px;">
        <thead>
          <tr>
            <th>Sana</th>
            <th>Harakat / Hujjat</th>
            <th>To'lov Usuli</th>
            <th style="text-align:right;">Xarid Summasi</th>
            <th style="text-align:right;">To'langan</th>
            <th style="text-align:right;">Qarz O'zgarishi</th>
            <th style="text-align:right;">Balans Qoldig'i</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;

  document.getElementById("modal-client-statement").classList.add("open");
}

function printClientStatement() {
  window.print();
}

function exportStatementCSV() {
  const clientId = state.selectedStatementClientId;
  const client = (state.clients || []).find(c => c.id === clientId);
  if (!client) return;

  let csv = `Mijoz: "${client.name}"\nMas'ul: "${client.contactPerson}"\nTelefon: "${client.phone}"\nJoriy qarz: ${client.balance}\n\n`;
  csv += "Sana,Harakat,TolovUsuli,XaridSummasi,Tolangan,QarzOzgarishi,BalansQoldigi,Izoh\n";

  (client.transactions || []).forEach(tx => {
    csv += `"${tx.date}","${tx.title}","${tx.paymentMethod || ''}",${tx.amount || 0},${tx.paid || 0},${tx.debtChange || 0},${tx.balanceAfter || 0},"${tx.notes || ''}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Akt_Sverka_${client.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  showToast("Akt-sverka CSV formatida yuklandi!", "info");
}

function exportClientsCSV() {
  let csv = "Mijoz Nomi,Masul Shaxs,Telefon,Manzil,Jami Xarid,Tolangan,Joriy Qarz,Oxirgi Harakat\n";
  (state.clients || []).forEach(c => {
    csv += `"${c.name}","${c.contactPerson}","${c.phone}","${c.address}",${c.totalPurchased || 0},${c.totalPaid || 0},${c.balance || 0},"${c.lastActivity || ''}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Mijozlar_va_nasiyalar_hisoboti_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  showToast("Mijozlar hisoboti CSV formatida yuklab olindi", "info");
}

// -------------------------------------------------------------
// 5. MOLIYA & TANNARX (UNIT ECONOMICS VA P&L TAHLILI)
// -------------------------------------------------------------
function renderFinanceKPIs() {
  const fin = state.financials || DEFAULT_DATA.financials;

  // Xomashyo omboridagi pul qiymati (Rulon, tosh, ip, paket)
  const rawTotalValue = state.rawMaterials.reduce((sum, r) => sum + (r.stock * r.price), 0);

  // Tayyor tovarlar omboridagi pul qiymati (ulgurji sotuv narxida va tannarxida)
  const fgWholesaleValue = state.finishedGoods.reduce((sum, g) => sum + (g.stock * g.price), 0);
  const fgCostValue = state.finishedGoods.reduce((sum, g) => sum + (g.stock * g.costPrice), 0);
  const totalCapital = rawTotalValue + fgCostValue;

  // KPI kartalari
  const elRev = document.getElementById("fin-kpi-revenue");
  if (elRev) elRev.textContent = (fin.monthlyRevenue / 1000000).toFixed(1) + " mln";

  const totalExpenses = (fin.totalRawMaterialsCost + fin.totalLaborCost + fin.totalOverheadCost);
  const elExp = document.getElementById("fin-kpi-expenses");
  if (elExp) elExp.textContent = (totalExpenses / 1000000).toFixed(2) + " mln";

  const netProfit = fin.monthlyRevenue - totalExpenses;
  const elProf = document.getElementById("fin-kpi-profit");
  if (elProf) elProf.textContent = (netProfit > 0 ? "+" : "") + (netProfit / 1000000).toFixed(2) + " mln";

  const margin = ((netProfit / fin.monthlyRevenue) * 100).toFixed(1);
  const elMar = document.getElementById("fin-kpi-margin");
  if (elMar) elMar.textContent = margin + "%";

  // Ombordagi kapital ma'lumotlari
  const elCapRaw = document.getElementById("fin-capital-raw");
  if (elCapRaw) elCapRaw.textContent = rawTotalValue.toLocaleString() + " so'm";

  const elCapFg = document.getElementById("fin-capital-fg");
  if (elCapFg) elCapFg.textContent = `${fgWholesaleValue.toLocaleString()} so'm (Tannarxi: ${fgCostValue.toLocaleString()} so'm)`;

  const elCapTot = document.getElementById("fin-capital-total");
  if (elCapTot) elCapTot.textContent = totalCapital.toLocaleString() + " so'm (Tannarx bo'yicha)";
}

function renderFinanceView() {
  renderFinanceKPIs();

  const modelSelect = document.getElementById("finance-model-select");
  if (modelSelect) {
    if (state.boms.length === 0) {
      modelSelect.innerHTML = `<option value="">Hozircha BoM retsepti kiritilmagan</option>`;
    } else {
      modelSelect.innerHTML = state.boms.map(bom => `
        <option value="${bom.id}" ${bom.id === state.selectedFinanceBomId ? "selected" : ""}>
          ${bom.name} (${bom.size})
        </option>
      `).join("");
    }
  }

  const currentBomId = state.selectedFinanceBomId || (state.boms[0] ? state.boms[0].id : null);
  updateUnitEconomicsDisplay(currentBomId);
}

function onFinanceModelChange() {
  const modelSelect = document.getElementById("finance-model-select");
  if (!modelSelect) return;
  state.selectedFinanceBomId = modelSelect.value;
  updateUnitEconomicsDisplay(state.selectedFinanceBomId);
}

function updateUnitEconomicsDisplay(bomId) {
  const bom = bomId ? state.boms.find(b => b.id === bomId) : state.boms[0];
  const calloutEl = document.getElementById("finance-profit-callout");
  const breakdownEl = document.getElementById("finance-cost-breakdown");

  if (!bom) {
    if (calloutEl) {
      calloutEl.innerHTML = `
        <div style="width: 100%; text-align: center; padding: 14px; color: #1e40af; font-size: 13.5px;">
          ℹ️ Hozircha BoM retsepti kiritilmagan. Avval <b>Konveyer & BoM</b> bo'limida yangi BoM kiriting.
        </div>
      `;
    }
    if (breakdownEl) {
      breakdownEl.innerHTML = `
        <div style="text-align: center; padding: 24px 10px; color: #94a3b8; font-size: 13px;">
          Tannarx tarkibini hisoblash uchun BoM retsepti mavjud emas
        </div>
      `;
    }
    return;
  }

  const fabric = state.rawMaterials.find(r => r.id === bom.fabricId);
  const fabricPricePerMeter = fabric ? fabric.price : 22000;
  const yieldPerMeter = bom.yieldPerMeter || 3;
  const fabricCostPerPiece = Math.round(fabricPricePerMeter / yieldPerMeter);

  const stone = state.rawMaterials.find(r => r.id === bom.stoneId);
  const stoneUnitPrice = stone ? stone.price : 150;
  const stonesPerPiece = bom.stonesPerPiece || 0;
  const stoneCost = stonesPerPiece * stoneUnitPrice;

  const threadCost = bom.threadCost || 360;
  const labelCost = bom.labelCost || 800;
  const packageCost = bom.packageCost || 600;
  const pkgAndThreadCost = threadCost + labelCost + packageCost;

  const laborCost = bom.laborCost || 5000;
  const overheadCost = bom.overheadCost || 1200;

  const totalUnitCost = fabricCostPerPiece + stoneCost + pkgAndThreadCost + laborCost + overheadCost;
  const sellingPrice = bom.sellingPrice || 45000;
  const retailPrice = bom.retailPrice || (sellingPrice * 1.8);

  const wholesaleProfit = sellingPrice - totalUnitCost;
  const wholesaleMargin = ((wholesaleProfit / sellingPrice) * 100).toFixed(1);
  const retailProfit = retailPrice - totalUnitCost;
  const retailMargin = ((retailProfit / retailPrice) * 100).toFixed(1);

  // Katta foyda kartasi (Unit Economics Pasporti)
  if (calloutEl) {
    calloutEl.innerHTML = `
      <div style="flex: 1;">
        <div style="font-size: 11.5px; font-weight: 700; color: #1e40af; text-transform: uppercase; letter-spacing: 0.5px;">
          1 Dona Ro'moldan Qoladigan Sof Foyda
        </div>
        <div class="profit-callout-val">+${wholesaleProfit.toLocaleString()} so'm</div>
        <div style="font-size: 13px; color: #1e40af; margin-top: 4px;">
          Ulgurji marja: <strong style="color: #059669;">${wholesaleMargin}%</strong> | 
          Tannarxi: <strong>${totalUnitCost.toLocaleString()} so'm</strong> | 
          Ulgurji sotuv: <strong>${sellingPrice.toLocaleString()} so'm</strong>
        </div>
      </div>
      <div style="background: #ffffff; padding: 10px 16px; border-radius: 12px; border: 1px solid #bfdbfe; text-align: right; box-shadow: 0 2px 6px rgba(30, 64, 175, 0.05);">
        <div style="font-size: 11px; color: #64748b; font-weight: 600;">Chakana sotilganda (Dona):</div>
        <div style="font-size: 17px; font-weight: 800; color: #059669;">+${retailProfit.toLocaleString()} so'm</div>
        <div style="font-size: 11px; color: #64748b;">(Chakana: ${retailPrice.toLocaleString()} so'm / ${retailMargin}%)</div>
      </div>
    `;
  }

  // Moddiy xarajatlar tarkibi
  if (breakdownEl) {
    const pFabric = Math.round((fabricCostPerPiece / totalUnitCost) * 100);
    const pStone = Math.round((stoneCost / totalUnitCost) * 100);
    const pPkg = Math.round((pkgAndThreadCost / totalUnitCost) * 100);
    const pLabor = Math.round((laborCost / totalUnitCost) * 100);
    const pOverhead = Math.max(1, 100 - (pFabric + pStone + pPkg + pLabor));

    const fabricName = fabric ? fabric.name : "Keng rulon mato";
    const stoneName = stone ? `${stone.name} (${stonesPerPiece} dona)` : "Toshsiz";

    breakdownEl.innerHTML = `
      <div class="cost-item-row">
        <div class="cost-item-header">
          <span>🧵 Rulon Mato (1m dan ${yieldPerMeter} ta ro'mol):</span>
          <span><strong>${fabricCostPerPiece.toLocaleString()} so'm</strong> <span style="color:#64748b; font-size:12px;">(${pFabric}%)</span></span>
        </div>
        <div class="cost-progress-track">
          <div class="cost-progress-fill fill-fabric" style="width: ${pFabric}%;"></div>
        </div>
        <div style="font-size:11.5px; color:#64748b;">${fabricName} (1m = ${fabricPricePerMeter.toLocaleString()} so'm / ${yieldPerMeter} dona)</div>
      </div>

      ${stonesPerPiece > 0 ? `
      <div class="cost-item-row">
        <div class="cost-item-header">
          <span>✨ Bezak Toshlari (${stonesPerPiece} dona):</span>
          <span><strong>${stoneCost.toLocaleString()} so'm</strong> <span style="color:#64748b; font-size:12px;">(${pStone}%)</span></span>
        </div>
        <div class="cost-progress-track">
          <div class="cost-progress-fill fill-stone" style="width: ${pStone}%;"></div>
        </div>
        <div style="font-size:11.5px; color:#64748b;">${stoneName} (${stoneUnitPrice} so'm/dona)</div>
      </div>
      ` : ""}

      <div class="cost-item-row">
        <div class="cost-item-header">
          <span>🏷️ Qadoq & Aksesuarlar (Ip, Etiketka, Salafan):</span>
          <span><strong>${pkgAndThreadCost.toLocaleString()} so'm</strong> <span style="color:#64748b; font-size:12px;">(${pPkg}%)</span></span>
        </div>
        <div class="cost-progress-track">
          <div class="cost-progress-fill fill-pkg" style="width: ${pPkg}%;"></div>
        </div>
        <div style="font-size:11.5px; color:#64748b;">Ip: ${threadCost} so'm, Etiketka: ${labelCost} so'm, Salafan paket: ${packageCost} so'm</div>
      </div>

      <div class="cost-item-row">
        <div class="cost-item-header">
          <span>👥 Ustalarga Ish Haqi (Bichuv, Tikish, Tosh, Dazmol):</span>
          <span><strong>${laborCost.toLocaleString()} so'm</strong> <span style="color:#64748b; font-size:12px;">(${pLabor}%)</span></span>
        </div>
        <div class="cost-progress-track">
          <div class="cost-progress-fill fill-labor" style="width: ${pLabor}%;"></div>
        </div>
        <div style="font-size:11.5px; color:#64748b;">Bichuvchi, tikuvchi, presschi va dazmolchining 1 dona ro'moldan ulushi</div>
      </div>

      <div class="cost-item-row">
        <div class="cost-item-header">
          <span>🏢 Doimiy Seh Xarajatlari (Ijara, Elektr, Tok, Soliq):</span>
          <span><strong>${overheadCost.toLocaleString()} so'm</strong> <span style="color:#64748b; font-size:12px;">(${pOverhead}%)</span></span>
        </div>
        <div class="cost-progress-track">
          <div class="cost-progress-fill fill-overhead" style="width: ${pOverhead}%;"></div>
        </div>
        <div style="font-size:11.5px; color:#64748b;">Oylik seh xarajatining 1 dona mahsulotga taqsimlangan ulushi</div>
      </div>

      <div style="border-top: 1px dashed #cbd5e1; padding-top: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 14.5px;">
        <strong style="color: #0f172a;">JAMI 1 DONA TANNARXI:</strong>
        <strong style="color: #1e60ff; font-size: 16px;">${totalUnitCost.toLocaleString()} so'm</strong>
      </div>
    `;
  }
}

function exportFinanceReportCSV() {
  let csv = "MOLIYA VA TANNARX HISOBOTI (RO'MOL ISHLAB CHIQARISH)\n";
  csv += `Hisobot sanasi: ${new Date().toLocaleString("uz-UZ")}\n\n`;

  csv += "1. MODELLAR BO'YICHA 1 DONA RO'MOL TANNARXI VA FOYDASI (UNIT ECONOMICS)\n";
  csv += "Model,Olcham,Mato tannarxi (som),Tosh narxi (som),Qadoq va ip (som),Usta haqi (som),Seh xarajati (som),JAMI TANNARX (som),Ulgurji sotuv (som),SOF FOYDA (som),Rentabellik (%)\n";

  state.boms.forEach(bom => {
    const fabric = state.rawMaterials.find(r => r.id === bom.fabricId);
    const fabricPrice = fabric ? fabric.price : 22000;
    const yieldPerM = bom.yieldPerMeter || 3;
    const fCost = Math.round(fabricPrice / yieldPerM);

    const stone = state.rawMaterials.find(r => r.id === bom.stoneId);
    const stonePrice = stone ? stone.price : 150;
    const sCost = (bom.stonesPerPiece || 0) * stonePrice;

    const pkgCost = (bom.threadCost || 360) + (bom.labelCost || 800) + (bom.packageCost || 600);
    const labor = bom.laborCost || 5000;
    const overhead = bom.overheadCost || 1200;
    const unitCost = fCost + sCost + pkgCost + labor + overhead;
    const sell = bom.sellingPrice || 45000;
    const profit = sell - unitCost;
    const margin = ((profit / sell) * 100).toFixed(1);

    csv += `"${bom.name}","${bom.size}",${fCost},${sCost},${pkgCost},${labor},${overhead},${unitCost},${sell},${profit},${margin}%\n`;
  });

  const fin = state.financials || DEFAULT_APP_DATA.financials;
  csv += "\n2. FOYDA VA ZARAR (P&L) BALANSI\n";
  csv += "Korsatkich,Summa (som)\n";
  csv += `"Jami sotuv tushumi (Gross Revenue)",${fin.monthlyRevenue}\n`;
  csv += `"Xomashyo xarajatlari",-${fin.totalRawMaterialsCost}\n`;
  csv += `"Ishchilar oylik maoshi",-${fin.totalLaborCost}\n`;
  csv += `"Doimiy seh xarajatlari (Ijara/Elektr/Tok)",-${fin.totalOverheadCost}\n`;
  csv += `"BIZNES EGASIGA QOLGAN SOF FOYDA",+${fin.netProfit}\n`;
  csv += `"Rentabellik (Marja)",${fin.profitMargin}%\n`;

  const rawTotalValue = state.rawMaterials.reduce((sum, r) => sum + (r.stock * r.price), 0);
  const fgCostValue = state.finishedGoods.reduce((sum, g) => sum + (g.stock * g.costPrice), 0);
  const fgWholesaleValue = state.finishedGoods.reduce((sum, g) => sum + (g.stock * g.price), 0);

  csv += "\n3. OMBORLARDA MUZLAB TURGAN AYLANMA KAPITAL\n";
  csv += "Ombor toifasi,Summa (som)\n";
  csv += `"Xomashyo omboridagi moddiy zaxiralar",${rawTotalValue}\n`;
  csv += `"Tayyor tovarlar ombori (Tannarxi boyicha)",${fgCostValue}\n`;
  csv += `"Tayyor tovarlar ombori (Sotuv qiymati boyicha)",${fgWholesaleValue}\n`;
  csv += `"Jami zaxiradagi kapital",${rawTotalValue + fgCostValue}\n`;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Romol_Sehi_Moliyaviy_Hisobot_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  showToast("Moliyaviy hisobot va Unit Economics CSV formatida yuklab olindi", "info");
}

// -------------------------------------------------------------
// 6. TARIX VIEW
// -------------------------------------------------------------
function renderHistoryKPIs() {
  const elTotal = document.getElementById("hist-kpi-total");
  if (elTotal) elTotal.textContent = state.historyLogs.length + " ta amal";

  const elBatches = document.getElementById("hist-kpi-batches");
  if (elBatches) {
    const batchLogs = state.historyLogs.filter(l => l.action === "batch_start").length;
    elBatches.textContent = batchLogs + " ta partiya";
  }

  const elRaw = document.getElementById("hist-kpi-raw");
  if (elRaw) {
    const rawLogs = state.historyLogs.filter(l => l.action === "raw_in").length;
    elRaw.textContent = rawLogs + " ta kirim";
  }

  const elSales = document.getElementById("hist-kpi-sales");
  if (elSales) {
    const saleLogs = state.historyLogs.filter(l => l.action === "sale_out").length;
    elSales.textContent = saleLogs + " ta chiqim";
  }
}

function renderHistoryTable() {
  const tableBody = document.getElementById("history-table-body");
  if (!tableBody) return;

  if (state.historyLogs.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center; padding:45px 20px; color:#94a3b8;">
          <div style="font-size:32px; margin-bottom:6px;">📜</div>
          <strong style="color:#0f172a; font-size:15px;">Harakatlar tarixi hozircha bo'sh</strong>
          <div style="font-size:13px; color:#64748b; margin-top:4px;">Tizimda kirim, yangi partiya yoki sotuv amallari bajarilganda bu yerda avtomatik qayd etiladi.</div>
        </td>
      </tr>
    `;
    return;
  }

  const actionIcons = {
    batch_start: "⚡ Yangi partiya", stage_move: "➔ Bosqich o'zgarishi", batch_complete: "✅ Omborga qabul",
    raw_in: "📥 Xomashyo kirimi", raw_consume: "📉 Xomashyo sarfi", sale_out: "📤 Mahsulot chiqimi",
    bom_create: "📋 Yangi BoM", bom_update: "✏️ BoM tahrir"
  };

  tableBody.innerHTML = state.historyLogs.map(log => `
    <tr>
      <td style="white-space:nowrap; font-size:13px; color:#64748b;">${log.timestamp}</td>
      <td><span style="background:#f1f3f7; padding:3px 10px; border-radius:9999px; font-size:12px; font-weight:600;">${actionIcons[log.action] || log.action}</span></td>
      <td style="font-size:13.5px; color:#0f172a;">${log.description}</td>
      <td style="font-size:13px; color:#475569;">👤 ${log.user}</td>
    </tr>
  `).join("");
}

function exportHistoryCSV() {
  let csv = "Vaqt,Amal,Tafsilot,Masul\n";
  state.historyLogs.forEach(l => {
    csv += `"${l.timestamp}","${l.action}","${l.description}","${l.user}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Seh_tarixi_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  showToast("Tarix CSV formatida yuklab olindi", "info");
}

function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.remove("open");
}

// Global UX: ESC orqali modallarni yopish va Ctrl+K qidiruv
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-overlay.open").forEach(m => m.classList.remove("open"));
    if (state.selectedRollId) {
      state.selectedRollId = null;
      renderRollTracker();
      render7StageConveyor();
    }
  }

  // Ctrl + K yoki Cmd + K orqali qidiruvni faollashtirish
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    const activeSearch = document.querySelector(".table-container-card:not([style*='display: none']) .search-pill input") 
      || document.querySelector(".search-pill input");
    if (activeSearch) {
      activeSearch.focus();
      activeSearch.select();
    }
  }
});

// Modal foniga (backdrop) bosilganda oynani yopish
document.addEventListener("click", (e) => {
  if (e.target && e.target.classList && e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("open");
  }
});

function handleSearch(val) {
  state.searchQuery = val;
  if (state.activeTab === "dashboard") renderDashboardView();
  if (state.activeTab === "conveyor") {
    renderRollTracker();
    render7StageConveyor();
  }
  if (state.activeTab === "raw_materials") renderRawMaterialsTable();
  if (state.activeTab === "finished_goods") renderFinishedGoodsTable();
}

document.addEventListener("DOMContentLoaded", () => {
  loadInitialState();
  renderApp();
});
