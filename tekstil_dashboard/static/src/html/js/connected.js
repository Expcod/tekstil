/* Serverdagi yagona ombor hisobi bilan ishlash. */
let currentUser = null;
let usersCache = [];

async function apiRequest(path, data) {
  const response = await fetch(path, {
    method: data ? 'POST' : 'GET',
    headers: data ? { 'Content-Type': 'application/json' } : {},
    credentials: 'same-origin',
    body: data ? JSON.stringify(data) : undefined
  });
  const result = await response.json();
  if (!response.ok) {
    const error = new Error(result.error || 'Server bilan aloqa uzildi');
    error.status = response.status;
    throw error;
  }
  return result;
}

function applyServerData(data) {
  currentUser = data.user;
  state = { ...state, ...data.state };
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('login-error').textContent = '';
  const roleName = ({
    admin: 'Administrator', warehouse: 'Omborchi', production: 'Ishlab chiqarish'
  })[currentUser.role];
  document.getElementById('user-chip').innerHTML = `<span>${currentUser.displayName}</span>${currentUser.displayName === roleName ? '' : `<small>${roleName}</small>`}${currentUser.role === 'admin' ? '<button type="button" onclick="openUsers()">Xodimlar</button>' : ''}<button type="button" onclick="logout()" title="Chiqish">Chiqish</button>`;
  renderApp();
}

async function initializeApp() {
  try { applyServerData(await apiRequest('/api/state')); }
  catch (error) {
    document.getElementById('login-screen').classList.remove('hidden');
    if (error.status !== 401) document.getElementById('login-error').textContent = error.message;
  }
}

async function submitLogin(event) {
  event.preventDefault();
  try {
    const data = await apiRequest('/api/login', {
      username: document.getElementById('login-username').value.trim(),
      password: document.getElementById('login-password').value
    });
    document.getElementById('login-password').value = '';
    applyServerData(data);
  } catch (error) { document.getElementById('login-error').textContent = error.message; }
}

async function logout() {
  try { await apiRequest('/api/logout', {}); } catch {}
  currentUser = null;
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('login-password').value = '';
}

function renderUsers() {
  const labels = { admin: 'Administrator', warehouse: 'Omborchi', production: 'Ishlab chiqarish' };
  document.getElementById('users-table-body').innerHTML = usersCache.map(u => `<tr><td>${u.username}</td>
    <td>${u.displayName}</td><td>${labels[u.role]}</td><td><button class="btn btn-secondary btn-sm" onclick="editUser('${u.username}')">Tahrirlash</button></td></tr>`).join('');
}
async function openUsers() {
  try {
    usersCache = (await apiRequest('/api/users')).users;
    renderUsers();
    document.getElementById('user-username').value = '';
    document.getElementById('user-display-name').value = '';
    document.getElementById('user-password').value = '';
    document.getElementById('user-error').textContent = '';
    document.getElementById('modal-users').classList.add('open');
  } catch (error) { showToast(error.message, 'danger'); }
}
function editUser(username) {
  const user = usersCache.find(x => x.username === username);
  if (!user) return;
  document.getElementById('user-username').value = user.username;
  document.getElementById('user-display-name').value = user.displayName;
  document.getElementById('user-role').value = user.role;
  document.getElementById('user-password').value = '';
  document.getElementById('user-username').focus();
}
async function submitUser(event) {
  event.preventDefault();
  try {
    const data = await apiRequest('/api/users', {
      username: document.getElementById('user-username').value.trim(),
      displayName: document.getElementById('user-display-name').value.trim(),
      role: document.getElementById('user-role').value,
      password: document.getElementById('user-password').value
    });
    usersCache = data.users;
    renderUsers();
    document.getElementById('user-password').value = '';
    document.getElementById('user-error').textContent = '';
    applyServerData(await apiRequest('/api/state'));
    showToast('Xodim saqlandi');
  } catch (error) { document.getElementById('user-error').textContent = error.message; }
}

async function performAction(type, payload, modalId, message) {
  try {
    const data = await apiRequest('/api/action', { type, payload: { ...payload, version: state.version } });
    applyServerData(data);
    if (modalId) closeModal(modalId);
    showToast(message, 'success');
    return true;
  } catch (error) {
    showToast(error.message, 'danger');
    if (error.status === 409) {
      try { applyServerData(await apiRequest('/api/state')); } catch {}
    }
    return false;
  }
}

