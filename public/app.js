const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  window.location.href = "/login.html";
}



const state = {
  products: [],
  cart: new Map(),
  cashierId: currentUser.id
};



const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
});



const els = {
  status: document.getElementById("connection-status"),
  search: document.getElementById("search"),
  productList: document.getElementById("product-list"),
  cartList: document.getElementById("cart-list"),
  itemCount: document.getElementById("item-count"),
  total: document.getElementById("cart-total"),
  change: document.getElementById("change-total"),
  paid: document.getElementById("paid-amount"),
  method: document.getElementById("payment-method"),
  checkoutForm: document.getElementById("checkout-form"),
  clearCart: document.getElementById("clear-cart"),
  productForm: document.getElementById("product-form"),
  history: document.getElementById("history-list"),
  refreshHistory: document.getElementById("refresh-history"),
  toast: document.getElementById("toast"),

  startDate: document.getElementById("start-date"),
  endDate: document.getElementById("end-date"),
  loadReport: document.getElementById("load-report"),
  reportResult: document.getElementById("report-result"),

  salesChart: document.getElementById("sales-chart"),
  exportPdf: document.getElementById("export-pdf")
};



const userElement = document.getElementById("current-user");
const roleElement = document.getElementById("current-role");
const logoutBtn = document.getElementById("logoutBtn");

if (userElement) userElement.textContent = currentUser.name;
if (roleElement) roleElement.textContent = currentUser.role;

logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "/login.html";
});



if (currentUser.role !== "owner") {
  document.querySelector(".add-panel")?.remove();
  document.querySelector(".report-panel")?.remove();
}



function showToast(msg, error = false) {
  els.toast.textContent = msg;
  els.toast.className = error ? "toast error" : "toast";
  els.toast.hidden = false;

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    els.toast.hidden = true;
  }, 3000);
}



async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) throw new Error(data.message || "Server error");

  return data;
}


function cartTotal() {
  return [...state.cart.values()]
    .reduce((s, i) => s + i.price * i.quantity, 0);
}

function cartCount() {
  return [...state.cart.values()]
    .reduce((s, i) => s + i.quantity, 0);
}


function renderProducts() {
  if (!state.products.length) {
    els.productList.innerHTML = `<div class="empty">Produk kosong</div>`;
    return;
  }

  els.productList.innerHTML = state.products.map(p => `
    <article class="product-card ${p.lowStock ? "low" : ""}">
      <div>
        <h3>${p.name}</h3>
        <p>${p.sku} - ${p.category}</p>
      </div>
      <div>${rupiah.format(p.price)}</div>
      <button data-add="${p.id}" ${p.stock <= 0 ? "disabled" : ""}>
        Tambah
      </button>
    </article>
  `).join("");
}



function renderCart() {
  const items = [...state.cart.values()];

  if (!items.length) {
    els.cartList.className = "cart-list empty";
    els.cartList.textContent = "Belum ada barang.";
  } else {
    els.cartList.className = "cart-list";

    els.cartList.innerHTML = items.map(i => `
      <div class="cart-item">
        <div>
          <strong>${i.name}</strong>
          <small>${rupiah.format(i.price)} x ${i.quantity}</small>
        </div>
        <div>
          <button data-dec="${i.id}">-</button>
          <span>${i.quantity}</span>
          <button data-inc="${i.id}">+</button>
        </div>
      </div>
    `).join("");
  }

  const total = cartTotal();
  const paid = Number(els.paid.value || 0);

  els.itemCount.textContent = cartCount();
  els.total.textContent = rupiah.format(total);
  els.change.textContent = rupiah.format(Math.max(0, paid - total));
}


async function loadProducts() {
  const data = await api(`/api/products?search=${els.search.value || ""}`);

  state.products = data.products || [];
  els.status.textContent = "Terhubung";

  renderProducts();
}



async function loadHistory() {
  const data = await api("/api/transactions");

  const trx = data.transactions || [];

  els.history.className = trx.length ? "history-list" : "history-list empty";

  els.history.innerHTML = trx.length
    ? trx.map(t => `
      <div class="history-item">
        <div>
          <strong>${t.invoice_number}</strong>
          <small>${new Date(t.created_at).toLocaleString()}</small>
        </div>
        <span>${rupiah.format(t.total)}</span>
      </div>
    `).join("")
    : "Belum ada transaksi.";
}



async function loadReport() {
  const start = els.startDate.value;
  const end = els.endDate.value;

  if (!start || !end) return showToast("Pilih tanggal", true);

  const data = await api(`/api/reports/summary?startDate=${start}&endDate=${end}`);

  const r = data.report;

  els.reportResult.innerHTML = `
    <p>Total Transaksi: <strong>${r.transactionCount}</strong></p>
    <p>Total Pendapatan: <strong>${rupiah.format(r.revenue)}</strong></p>
  `;
}



let salesChart = null;

async function loadSalesChart() {
  const today = new Date().toISOString().slice(0, 10);

  const data = await api(
    `/api/reports/summary?startDate=${today}&endDate=${today}`
  );

  const r = data.report;

  const labels = r.bestSellers.map(i => i.name);
  const values = r.bestSellers.map(i => i.sold_quantity);

  const ctx = els.salesChart.getContext("2d");

  if (!salesChart) {
    salesChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Produk Terjual",
          data: values
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  } else {
    salesChart.data.labels = labels;
    salesChart.data.datasets[0].data = values;
    salesChart.update();
  }
}



function togglePanel(id) {
  const el = document.getElementById(id);
  const collapsed = el.classList.toggle("collapsed");


  if (!collapsed && id === "chartPanel") {
    setTimeout(() => {
      if (salesChart) {
        salesChart.resize();
        salesChart.update();
      } else {
        loadSalesChart();
      }
    }, 150);
  }
}



els.productList.addEventListener("click", e => {
  const btn = e.target.closest("[data-add]");
  if (!btn) return;

  const p = state.products.find(x => x.id == btn.dataset.add);
  if (!p) return;

  const cur = state.cart.get(p.id) || { ...p, quantity: 0 };

  if (cur.quantity >= p.stock) return showToast("Stok habis", true);

  cur.quantity++;
  state.cart.set(p.id, cur);

  renderCart();
});

els.cartList.addEventListener("click", e => {
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  const id = inc?.dataset.inc || dec?.dataset.dec;
  if (!id) return;

  const item = state.cart.get(Number(id));
  if (!item) return;

  item.quantity += inc ? 1 : -1;

  if (item.quantity <= 0) state.cart.delete(Number(id));

  renderCart();
});



els.search.addEventListener("input", loadProducts);
els.paid.addEventListener("input", renderCart);
els.method.addEventListener("change", renderCart);

els.clearCart.addEventListener("click", () => {
  state.cart.clear();
  renderCart();
});

els.refreshHistory?.addEventListener("click", loadHistory);



els.checkoutForm.addEventListener("submit", async e => {
  e.preventDefault();

  const items = [...state.cart.values()];
  if (!items.length) return showToast("Keranjang kosong", true);

  const payload = {
    cashierId: state.cashierId,
    items: items.map(i => ({
      productId: i.id,
      quantity: i.quantity
    })),
    paidAmount: Number(els.paid.value || 0),
    paymentMethod: els.method.value
  };

  const data = await api("/api/transactions", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  window.open(
    `http://localhost:3000/api/transactions/receipt/${data.transaction.id}`,
    "_blank"
  );

  state.cart.clear();
  els.paid.value = "";

  await loadProducts();
  await loadHistory();
  renderCart();
});



loadProducts();
loadHistory();
loadSalesChart();
renderCart();