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

  /* 1b) Foto de capa (hero) — painel privado (localStorage) ou config */
  var heroImg = document.getElementById("heroImg");
  if (heroImg) {
    var chosen = null;
    try { chosen = localStorage.getItem("saldoce_hero"); } catch (e) {}
    var src = chosen || CFG.heroImage;
    if (src) heroImg.src = src;
  }

  /* 1c) Reel — slideshow automático */
  var reel = document.querySelector("[data-reel]");
  if (reel) {
    var slides = reel.querySelectorAll(".reel-slide");
    if (slides.length) {
      var ri = 0; slides[0].classList.add("active");
      if (!reduce && slides.length > 1) {
        setInterval(function () {
          slides[ri].classList.remove("active");
          ri = (ri + 1) % slides.length;
          slides[ri].classList.add("active");
        }, 2800);
      }
    }
  }

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
    var W = 1200, H = 96, base = 24;
    // gerador pseudo-aleatório determinístico
    var seed = 7;
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }

    // define os pingos ao longo da largura
    var drips = [], x = 10;
    while (x < W - 10) {
      var neck = 8 + rnd() * 9;            // meia-largura do "pescoço"
      var len = 20 + rnd() * 52;           // comprimento do pingo
      var gap = 26 + rnd() * 46;           // espaço até ao próximo
      drips.push({ cx: x + neck, neck: neck, len: len });
      x += neck * 2 + gap;
    }

    // caminho do chocolate: topo sólido + base com pingos pendurados
    var d = "M0,0 L0," + base + " ";
    var highlights = "";
    drips.forEach(function (dp) {
      var sX = dp.cx - dp.neck, eX = dp.cx + dp.neck;
      var tipY = base + dp.len, bulb = dp.neck * 1.45;
      d += "L" + sX.toFixed(1) + "," + base + " ";
      d += "C" + sX.toFixed(1) + "," + (base + dp.len * 0.5).toFixed(1) + " " + (dp.cx - bulb).toFixed(1) + "," + (tipY - bulb * 0.5).toFixed(1) + " " + dp.cx.toFixed(1) + "," + tipY.toFixed(1) + " ";
      d += "C" + (dp.cx + bulb).toFixed(1) + "," + (tipY - bulb * 0.5).toFixed(1) + " " + eX.toFixed(1) + "," + (base + dp.len * 0.5).toFixed(1) + " " + eX.toFixed(1) + "," + base + " ";
      // brilho especular no pingo (lado esquerdo)
      var hx = dp.cx - dp.neck * 0.35;
      highlights += '<path d="M' + hx.toFixed(1) + ',' + (base + 5).toFixed(1) +
        ' C' + (hx - 1).toFixed(1) + ',' + (base + dp.len * 0.5).toFixed(1) + ' ' + (dp.cx - 1).toFixed(1) + ',' + (tipY - bulb).toFixed(1) + ' ' + (dp.cx - 1).toFixed(1) + ',' + (tipY - dp.neck * 0.8).toFixed(1) +
        '" stroke="rgba(255,244,235,.28)" stroke-width="' + (dp.neck * 0.5).toFixed(1) + '" stroke-linecap="round" fill="none"/>';
    });
    d += "L" + W + "," + base + " L" + W + ",0 Z";

    el.innerHTML =
      '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
      '<linearGradient id="choco" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#7A5333"/><stop offset="0.26" stop-color="#55311C"/>' +
      '<stop offset="0.7" stop-color="#3A2011"/><stop offset="1" stop-color="#281506"/>' +
      '</linearGradient>' +
      '<linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="rgba(255,240,225,.5)"/><stop offset="1" stop-color="rgba(255,240,225,0)"/>' +
      '</linearGradient>' +
      '</defs>' +
      '<path d="' + d + '" fill="url(#choco)"/>' +
      '<rect x="0" y="0" width="' + W + '" height="10" fill="url(#gloss)"/>' +
      '<path d="M0,4.5 H' + W + '" stroke="rgba(255,246,238,.35)" stroke-width="2.5"/>' +
      highlights +
      '</svg>';

    // gotas que se soltam e caem
    if (reduce) return;
    drips.filter(function (dp) { return dp.len > 40; }).slice(0, 6).forEach(function (dp, k) {
      var b = document.createElement("span");
      b.className = "bead";
      b.style.left = (dp.cx / W * 100).toFixed(2) + "%";
      b.style.top = (dp.len + base - 6) + "px";
      b.style.animationDelay = (k * 0.5 + rnd()).toFixed(2) + "s";
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