resetDemoData = async function () {
  if (!confirm('Namunaviy holatga qaytish barcha joriy ombor va ishlab chiqarish ma’lumotlarini almashtiradi. Davom etilsinmi?')) return;
  await performAction('reset_demo', {}, null, 'Namunaviy ma’lumotlar tiklandi');
};

function toggleInboundFields() {
  const selected = document.getElementById('inbound-raw-select').value;
  const newMaterial = selected === 'new';
  const category = newMaterial ? document.getElementById('inbound-category').value : state.rawMaterials.find(x => x.id === selected)?.category;
  const fabric = category === 'fabric';
  document.getElementById('inbound-new-fields').hidden = !newMaterial;
  document.getElementById('inbound-roll-fields').hidden = !fabric;
  for (const id of ['inbound-name', 'inbound-color', 'inbound-min', 'inbound-rate', 'inbound-price']) document.getElementById(id).required = newMaterial;
  for (const id of ['inbound-roll-code', 'inbound-width', 'inbound-supplier']) document.getElementById(id).required = fabric;
  if (newMaterial) {
    const unit = document.getElementById('inbound-unit');
    if (fabric) unit.value = 'metr';
    else if (unit.value === 'metr' || category === 'packaging') unit.value = 'dona';
    if (!document.getElementById('inbound-rate').value) document.getElementById('inbound-rate').value = 1;
  }
}

openRawInboundModal = function (selectedRawId = null) {
  if (!['admin', 'warehouse'].includes(currentUser?.role)) return;
  const select = document.getElementById('inbound-raw-select');
  select.innerHTML = state.rawMaterials.map(item => `<option value="${item.id}">${item.name} (${item.stock} ${item.unit})</option>`).join('') + '<option value="new">+ Yangi xomashyo turi</option>';
  select.value = selectedRawId || state.rawMaterials[0]?.id || 'new';
  document.getElementById('inbound-quantity').value = '';
  document.getElementById('inbound-roll-code').value = '';
  document.getElementById('inbound-supplier').value = '';
  toggleInboundFields();
  document.getElementById('modal-raw-inbound').classList.add('open');
};

submitRawInbound = async function (event) {
  event.preventDefault();
  const get = id => document.getElementById(id).value.trim();
  await performAction('inbound_raw', {
    materialId: get('inbound-raw-select'), quantity: get('inbound-quantity'),
    name: get('inbound-name'), category: get('inbound-category'), unit: get('inbound-unit'),
    color: get('inbound-color'), minStock: get('inbound-min'),
    consumptionPerUnit: get('inbound-rate'), price: get('inbound-price'),
    rollCode: get('inbound-roll-code'), widthCm: get('inbound-width'), supplier: get('inbound-supplier')
  }, 'modal-raw-inbound', 'Xomashyo kirimi saqlandi');
};

openNewBatchModal = function () {
  if (!['admin', 'production'].includes(currentUser?.role)) return;
  const fabric = document.getElementById('batch-fabric-select');
  fabric.innerHTML = state.rolls.filter(r => r.remainingMeters > 0).map(r => {
    const material = state.rawMaterials.find(x => x.id === r.materialId);
    return `<option value="${r.id}" data-rate="${material.consumptionPerUnit}">${r.code} — ${material.name} (${r.remainingMeters} m)</option>`;
  }).join('');
  document.getElementById('batch-stone-select').innerHTML = '<option value="">Toshsiz</option>' +
    state.rawMaterials.filter(x => x.category === 'accessory' && x.unit === 'dona')
      .map(x => `<option value="${x.id}">${x.name} (${x.stock} dona)</option>`).join('');
  document.getElementById('batch-quantity').value = 100;
  document.getElementById('batch-sku').value = `ROMOL-${Date.now().toString().slice(-6)}`;
  for (const id of ['batch-name', 'batch-color', 'batch-decor', 'batch-price', 'batch-cost']) document.getElementById(id).value = '';
  calculateBatchNeeds();
  document.getElementById('modal-new-batch').classList.add('open');
};

calculateBatchNeeds = function () {
  const selected = document.getElementById('batch-fabric-select');
  const roll = state.rolls.find(x => x.id === selected.value);
  const info = document.getElementById('batch-calc-info');
  if (!roll) { info.textContent = 'Mavjud rulon yo‘q. Avval mato kirim qiling.'; return; }
  const material = state.rawMaterials.find(x => x.id === roll.materialId);
  const qty = Number(document.getElementById('batch-quantity').value) || 0;
  const needed = Math.round(qty * material.consumptionPerUnit * 1000) / 1000;
  info.innerHTML = `<div class="calc-row"><span>1 ro‘molga sarf</span><strong>${material.consumptionPerUnit} metr</strong></div>
    <div class="calc-row"><span>Kerakli mato</span><strong>${needed} metr</strong></div>
    <div class="calc-row"><span>${roll.code} qoldig‘i</span><strong class="${roll.remainingMeters < needed ? 'text-danger' : ''}">${roll.remainingMeters} metr</strong></div>`;
};

