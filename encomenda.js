/* =========================================================
   SAL DOCE — encomenda.js  (construtor de pedido)
   ========================================================= */
(function () {
  var CFG = window.SALDOCE || { whatsapp: "351000000000", instagram: "https://www.instagram.com/saldoce.pt" };

  var BRIGADEIROS = ["Tradicional", "Beijinho", "Morango", "Ninho", "Churros", "Sensação",
    "Sedução", "Casadinho", "Prestígio", "Oreo", "Napolitano", "Café"];

  var SALGADOS = ["Coxinha", "Rissol de carne", "Rissol misto", "Bolinha de queijo",
    "Pastel de frango", "Pastel de carne", "Pastel de pizza (misto)",
    "Enroladinho de salsicha", "Pastel de bacalhau"];

  /* ---- Construir linhas de quantidade ---- */
  function buildQtyRows(groupSel, items, unit) {
    var box = document.querySelector('[data-qtygroup="' + groupSel + '"]');
    if (!box) return;
    box.innerHTML = items.map(function (name) {
      return '' +
        '<div class="qty-row" data-cat="' + groupSel + '" data-name="' + name + '">' +
          '<div class="qn">' + name + '<small>' + unit + '</small></div>' +
          '<div class="stepper">' +
            '<button type="button" data-step="-1" aria-label="Menos">–</button>' +
            '<input type="number" inputmode="numeric" min="0" value="0" data-qty>' +
            '<button type="button" data-step="1" aria-label="Mais">+</button>' +
          '</div>' +
        '</div>';
    }).join("");
  }
  buildQtyRows("brigadeiro", BRIGADEIROS, "dúzia(s)");
  buildQtyRows("salgado", SALGADOS, "unidades");

  /* ---- Steppers ---- */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-step]");
    if (!btn) return;
    var input = btn.parentNode.querySelector("[data-qty]");
    var v = parseInt(input.value, 10) || 0;
    v = Math.max(0, v + parseInt(btn.getAttribute("data-step"), 10));
    input.value = v;
    render();
  });

  /* ---- Abrir/fechar blocos ---- */
  document.querySelectorAll("[data-toggle]").forEach(function (h) {
    h.addEventListener("click", function () {
      h.parentNode.classList.toggle("open");
    });
  });

  /* ---- Recalcular resumo em qualquer mudança ---- */
  document.addEventListener("change", render);
  document.addEventListener("input", function (e) {
    if (e.target.matches("[data-qty], #decoracao, #obs, #nome")) render();
  });

  /* ---- Recolher dados ---- */
  function collect() {
    var o = { bolo: {}, brigadeiros: [], salgados: [], contacto: {} };

    var massa = document.querySelector('input[name="massa"]:checked');
    o.bolo.massa = massa ? massa.value : "";
    o.bolo.recheios = Array.prototype.map.call(document.querySelectorAll('input[name="recheio"]:checked'), function (i) { return i.value; });
    o.bolo.adicionais = Array.prototype.map.call(document.querySelectorAll('input[name="adicional"]:checked'), function (i) { return i.value; });
    o.bolo.tamanho = val("tamanho");
    o.bolo.data = val("data");
    o.bolo.decoracao = val("decoracao").trim();
    o.bolo.tem = !!(o.bolo.massa || o.bolo.recheios.length || o.bolo.tamanho || o.bolo.decoracao);

    document.querySelectorAll('.qty-row[data-cat="brigadeiro"]').forEach(function (r) {
      var q = parseInt(r.querySelector("[data-qty]").value, 10) || 0;
      if (q > 0) o.brigadeiros.push({ name: r.getAttribute("data-name"), qty: q });
    });
    document.querySelectorAll('.qty-row[data-cat="salgado"]').forEach(function (r) {
      var q = parseInt(r.querySelector("[data-qty]").value, 10) || 0;
      if (q > 0) o.salgados.push({ name: r.getAttribute("data-name"), qty: q });
    });

    o.contacto.nome = val("nome").trim();
    o.contacto.telefone = val("telefone").trim();
    o.contacto.entrega = val("entrega");
    o.contacto.obs = val("obs").trim();
    return o;
  }
  function val(id) { var el = document.getElementById(id); return el ? el.value : ""; }

  function isEmpty(o) {
    return !o.bolo.tem && o.brigadeiros.length === 0 && o.salgados.length === 0;
  }

  /* ---- Formatar data pt-PT ---- */
  function fmtDate(iso) {
    if (!iso) return "";
    var p = iso.split("-");
    return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : iso;
  }

  /* ---- Render do resumo ---- */
  function render() {
    var o = collect();
    var box = document.getElementById("sumBody");
    var btn = document.getElementById("sendBtn");

    if (isEmpty(o)) {
      box.innerHTML = '<p class="sum-empty">Ainda não escolheu nada. Comece pelo bolo, brigadeiros ou salgados. 🧁</p>';
      btn.setAttribute("aria-disabled", "true");
      btn.style.opacity = ".55";
      btn.style.pointerEvents = "none";
      return;
    }
    btn.setAttribute("aria-disabled", "false");
    btn.style.opacity = "1";
    btn.style.pointerEvents = "auto";

    var html = "";

    if (o.bolo.tem) {
      var b = [];
      if (o.bolo.massa) b.push("Massa: " + o.bolo.massa);
      if (o.bolo.recheios.length) b.push("Recheio: " + o.bolo.recheios.join(", "));
      if (o.bolo.adicionais.length) b.push("Adicionais: " + o.bolo.adicionais.join(", "));
      if (o.bolo.tamanho) b.push("Tamanho: " + o.bolo.tamanho);
      if (o.bolo.data) b.push("Data: " + fmtDate(o.bolo.data));
      if (o.bolo.decoracao) b.push("Decoração: " + o.bolo.decoracao);
      html += sec("🎂 Bolo", b);
    }
    if (o.brigadeiros.length) {
      html += sec("🍫 Brigadeiros", o.brigadeiros.map(function (i) { return i.name + " × " + i.qty + " dúzia(s)"; }));
    }
    if (o.salgados.length) {
      html += sec("🥟 Salgados", o.salgados.map(function (i) { return i.name + " × " + i.qty + " unid."; }));
    }
    var c = [];
    if (o.contacto.entrega) c.push(o.contacto.entrega);
    if (o.contacto.obs) c.push("Obs.: " + o.contacto.obs);
    if (c.length) html += sec("📋 Detalhes", c);

    box.innerHTML = html;
  }
  function sec(title, items) {
    return '<div class="sum-sec"><h4>' + title + '</h4><ul>' +
      items.map(function (t) { return "<li>" + escapeHtml(t) + "</li>"; }).join("") + "</ul></div>";
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>]/g, function (m) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m]; });
  }

  /* ---- Montar mensagem de WhatsApp ---- */
  function buildMessage(o) {
    var L = [];
    L.push("🧁 *NOVA ENCOMENDA — Sal Doce*");
    L.push("");
    if (o.contacto.nome) L.push("👤 *Nome:* " + o.contacto.nome);
    if (o.bolo.data) L.push("📅 *Data:* " + fmtDate(o.bolo.data));
    if (o.contacto.entrega) L.push("📍 *" + o.contacto.entrega + "*");
    if (o.contacto.nome || o.bolo.data || o.contacto.entrega) L.push("");

    if (o.bolo.tem) {
      L.push("🎂 *BOLO*");
      if (o.bolo.massa) L.push("• Massa: " + o.bolo.massa);
      if (o.bolo.recheios.length) L.push("• Recheio(s): " + o.bolo.recheios.join(", "));
      if (o.bolo.adicionais.length) L.push("• Adicionais: " + o.bolo.adicionais.join(", "));
      if (o.bolo.tamanho) L.push("• Tamanho: " + o.bolo.tamanho);
      if (o.bolo.decoracao) L.push("• Decoração: " + o.bolo.decoracao);
      L.push("");
    }
    if (o.brigadeiros.length) {
      L.push("🍫 *BRIGADEIROS*");
      o.brigadeiros.forEach(function (i) { L.push("• " + i.name + " — " + i.qty + " dúzia(s)"); });
      L.push("");
    }
    if (o.salgados.length) {
      L.push("🥟 *SALGADOS*");
      o.salgados.forEach(function (i) { L.push("• " + i.name + " — " + i.qty + " unid."); });
      L.push("");
    }
    if (o.contacto.obs) { L.push("📝 *Observações:* " + o.contacto.obs); L.push(""); }

    if (o.bolo.tem && o.bolo.decoracao) L.push("📷 Vou enviar foto de referência da decoração.");
    L.push("Aguardo confirmação de disponibilidade e orçamento. Obrigada! 💕");
    return L.join("\n");
  }

  /* ---- Mapeamento para a base de dados da app (Supabase) ---- */
  var BRIG_KEY = { "Tradicional": "tradicional", "Beijinho": "beijinho", "Morango": "morango", "Ninho": "ninho", "Churros": "churros", "Sensação": "sensacao", "Sedução": "seducao", "Casadinho": "casadinho", "Prestígio": "prestigio", "Oreo": "oreo", "Napolitano": "napolitano", "Café": "cafe" };
  var SALG_KEY = { "Coxinha": "coxinha", "Rissol de carne": "rissoisCarne", "Rissol misto": "rissoisMistos", "Bolinha de queijo": "bolinhasQueijo", "Pastel de frango": "pastelFrango", "Pastel de carne": "pastelCarne", "Pastel de pizza (misto)": "pastelPizza", "Enroladinho de salsicha": "enroladinho", "Pastel de bacalhau": "pastelBacalhau" };

  function parseWeight(t) { if (!t) return 0; var m = String(t).replace(",", ".").match(/[\d.]+/); return m ? parseFloat(m[0]) : 0; }
  function genId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16); });
  }
  function buildRow(o) {
    var brig = {}, salg = {};
    o.brigadeiros.forEach(function (i) { var k = BRIG_KEY[i.name]; if (k) brig[k] = i.qty; });
    o.salgados.forEach(function (i) { var k = SALG_KEY[i.name]; if (k) salg[k] = i.qty; });
    var otype = o.bolo.tem ? "bolo" : (o.brigadeiros.length ? "brigadeiros" : (o.salgados.length ? "salgados" : "bolo"));
    var notes = [];
    if (o.bolo.adicionais.length) notes.push("Adicionais: " + o.bolo.adicionais.join(", "));
    if (o.bolo.decoracao) notes.push("Decoração: " + o.bolo.decoracao);
    if (o.contacto.entrega) notes.push(o.contacto.entrega);
    if (o.contacto.obs) notes.push("Obs: " + o.contacto.obs);
    notes.push("(via Site)");
    var now = new Date().toISOString();
    return {
      id: genId(),
      client_name: o.contacto.nome || "Cliente (site)",
      client_phone: o.contacto.telefone || null,
      delivery_date: o.bolo.data,
      order_type: otype,
      cake_type: o.bolo.massa || "",
      filling: o.bolo.recheios.join(", "),
      weight_kg: parseWeight(o.bolo.tamanho),
      topper: null, hostia: null, especial: null,
      salgados: salg, brigadeiros: brig,
      price: 0, photo_uri: null,
      source_channel: (CFG.supabase && CFG.supabase.sourceChannel) || "Site",
      delivery_time: null,
      notes: notes.join(" | "),
      status: "pending",
      created_at: now, updated_at: now
    };
  }
  function sendToSupabase(row) {
    var s = CFG.supabase;
    if (!s || !s.enabled) return Promise.resolve({ skipped: true });
    return fetch(s.url + "/rest/v1/" + (s.table || "orders"), {
      method: "POST",
      headers: { "apikey": s.anonKey, "Authorization": "Bearer " + s.anonKey, "Content-Type": "application/json", "Prefer": "return=minimal" },
      body: JSON.stringify(row)
    }).then(function (r) {
      if (!r.ok) return r.text().then(function (t) { throw new Error("HTTP " + r.status + " " + t); });
      return { ok: true };
    });
  }
  function setHint(t, ok) {
    var h = document.getElementById("sendHint");
    if (!h) return;
    h.textContent = t;
    h.style.color = ok ? "#127a63" : "#b02a5b";
    h.style.fontWeight = "600";
    h.style.background = ok ? "var(--menta-suave)" : "var(--rosa-suave)";
    h.style.padding = "10px 12px";
    h.style.borderRadius = "12px";
    h.style.marginTop = "10px";
  }

  /* ---- Enviar ---- */
  var sendBtn = document.getElementById("sendBtn");
  var sending = false;
  sendBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (sending) return;
    var o = collect();
    if (isEmpty(o)) { alert("Escolha pelo menos um item (bolo, brigadeiros ou salgados) antes de enviar. 🧁"); return; }
    if (!o.contacto.nome) { var n = document.getElementById("nome"); n.focus(); n.scrollIntoView({ behavior: "smooth", block: "center" }); alert("Indique o seu nome para enviarmos a encomenda. 🙂"); return; }
    var supaOn = !!(CFG.supabase && CFG.supabase.enabled);
    if (supaOn && !o.bolo.data) { var d = document.getElementById("data"); d.focus(); d.scrollIntoView({ behavior: "smooth", block: "center" }); alert("Escolha a data pretendida para registarmos a encomenda. 📅"); return; }

    var waUrl = "https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(buildMessage(o));
    var alsoWA = !supaOn || (CFG.supabase.alsoWhatsApp !== false);
    var waWin = alsoWA ? window.open("", "_blank") : null; // abre já (gesto do utilizador)

    var orig = sendBtn.innerHTML;
    sending = true; sendBtn.style.opacity = ".7"; sendBtn.style.pointerEvents = "none";
    sendBtn.innerHTML = '<span class="wa-icon" aria-hidden="true">⏳</span> A enviar…';

    var task = supaOn ? sendToSupabase(buildRow(o)) : Promise.resolve({ skipped: true });
    task.then(function () {
      setHint(supaOn ? "✅ Encomenda registada! A abrir o WhatsApp para confirmar…" : "A abrir o WhatsApp…", true);
      if (waWin) waWin.location = waUrl; else if (alsoWA) window.location.href = waUrl;
    }).catch(function (err) {
      console.error("Supabase:", err);
      setHint("⚠️ Registo automático falhou — seguimos pelo WhatsApp.", false);
      if (waWin) waWin.location = waUrl; else window.location.href = waUrl;
    }).then(function () {
      sending = false; sendBtn.style.opacity = "1"; sendBtn.style.pointerEvents = "auto"; sendBtn.innerHTML = orig;
    });
  });

  /* ---- Menu mobile ---- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---- Data mínima = hoje ---- */
  var dEl = document.getElementById("data");
  if (dEl) dEl.min = new Date().toISOString().split("T")[0];

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  render();
})();
