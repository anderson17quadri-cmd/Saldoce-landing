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

  /* 1b) Conteúdo editável (capa + bolos) — guardado no Supabase pelo painel */
  var heroImg = document.getElementById("heroImg");
  var bolosBox = document.querySelector("[data-bolos]");
  function escapeHtml(s) { return String(s).replace(/[&<>"]/g, function (m) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]; }); }
  function applyHero(src) { if (heroImg && src) heroImg.src = src; }
  function applyBolos(bolos) {
    if (!bolosBox || !bolos || !bolos.length) return;
    bolosBox.innerHTML = bolos.map(function (b, i) {
      var mc = (i % 2 === 1) ? " menta" : "";
      var nm = escapeHtml(b.name || "");
      return '<figure class="bolo"><img src="' + b.img + '" alt="' + nm + '" loading="lazy">' +
        '<figcaption class="bolo-tag' + mc + '">' + nm + '</figcaption></figure>';
    }).join("");
  }
  // 1) valores predefinidos (config.js)
  applyHero(CFG.heroImage);
  applyBolos(CFG.bolos);
  // 2) valores guardados no site (Supabase) — sobrepõem, para todos os visitantes
  var _s = CFG.supabase;
  if (_s && _s.url) {
    var _base = _s.url + "/storage/v1/object", _bucket = _s.bucket || "Photos";
    fetch(_base + "/list/" + _bucket, {
      method: "POST",
      headers: { "apikey": _s.anonKey, "Authorization": "Bearer " + _s.anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ prefix: "", limit: 1000, sortBy: { column: "name", order: "desc" } })
    }).then(function (r) { return r.ok ? r.json() : []; }).then(function (list) {
      var cfgs = (list || []).map(function (o) { return o.name; })
        .filter(function (n) { return n.indexOf("site-config-") === 0 && /\.json$/.test(n); });
      cfgs.sort();
      var name = cfgs.length ? cfgs[cfgs.length - 1] : (_s.configFile || "site-config.json");
      return fetch(_base + "/public/" + _bucket + "/" + name + "?t=" + Date.now(), { cache: "no-store" })
        .then(function (r) { return r.ok ? r.json() : null; });
    }).then(function (cfg) {
      if (cfg) { if (cfg.heroImage) applyHero(cfg.heroImage); if (cfg.bolos && cfg.bolos.length) applyBolos(cfg.bolos); }
    }).catch(function () {});
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
    var html = "";
    for (var i = 0; i < 32; i++) {
      var s = 4 + Math.random() * 7;
      html += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (Math.random() * 100).toFixed(1) +
        '%;width:' + s.toFixed(1) + 'px;height:' + s.toFixed(1) + 'px;animation-delay:' + (Math.random() * 3).toFixed(2) +
        's;animation-duration:' + (2.2 + Math.random() * 2.6).toFixed(2) + 's"></i>';
    }
    sp.innerHTML = html;
  }

  /* 6) Ingredientes a flutuar (ambiente, atrás do texto) */
  var flBox = document.querySelector("[data-floaties]");
  if (flBox) {
    var EMO = ["🍓", "🍫", "🧁", "✨", "🎀", "🍰", "🫐", "🍒", "⭐", "🍮", "🌸", "🍓"];
    // [top%, left%] espalhados; ficam por trás do texto (z-index), logo nunca tapam a leitura
    var SPOTS = [[7, 6], [10, 84], [24, 20], [22, 66], [40, 4], [44, 90], [58, 30], [62, 74], [78, 12], [80, 58], [88, 40], [90, 88]];
    var frag = "";
    SPOTS.forEach(function (pos, i) {
      var size = (1.4 + Math.random() * 1.5).toFixed(2);
      var dur = (7 + Math.random() * 6).toFixed(1);
      var dl = (Math.random() * 3).toFixed(2);
      var op = (0.5 + Math.random() * 0.4).toFixed(2);
      frag += '<span class="fl" style="top:' + pos[0] + '%;left:' + pos[1] + '%;font-size:' + size + 'rem;opacity:' + op + ';--dur:' + dur + 's;--dl:' + dl + 's">' + EMO[i % EMO.length] + '</span>';
    });
    flBox.innerHTML = frag;
  }

  /* 7) Reação ao toque — brilhos, ondas e ingredientes que reagem */
  if (!reduce) {
    var BURST = ["✨", "💕", "🍓", "🌸", "⭐", "🧁", "🎀"];
    function sparkleBurst(x, y) {
      for (var i = 0; i < 7; i++) {
        var el = document.createElement("span");
        el.className = "tap-burst";
        el.textContent = BURST[(Math.random() * BURST.length) | 0];
        el.style.left = x + "px"; el.style.top = y + "px";
        var ang = Math.random() * Math.PI * 2, dist = 26 + Math.random() * 46;
        el.style.setProperty("--bx", (Math.cos(ang) * dist).toFixed(0) + "px");
        el.style.setProperty("--by", (Math.sin(ang) * dist - 22).toFixed(0) + "px");
        el.style.setProperty("--br", ((Math.random() * 200 - 100) | 0) + "deg");
        document.body.appendChild(el);
        (function (n) { setTimeout(function () { n.remove(); }, 820); })(el);
      }
    }
    function addRipple(x, y, el) {
      var r = el.getBoundingClientRect();
      var d = Math.max(r.width, r.height) * 1.25;
      var s = document.createElement("span");
      s.className = "ripple";
      s.style.width = s.style.height = d + "px";
      s.style.left = (x - r.left) + "px";
      s.style.top = (y - r.top) + "px";
      el.appendChild(s);
      (function (n) { setTimeout(function () { n.remove(); }, 620); })(s);
    }
    // ondas imediatas ao pressionar elementos interativos
    document.addEventListener("pointerdown", function (e) {
      var el = e.target.closest(".btn, .card, .bolo, .g-item, .feature, .strip-item");
      if (el) addRipple(e.clientX, e.clientY, el);
      var f = e.target.closest(".fl");
      if (f) { f.classList.remove("pop"); void f.offsetWidth; f.classList.add("pop"); sparkleBurst(e.clientX, e.clientY); }
    }, { passive: true });
    // brilhos ao clicar/tocar (sem spam durante o scroll)
    document.addEventListener("click", function (e) {
      if (e.target.closest("input, textarea, select")) return;
      sparkleBurst(e.clientX, e.clientY);
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