submitNewBatch = async function (event) {
  event.preventDefault();
  const get = id => document.getElementById(id).value.trim();
  await performAction('new_batch', {
    name: get('batch-name'), size: get('batch-size'), rollId: get('batch-fabric-select'),
    stoneId: get('batch-stone-select'), quantity: get('batch-quantity'), sku: get('batch-sku'),
    color: get('batch-color'), decorType: get('batch-decor'), price: get('batch-price'), costPrice: get('batch-cost')
  }, 'modal-new-batch', 'Yangi partiya bichuvga yuborildi');
};

advanceBatchStage = function (batchId) {
  if (!['admin', 'production'].includes(currentUser?.role)) return;
  const batch = state.batches.find(x => x.id === batchId);
  if (!batch) return;
  const stages = { cutting: 'Bichuv', sewing_stone: 'Tikish va bezash', ironing: 'Dazmollash', packaging: 'Qadoqlash' };
  document.getElementById('stage-batch-id').value = batchId;
  document.getElementById('stage-batch-info').textContent = `${batch.id} · ${batch.name} · ${batch.quantity} dona · ${stages[batch.currentStage]}`;
  document.getElementById('stage-accepted').value = batch.quantity;
  document.getElementById('stage-defective').value = 0;
  document.getElementById('stage-rework').value = 0;
  document.getElementById('modal-stage').classList.add('open');
};

async function submitStage(event) {
  event.preventDefault();
  const batchId = document.getElementById('stage-batch-id').value;
  const batch = state.batches.find(x => x.id === batchId);
  const accepted = Number(document.getElementById('stage-accepted').value);
  const defective = Number(document.getElementById('stage-defective').value);
  const rework = Number(document.getElementById('stage-rework').value);
  if (accepted + defective + rework !== batch.quantity) {
    showToast(`Jami ${batch.quantity} dona bo‘lishi kerak`, 'danger'); return;
  }
  await performAction('advance_stage', { batchId, accepted, defective, rework }, 'modal-stage', 'Bosqich natijasi saqlandi');
}

openSaleModal = function (goodsId) {
  if (!['admin', 'warehouse'].includes(currentUser?.role)) return;
  const item = state.finishedGoods.find(x => x.id === goodsId);
  if (!item) return;
  document.getElementById('sale-goods-id').value = goodsId;
  document.getElementById('sale-goods-name').textContent = `${item.name} (${item.size})`;
  document.getElementById('sale-goods-stock').textContent = `${item.stock} dona`;
  document.getElementById('sale-quantity').value = Math.min(10, item.stock);
  document.getElementById('sale-quantity').max = item.stock;
  document.getElementById('modal-sale').classList.add('open');
};

submitSale = async function (event) {
  event.preventDefault();
  await performAction('sale_out', {
    goodsId: document.getElementById('sale-goods-id').value,
    quantity: document.getElementById('sale-quantity').value,
    recipient: document.getElementById('sale-client').value.trim() || 'Xaridor'
  }, 'modal-sale', 'Tayyor mahsulot chiqimi saqlandi');
};

function openAdjustment(itemType, itemId) {
  if (!['admin', 'warehouse'].includes(currentUser?.role)) return;
  const item = itemType === 'roll' ? state.rolls.find(x => x.id === itemId) :
    (itemType === 'finished' ? state.finishedGoods : state.rawMaterials).find(x => x.id === itemId);
  if (!item) return;
  document.getElementById('adjust-item-type').value = itemType;
  document.getElementById('adjust-item-id').value = itemId;
  document.getElementById('adjust-item-name').textContent = item.code || item.name;
  document.getElementById('adjust-counted').value = itemType === 'roll' ? item.remainingMeters : item.stock;
  document.getElementById('adjust-reason').value = '';
  document.getElementById('modal-adjust').classList.add('open');
}

