/* =========================================================
   SAL DOCE — script.js  (página principal)
   ========================================================= */
(function () {
  var CFG = window.SALDOCE || { whatsapp: "351000000000", instagram: "https://www.instagram.com/saldoce.pt" };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1) WhatsApp */
  document.querySelectorAll(".js-whatsapp").forEach(function (el) {
    var msg = el.getAttribute("data-msg") || "Olá Sal Doce!";
    el.setAttribute("href", "https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(msg));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
  document.querySelectorAll('a[href="INSTAGRAM_URL"]').forEach(function (el) {
    el.setAttribute("href", CFG.instagram);
  });

  /* 2) Abertura mágica — remove o overlay após a animação */
  var intro = document.querySelector("[data-intro]");
  if (intro) {
    if (reduce) { intro.classList.add("done"); }
    else { setTimeout(function () { intro.classList.add("done"); }, 2700); }
  }

  /* 3) Menu mobile */
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

  /* 4) Carrossel automático */
  document.querySelectorAll("[data-carousel]").forEach(function (track) {
    track.innerHTML += track.innerHTML;
  });

  /* 5) Partículas cintilantes no hero */
  var sp = document.querySelector("[data-sparkles]");
  if (sp && !reduce) {
    var N = 22;
    var html = "";
    for (var i = 0; i < N; i++) {
      var x = Math.random() * 100, y = Math.random() * 100;
      var s = 3 + Math.random() * 5;
      var del = (Math.random() * 3).toFixed(2), dur = (2.4 + Math.random() * 2.4).toFixed(2);
      html += '<i style="left:' + x.toFixed(1) + '%;top:' + y.toFixed(1) + '%;width:' + s.toFixed(1) + 'px;height:' + s.toFixed(1) + 'px;animation-delay:' + del + 's;animation-duration:' + dur + 's"></i>';
    }
    sp.innerHTML = html;
  }

  /* 6) Chocolate a escorrer */
  document.querySelectorAll("[data-drip]").forEach(function (el) { buildDrip(el); });

  function buildDrip(el) {
    var W = 1200, T = 18;
    // barra com base ondulada (chocolate derretido)
    var d = "M0,0 H" + W + " V" + T + " ";
    var x = 0, i = 0;
    var depths = [14, 26, 10, 22, 18, 30, 12, 22, 16, 26, 12, 20];
    var widths = [110, 90, 130, 100, 120, 95, 115, 105, 125, 92, 118, 100];
    while (x < W) {
      var w = widths[i % widths.length];
      var dep = T + depths[i % depths.length];
      d += "C" + (x + w * 0.15) + "," + T + " " + (x + w * 0.35) + "," + dep + " " + (x + w * 0.5) + "," + dep + " ";
      d += "C" + (x + w * 0.65) + "," + dep + " " + (x + w * 0.85) + "," + T + " " + (x + w) + "," + T + " ";
      x += w; i++;
    }
    d += "H0 Z";

    // estalactites (pingos suspensos que esticam)
    var stalX = [150, 360, 600, 830, 1050];
    var stals = stalX.map(function (cx, k) {
      var top = T - 2, len = 18 + (k % 3) * 6, b = top + len;
      var p = "M" + (cx - 7) + "," + top +
        " C" + (cx - 7) + "," + (top + len * 0.6) + " " + (cx - 4) + "," + b + " " + cx + "," + b +
        " C" + (cx + 4) + "," + b + " " + (cx + 7) + "," + (top + len * 0.6) + " " + (cx + 7) + "," + top + " Z";
      return '<path class="stal d' + (k + 1) + '" d="' + p + '" fill="url(#choco)"/>';
    }).join("");

    el.innerHTML =
      '<svg viewBox="0 0 ' + W + ' 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="choco" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#5A3520"/><stop offset="0.55" stop-color="#4A2C1E"/><stop offset="1" stop-color="#38200F"/>' +
      '</linearGradient></defs>' +
      '<path d="' + d + '" fill="url(#choco)"/>' +
      '<path d="M0,3 H' + W + '" stroke="rgba(255,255,255,.16)" stroke-width="3"/>' +
      stals + '</svg>';

    // gotas que caem (HTML sobreposto)
    if (reduce) return;
    var beads = [12, 30, 50, 69, 87];
    beads.forEach(function (leftPct, k) {
      var b = document.createElement("span");
      b.className = "bead";
      b.style.left = leftPct + "%";
      b.style.animationDelay = (k * 0.62).toFixed(2) + "s";
      el.appendChild(b);
    });
  }

  /* 7) Reveal on scroll (com escalonamento por secção) */
  var els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !els.length) {
    els.forEach(function (e) { e.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.classList.contains("reveal"); });
          var idx = sibs.indexOf(el);
          el.style.setProperty("--rd", (Math.max(0, idx) * 0.08).toFixed(2) + "s");
          el.classList.add("in");
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* 8) Parallax suave da camada de ingredientes */
  if (!reduce) {
    var floatLayer = document.querySelector(".floaties");
    if (floatLayer) {
      window.addEventListener("scroll", function () {
        var y = window.scrollY;
        if (y > window.innerHeight) return;
        floatLayer.style.transform = "translateY(" + (y * 0.12).toFixed(1) + "px)";
      }, { passive: true });
    }
  }

  /* 9) Ano no rodapé */
  var yy = document.getElementById("year");
  if (yy) yy.textContent = new Date().getFullYear();
})();
