/* =========================================================
   SAL DOCE — script.js  (página principal)
   ========================================================= */
(function () {
  var CFG = window.SALDOCE || { whatsapp: "351000000000", instagram: "https://www.instagram.com/saldoce.pt" };

  /* 1) WhatsApp — monta links a partir do data-msg */
  document.querySelectorAll(".js-whatsapp").forEach(function (el) {
    var msg = el.getAttribute("data-msg") || "Olá Sal Doce!";
    el.setAttribute("href", "https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(msg));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
  /* Instagram placeholders */
  document.querySelectorAll('a[href="INSTAGRAM_URL"]').forEach(function (el) {
    el.setAttribute("href", CFG.instagram);
  });

  /* 2) Menu mobile */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* 3) Carrossel automático — duplica os itens para loop contínuo */
  document.querySelectorAll("[data-carousel]").forEach(function (track) {
    track.innerHTML += track.innerHTML;
  });

  /* 4) Chocolate a escorrer — gera SVG do drip */
  document.querySelectorAll("[data-drip]").forEach(function (el) { buildDrip(el); });

  function buildDrip(el) {
    var W = 1200, T = 20;
    var d = "M0,0 H" + W + " V" + T + " ";
    var x = 0;
    var i = 0;
    var depths = [16, 30, 12, 26, 20, 34, 14, 24, 18, 30, 12, 22];
    var widths = [110, 90, 130, 100, 120, 95, 115, 105, 125, 92, 118, 100];
    while (x < W) {
      var w = widths[i % widths.length];
      var dep = T + depths[i % depths.length];
      d += "C" + (x + w * 0.15) + "," + T + " " + (x + w * 0.35) + "," + dep + " " + (x + w * 0.5) + "," + dep + " ";
      d += "C" + (x + w * 0.65) + "," + dep + " " + (x + w * 0.85) + "," + T + " " + (x + w) + "," + T + " ";
      x += w; i++;
    }
    d += "H0 Z";

    // gotas suspensas animadas
    var drops = [
      { cx: 180, len: 26, cls: "drop" },
      { cx: 470, len: 34, cls: "drop d2" },
      { cx: 760, len: 22, cls: "drop d3" },
      { cx: 1010, len: 30, cls: "drop d4" }
    ];
    var dropSvg = drops.map(function (g) {
      var top = T + 6, b = top + g.len;
      var p = "M" + (g.cx - 6) + "," + top +
        " C" + (g.cx - 6) + "," + (top + g.len * 0.55) + " " + (g.cx - 3.5) + "," + b + " " + g.cx + "," + b +
        " C" + (g.cx + 3.5) + "," + b + " " + (g.cx + 6) + "," + (top + g.len * 0.55) + " " + (g.cx + 6) + "," + top + " Z";
      return '<path class="' + g.cls + '" d="' + p + '" fill="url(#choco)"/>' +
        '<circle class="' + g.cls + '" cx="' + g.cx + '" cy="' + b + '" r="4.5" fill="url(#choco)"/>';
    }).join("");

    el.innerHTML =
      '<svg viewBox="0 0 ' + W + ' 62" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="choco" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#5A3520"/><stop offset="0.5" stop-color="#4A2C1E"/><stop offset="1" stop-color="#3A2016"/>' +
      '</linearGradient></defs>' +
      '<path d="' + d + '" fill="url(#choco)"/>' +
      '<path d="M0,3 H' + W + '" stroke="rgba(255,255,255,.12)" stroke-width="3"/>' +
      dropSvg +
      '</svg>';
  }

  /* 5) Reveal on scroll */
  var els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !els.length) {
    els.forEach(function (e) { e.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* 6) Ano no rodapé */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