async function submitAdjustment(event) {
  event.preventDefault();
  await performAction('adjust_stock', {
    itemType: document.getElementById('adjust-item-type').value,
    itemId: document.getElementById('adjust-item-id').value,
    counted: document.getElementById('adjust-counted').value,
    reason: document.getElementById('adjust-reason').value.trim()
  }, 'modal-adjust', 'Inventarizatsiya qoldig‘i saqlandi');
}

function money(value) { return `${Math.round(Number(value) || 0).toLocaleString('uz-UZ')} so'm`; }
function safeText(value) { return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }

function renderPartners() {
  const partners = state.partners || [];
  const sales = state.sales || [];
  const transactions = state.partnerTransactions || [];
  const saleTotal = sales.reduce((sum, sale) => sum + sale.total, 0);
  const debtTotal = partners.reduce((sum, partner) => sum + Math.max(0, partner.balance), 0);
  document.getElementById('partners-count').textContent = partners.length;
  document.getElementById('partners-sales-total').textContent = money(saleTotal);
  document.getElementById('partners-debt-total').textContent = money(debtTotal);
  const body = document.getElementById('partners-table-body');
  body.innerHTML = partners.map(partner => {
    const partnerSales = sales.filter(sale => sale.partnerId === partner.id);
    const bought = partnerSales.reduce((sum, sale) => sum + sale.total, 0);
    const paid = transactions.filter(tx => tx.partnerId === partner.id && tx.type === 'payment').reduce((sum, tx) => sum - tx.amount, 0);
    const balanceClass = partner.balance > 0 ? 'text-danger' : partner.balance < 0 ? 'text-success' : '';
    const settlement = partner.balance > 0 ? `Qarzi ${money(partner.balance)}` : partner.balance < 0 ? `Avans ${money(-partner.balance)}` : 'Hisob yopiq';
    return `<tr><td><strong>${safeText(partner.name)}</strong>${partner.notes ? `<div class="form-helper">${safeText(partner.notes)}</div>` : ''}</td><td>${safeText(partner.phone || '—')}</td><td>${partnerSales.length}</td><td>${money(bought)}</td><td>${money(paid)}</td><td class="${balanceClass}"><strong>${settlement}</strong></td><td><div class="table-actions"><button class="btn btn-secondary btn-sm" onclick="filterPartnerLedger('${partner.id}')">Tarix</button><button class="btn btn-secondary btn-sm warehouse-only" onclick="openPartnerPayment('${partner.id}')">To'lov</button></div></td></tr>`;
  }).join('') || '<tr><td colspan="7" class="empty-state">Hamkorlar hali qo\'shilmagan.</td></tr>';
  const filter = document.getElementById('partner-ledger-filter');
  const selected = filter.value;
  filter.innerHTML = '<option value="all">Barcha hamkorlar</option>' + partners.map(p => `<option value="${p.id}">${safeText(p.name)}</option>`).join('');
  filter.value = partners.some(p => p.id === selected) ? selected : 'all';
  const partnerId = filter.value;
  document.getElementById('partner-ledger-title').textContent = partnerId === 'all' ? 'Oldi-berdi tarixi' : `${partners.find(p => p.id === partnerId)?.name || ''} — oldi-berdi tarixi`;
  const rows = [];
  for (const sale of sales) {
    if (partnerId !== 'all' && sale.partnerId !== partnerId) continue;
    const partner = partners.find(p => p.id === sale.partnerId);
    const contents = sale.items.map(item => `${safeText(item.name)} (${safeText(item.sku)}) × ${item.quantity}`).join('<br>');
    rows.push({ timestamp: sale.timestamp, html: `<tr><td>${new Date(sale.timestamp).toLocaleString('uz-UZ')}</td><td>${safeText(partner?.name || '—')}</td><td><strong>${safeText(sale.number)}</strong><div class="form-helper">${contents}</div></td><td>${money(sale.total)}</td><td>${money(sale.paid)}</td><td class="${sale.balance ? 'text-danger' : 'text-success'}">${money(sale.balance)}</td></tr>` });
  }
  for (const tx of transactions.filter(item => item.type === 'payment' && !item.saleId)) {
    if (partnerId !== 'all' && tx.partnerId !== partnerId) continue;
    const partner = partners.find(p => p.id === tx.partnerId);
    rows.push({ timestamp: tx.timestamp, html: `<tr><td>${new Date(tx.timestamp).toLocaleString('uz-UZ')}</td><td>${safeText(partner?.name || '—')}</td><td><strong>To'lov</strong><div class="form-helper">${safeText(tx.note)}</div></td><td>—</td><td>${money(-tx.amount)}</td><td class="text-success">−${money(-tx.amount)}</td></tr>` });
  }
  document.getElementById('partner-ledger-body').innerHTML = rows.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).map(row => row.html).join('') || '<tr><td colspan="6" class="empty-state">Bu hamkor bo\'yicha harakat yo\'q.</td></tr>';
}

