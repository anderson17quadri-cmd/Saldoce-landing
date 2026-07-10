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

  /* ---- Enviar ---- */
  document.getElementById("sendBtn").addEventListener("click", function (e) {
    e.preventDefault();
    var o = collect();
    if (isEmpty(o)) { alert("Escolha pelo menos um item (bolo, brigadeiros ou salgados) antes de enviar. 🧁"); return; }
    if (!o.contacto.nome) {
      var ok = confirm("Ainda não indicou o seu nome. Quer enviar mesmo assim?");
      if (!ok) { var n = document.getElementById("nome"); n.focus(); n.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    }
    var url = "https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(buildMessage(o));
    window.open(url, "_blank", "noopener");
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