function filterPartnerLedger(partnerId) {
  document.getElementById('partner-ledger-filter').value = partnerId;
  renderPartners();
  document.getElementById('partner-ledger-title').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function openPartnerModal() {
  if (!['admin', 'warehouse'].includes(currentUser?.role)) return;
  for (const id of ['partner-name', 'partner-phone', 'partner-notes']) document.getElementById(id).value = '';
  document.getElementById('modal-partner').classList.add('open');
}
async function submitPartner(event) {
  event.preventDefault();
  await performAction('create_partner', { name: document.getElementById('partner-name').value.trim(),
    phone: document.getElementById('partner-phone').value.trim(), notes: document.getElementById('partner-notes').value.trim() },
  'modal-partner', 'Hamkor saqlandi');
}

function openInvoiceModal(goodsId = '') {
  if (!['admin', 'warehouse'].includes(currentUser?.role)) return;
  const available = state.finishedGoods.filter(item => item.stock > 0);
  if (!available.length) { showToast('Sotuvga tayyor mahsulot qolmagan', 'danger'); return; }
  if (!(state.partners || []).length) { showToast('Avval hamkor qo\'shing', 'danger'); return; }
  document.getElementById('sale-partner').innerHTML = state.partners.map(partner => `<option value="${partner.id}">${safeText(partner.name)} · ${partner.balance > 0 ? `qarz ${money(partner.balance)}` : 'hisob yopiq'}</option>`).join('');
  document.getElementById('sale-lines').innerHTML = '';
  document.getElementById('sale-paid').value = 0;
  document.getElementById('sale-note').value = '';
  addInvoiceLine(goodsId);
  document.getElementById('modal-sale').classList.add('open');
}

function addInvoiceLine(goodsId = '') {
  const available = state.finishedGoods.filter(item => item.stock > 0);
  const row = document.createElement('div');
  row.className = 'sale-line';
  row.innerHTML = `<select class="form-control sale-product" onchange="updateInvoiceTotal()">${available.map(item => `<option value="${item.id}" data-price="${item.price}" data-stock="${item.stock}" ${item.id === goodsId ? 'selected' : ''}>${safeText(item.sku)} · ${safeText(item.name)} (${item.stock} dona)</option>`).join('')}</select><input class="form-control sale-quantity" type="number" min="1" value="1" max="${available.find(item => item.id === goodsId)?.stock ?? available[0]?.stock ?? 1}" oninput="updateInvoiceTotal()" aria-label="Miqdor"><input class="form-control sale-price" type="number" min="0" value="${available.find(item => item.id === goodsId)?.price ?? available[0]?.price ?? 0}" oninput="updateInvoiceTotal()" aria-label="Narx"><button type="button" class="btn btn-secondary btn-sm" onclick="this.closest('.sale-line').remove();updateInvoiceTotal()" aria-label="Qatorni o'chirish">×</button>`;
  row.querySelector('.sale-product').addEventListener('change', event => {
    const option = event.target.selectedOptions[0];
    row.querySelector('.sale-quantity').max = option.dataset.stock;
    row.querySelector('.sale-price').value = option.dataset.price;
    updateInvoiceTotal();
  });
  document.getElementById('sale-lines').append(row);
  updateInvoiceTotal();
}

function updateInvoiceTotal() {
  const lines = [...document.querySelectorAll('.sale-line')];
  const total = lines.reduce((sum, row) => sum + Number(row.querySelector('.sale-quantity').value || 0) * Number(row.querySelector('.sale-price').value || 0), 0);
  document.getElementById('sale-total').textContent = money(total);
  document.getElementById('sale-paid').max = total;
}

async function submitInvoice(event) {
  event.preventDefault();
  const items = [...document.querySelectorAll('.sale-line')].map(row => ({ goodsId: row.querySelector('.sale-product').value,
    quantity: row.querySelector('.sale-quantity').value, unitPrice: row.querySelector('.sale-price').value }));
  await performAction('sale_invoice', { partnerId: document.getElementById('sale-partner').value, items,
    paid: document.getElementById('sale-paid').value, note: document.getElementById('sale-note').value.trim() },
  'modal-sale', 'Sotuv hamkor hisobiga yozildi');
}

function openPartnerPayment(partnerId) {
  if (!['admin', 'warehouse'].includes(currentUser?.role)) return;
  const partner = state.partners.find(item => item.id === partnerId);
  if (!partner) return;
  document.getElementById('payment-partner-id').value = partnerId;
  document.getElementById('payment-partner-info').textContent = `${partner.name} · ${partner.balance > 0 ? `Qarzi: ${money(partner.balance)}` : partner.balance < 0 ? `Avansi: ${money(-partner.balance)}` : 'Hisob yopiq'}`;
  document.getElementById('payment-amount').value = '';
  document.getElementById('payment-note').value = '';
  document.getElementById('modal-payment').classList.add('open');
}
async function submitPartnerPayment(event) {
  event.preventDefault();
  await performAction('partner_payment', { partnerId: document.getElementById('payment-partner-id').value,
    amount: document.getElementById('payment-amount').value, note: document.getElementById('payment-note').value.trim() },
  'modal-payment', 'Hamkor to\'lovi qayd etildi');
}

const BOM_STAGES = { cutting: 'Bichuv', sewing_stone: 'Tikish va bezash', ironing: 'Dazmollash', packaging: 'Qadoqlash' };
function renderBoms() {
  const rows = (state.boms || []).map(bom => {
    const contents = bom.items.map(line => {
      const material = state.rawMaterials.find(item => item.id === line.materialId);
      const unitCost = (material?.price || 0) * line.quantityPerUnit;
      return `<div class="bom-item-summary"><span>${safeText(material?.name || "O'chirilgan xomashyo")} · ${line.quantityPerUnit} ${safeText(material?.unit || '')}/dona</span><small>${BOM_STAGES[line.stage] || line.stage} · ${money(unitCost)}</small></div>`;
    }).join('');
    return `<tr><td><strong>${safeText(bom.name)}</strong><div class="form-helper">${safeText(bom.sku)} · ${safeText(bom.color)} · ${safeText(bom.decorType)}</div></td><td>${safeText(bom.size)}</td><td>${contents}</td><td>${money(bom.items.reduce((sum, line) => sum + (state.rawMaterials.find(item => item.id === line.materialId)?.price || 0) * line.quantityPerUnit, 0))}</td><td>${new Date(bom.updatedAt).toLocaleDateString('uz-UZ')}</td><td><button class="btn btn-secondary btn-sm bom-editor" onclick="editBom('${bom.id}')">Tahrirlash</button></td></tr>`;
  }).join('');
  document.getElementById('boms-table-body').innerHTML = rows || '<tr><td colspan="6" class="empty-state">BoM retseptlari hali yaratilmagan.</td></tr>';
}

function openBomModal(bomId = '') {
  if (!['admin', 'production'].includes(currentUser?.role)) return;
  const bom = (state.boms || []).find(item => item.id === bomId);
  document.getElementById('bom-id').value = bom?.id || '';
  document.getElementById('bom-name').value = bom?.name || '';
  document.getElementById('bom-sku').value = bom?.sku || '';
  document.getElementById('bom-size').value = bom?.size || '';
  document.getElementById('bom-color').value = bom?.color || '';
  document.getElementById('bom-decor').value = bom?.decorType || 'Klassik';
  document.getElementById('bom-price').value = bom?.price ?? '';
  document.getElementById('bom-cost').value = bom?.costPrice ?? '';
  document.getElementById('bom-lines').innerHTML = '';
  if (bom) bom.items.forEach(line => addBomLine(line));
  else addBomLine();
  document.getElementById('modal-bom').classList.add('open');
}
function editBom(bomId) { openBomModal(bomId); }
function addBomLine(line = {}) {
  const row = document.createElement('div');
  row.className = 'bom-line';
  row.innerHTML = `<select class="form-control bom-material" required>${state.rawMaterials.map(material => `<option value="${material.id}" ${material.id === line.materialId ? 'selected' : ''}>${safeText(material.name)} (${safeText(material.unit)})</option>`).join('')}</select><input class="form-control bom-amount" type="number" min="0.000001" step="any" value="${line.quantityPerUnit ?? ''}" required aria-label="Dona boshiga sarf"><select class="form-control bom-stage" required>${Object.entries(BOM_STAGES).map(([value, label]) => `<option value="${value}" ${value === (line.stage || 'cutting') ? 'selected' : ''}>${label}</option>`).join('')}</select><button type="button" class="btn btn-secondary btn-sm" onclick="this.closest('.bom-line').remove()" aria-label="Qatorni o'chirish">×</button>`;
  document.getElementById('bom-lines').append(row);
}
async function submitBom(event) {
  event.preventDefault();
  const items = [...document.querySelectorAll('.bom-line')].map(row => ({ materialId: row.querySelector('.bom-material').value,
    quantityPerUnit: row.querySelector('.bom-amount').value, stage: row.querySelector('.bom-stage').value }));
  await performAction('save_bom', { bomId: document.getElementById('bom-id').value || undefined,
    name: document.getElementById('bom-name').value.trim(), sku: document.getElementById('bom-sku').value.trim(),
    size: document.getElementById('bom-size').value.trim(), color: document.getElementById('bom-color').value.trim(),
    decorType: document.getElementById('bom-decor').value.trim(), price: document.getElementById('bom-price').value,
    costPrice: document.getElementById('bom-cost').value, items }, 'modal-bom', 'BoM retsepti saqlandi');
}

function selectBatchBom() {
  const bom = (state.boms || []).find(item => item.id === document.getElementById('batch-bom-select').value);
  if (!bom) return;
  for (const [id, value] of Object.entries({ 'batch-name': bom.name, 'batch-size': bom.size, 'batch-sku': bom.sku,
    'batch-color': bom.color, 'batch-decor': bom.decorType, 'batch-price': bom.price, 'batch-cost': bom.costPrice })) {
    document.getElementById(id).value = value;
  }
  const fabricLine = bom.items.find(line => state.rawMaterials.find(item => item.id === line.materialId)?.category === 'fabric');
  const fabricSelect = document.getElementById('batch-fabric-select');
  fabricSelect.innerHTML = state.rolls.filter(roll => roll.materialId === fabricLine?.materialId && roll.remainingMeters > 0)
    .map(roll => `<option value="${roll.id}">${safeText(roll.code)} · ${safeText(state.rawMaterials.find(item => item.id === roll.materialId)?.name)} (${roll.remainingMeters} m)</option>`).join('');
  document.getElementById('batch-bom-materials').innerHTML = bom.items.map(line => {
    const material = state.rawMaterials.find(item => item.id === line.materialId);
    return `<div class="bom-item-summary"><span>${safeText(material?.name || '')}: ${line.quantityPerUnit} ${safeText(material?.unit || '')}/dona</span><small>${BOM_STAGES[line.stage]}</small></div>`;
  }).join('');
  calculateBatchNeeds();
}

openNewBatchModal = function () {
  if (!['admin', 'production'].includes(currentUser?.role)) return;
  if (!(state.boms || []).some(item => item.active !== false)) {
    showToast('Avval BoM retseptini yarating', 'danger');
    switchTab('boms');
    return;
  }
  const select = document.getElementById('batch-bom-select');
  select.innerHTML = (state.boms || []).filter(item => item.active !== false)
    .map(item => `<option value="${item.id}">${safeText(item.sku)} · ${safeText(item.name)}</option>`).join('');
  document.getElementById('batch-quantity').value = 100;
  for (const id of ['batch-price', 'batch-cost']) document.getElementById(id).readOnly = true;
  selectBatchBom();
  document.getElementById('modal-new-batch').classList.add('open');
};

calculateBatchNeeds = function () {
  const bom = (state.boms || []).find(item => item.id === document.getElementById('batch-bom-select').value);
  const roll = state.rolls.find(item => item.id === document.getElementById('batch-fabric-select').value);
  const info = document.getElementById('batch-calc-info');
  if (!bom) { info.textContent = 'Avval BoM retseptini yarating.'; return; }
  if (!roll) { info.textContent = 'Bu BoM matosi uchun rulon qoldig\'i yo\'q.'; return; }
  const materialLine = bom.items.find(line => state.rawMaterials.find(item => item.id === line.materialId)?.category === 'fabric');
  const qty = Number(document.getElementById('batch-quantity').value) || 0;
  const needed = Math.round(qty * materialLine.quantityPerUnit * 1000) / 1000;
  const materialNeeds = bom.items.map(line => {
    const material = state.rawMaterials.find(item => item.id === line.materialId);
    const required = Math.round(qty * line.quantityPerUnit * 1000) / 1000;
    const available = material.category === 'fabric' ? roll.remainingMeters : material.stock;
    const unit = material.category === 'fabric' ? 'metr' : material.unit;
    return `<div class="calc-row"><span>${safeText(material.name)} · ${BOM_STAGES[line.stage]}</span><strong class="${available < required ? 'text-danger' : ''}">${required} ${safeText(unit)} kerak / ${available} ${safeText(unit)} mavjud</strong></div>`;
  }).join('');
  info.innerHTML = `<div class="calc-row"><span>Har bir ro'molga mato sarfi</span><strong>${materialLine.quantityPerUnit} metr</strong></div><div class="form-helper">Partiya uchun xomashyo talabi:</div>${materialNeeds}<div class="calc-row"><span>${safeText(roll.code)} rulonida qoldiq</span><strong class="${roll.remainingMeters < needed ? 'text-danger' : ''}">${roll.remainingMeters} metr</strong></div>`;
};

submitNewBatch = async function (event) {
  event.preventDefault();
  await performAction('new_batch', { bomId: document.getElementById('batch-bom-select').value,
    rollId: document.getElementById('batch-fabric-select').value, quantity: document.getElementById('batch-quantity').value },
  'modal-new-batch', 'BoM asosida partiya bichuvga yuborildi');
};

openSaleModal = function (goodsId) { openInvoiceModal(goodsId); };
submitSale = function (event) { return submitInvoice(event); };

function renderRollsTable() {
  const body = document.getElementById('rolls-table-body');
  body.innerHTML = state.rolls.map(r => {
    const material = state.rawMaterials.find(x => x.id === r.materialId);
    return `<tr><td><strong>${r.code}</strong></td><td>${material?.name || '—'}</td><td>${r.widthCm} sm</td>
      <td>${r.initialMeters} m</td><td><strong>${r.remainingMeters} m</strong></td><td>${r.supplier}</td>
      <td><button class="btn btn-secondary btn-sm warehouse-only" onclick="openAdjustment('roll','${r.id}')">Sanash</button></td></tr>`;
  }).join('');
}

renderHistoryTable = function () {
  const labels = { opening: 'Boshlang‘ich', inbound: 'Kirim', consume: 'Ishlab chiqarish sarfi',
    adjust: 'Inventarizatsiya', complete: 'Tayyor omborga', outbound: 'Chiqim' };
  const events = { batch_start: 'Yangi partiya', stage_move: 'Bosqich almashdi',
    batch_complete: 'Tayyor omborga', raw_in: 'Xomashyo kirimi', sale_out: 'Chiqim', sale_invoice: 'Hamkorga sotuv',
    partner_add: 'Hamkor qo\'shildi', partner_payment: 'Hamkor to\'lovi', adjust: 'Inventarizatsiya' };
  document.getElementById('history-table-body').innerHTML = state.movements.map(m => `<tr>
    <td>${new Date(m.timestamp).toLocaleString('uz-UZ')}</td><td><span class="prop-pill">${labels[m.type] || m.type}</span></td>
    <td><strong>${m.itemName}</strong><div class="form-helper">${m.note}</div></td>
    <td class="${m.delta < 0 ? 'text-danger' : 'text-success'}">${m.delta > 0 ? '+' : ''}${m.delta} ${m.unit}</td>
    <td>${m.balance} ${m.unit}</td><td>${m.actor}</td></tr>`).join('');
  document.getElementById('events-table-body').innerHTML = state.historyLogs.map(log => `<tr>
    <td>${new Date(log.timestamp).toLocaleString('uz-UZ')}</td><td><span class="prop-pill">${events[log.action] || log.action}</span></td>
    <td>${log.description}</td><td>${log.user}</td></tr>`).join('');
};

const originalRenderApp = renderApp;
renderApp = function () {
  originalRenderApp();
  if (state.activeTab === 'raw_materials') renderRollsTable();
  if (state.activeTab === 'partners') renderPartners();
  const warehouse = ['admin', 'warehouse'].includes(currentUser?.role);
  const production = ['admin', 'production'].includes(currentUser?.role);
  document.querySelectorAll('[onclick^="openRawInboundModal"], [onclick^="openSaleModal"], .warehouse-only').forEach(el => el.hidden = !warehouse);
  document.querySelectorAll('[onclick^="openNewBatchModal"], [onclick^="advanceBatchStage"]').forEach(el => el.hidden = !production);
  document.querySelectorAll('.bom-editor').forEach(el => el.hidden = !production);
  document.querySelector('.btn-reset-demo').hidden = currentUser?.role !== 'admin';
};

document.addEventListener('DOMContentLoaded', initializeApp);
