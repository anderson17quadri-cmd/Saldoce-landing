/* =========================================================
   SAL DOCE — admin.js  (painel privado da foto de capa)
   ========================================================= */
(function () {
  var CFG = window.SALDOCE || { heroImage: "assets/cake-berry.webp" };

  // Fotos disponíveis para capa
  var PHOTOS = [
    "assets/cake-berry.webp",
    "assets/cake-hero.jpg",
    "assets/cake-butterfly.webp",
    "assets/cake-redbow.webp",
    "assets/cake-white.webp",
    "assets/kitkat.webp",
    "assets/g1-brigadeiros.webp",
    "assets/morango.webp",
    "assets/brig-box.webp",
    "assets/box-mae.webp"
  ];

  var grid = document.getElementById("grid");
  var snippet = document.getElementById("snippet");
  var upPreview = document.getElementById("upPreview");
  var dlBtn = document.getElementById("dlBtn");
  var lastUpload = null;

  function current() {
    var v = null;
    try { v = localStorage.getItem("saldoce_hero"); } catch (e) {}
    return v || CFG.heroImage || PHOTOS[0];
  }

  function render() {
    var cur = current();
    var isData = cur.indexOf("data:") === 0;
    grid.innerHTML = PHOTOS.map(function (src) {
      var sel = (!isData && src === cur) ? " sel" : "";
      return '<div class="pick' + sel + '" data-src="' + src + '">' +
        '<img src="' + src + '" alt="">' +
        '<span class="tick">✓</span></div>';
    }).join("");
    // pré-visualização da foto do dispositivo
    if (isData) {
      upPreview.innerHTML = '<p style="margin-bottom:8px;color:var(--menta-forte);font-weight:500">✓ A sua foto está como capa (neste dispositivo)</p><img src="' + cur + '" alt="">';
      dlBtn.hidden = false; lastUpload = cur;
      snippet.textContent = '// Foto do dispositivo — guarde-a (botão acima), ponha em assets/ e use:\nheroImage: "assets/capa.jpg",';
    } else {
      snippet.textContent = 'heroImage: "' + cur + '",';
    }
  }

  /* ---- Upload de foto do dispositivo (redimensiona e guarda) ---- */
  var fileInput = document.getElementById("fileInput");
  if (fileInput) {
    fileInput.addEventListener("change", function () {
      var f = fileInput.files && fileInput.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        var img = new Image();
        img.onload = function () {
          var MAX = 1400;
          var scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
          var w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
          var c = document.createElement("canvas"); c.width = w; c.height = h;
          c.getContext("2d").drawImage(img, 0, 0, w, h);
          var dataUrl = c.toDataURL("image/jpeg", 0.85);
          try { localStorage.setItem("saldoce_hero", dataUrl); }
          catch (e) { alert("A foto é grande demais para guardar no telemóvel. Tente uma foto mais pequena."); return; }
          render();
          upPreview.scrollIntoView({ behavior: "smooth", block: "center" });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(f);
    });
  }
  if (dlBtn) {
    dlBtn.addEventListener("click", function () {
      if (!lastUpload) return;
      var a = document.createElement("a");
      a.href = lastUpload; a.download = "capa.jpg";
      document.body.appendChild(a); a.click(); a.remove();
    });
  }

  grid.addEventListener("click", function (e) {
    var p = e.target.closest(".pick");
    if (!p) return;
    try { localStorage.setItem("saldoce_hero", p.getAttribute("data-src")); } catch (e) {}
    render();
  });

  document.getElementById("resetBtn").addEventListener("click", function () {
    try { localStorage.removeItem("saldoce_hero"); } catch (e) {}
    render();
  });

  /* ---- Redimensionar imagem do dispositivo ---- */
  function resizeFile(file, cb) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var MAX = 1200;
        var scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
        var w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
        var c = document.createElement("canvas"); c.width = w; c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        cb(c.toDataURL("image/jpeg", 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  /* ---- Editor dos bolos em destaque ---- */
  var LIB = [
    ["assets/cake-berry.webp", "Frutos vermelhos"],
    ["assets/cake-hero.jpg", "Rosa & dourado"],
    ["assets/cake-butterfly.webp", "Borboletas"],
    ["assets/cake-redbow.webp", "Chocolate c/ laço"],
    ["assets/cake-white.webp", "Branco aniversário"],
    ["assets/kitkat.webp", "Ovo de colher"],
    ["assets/g1-brigadeiros.webp", "Brigadeiros"],
    ["assets/morango.webp", "Morango do amor"],
    ["assets/brig-box.webp", "Caixa brigadeiros"],
    ["assets/box-mae.webp", "Box presente"]
  ];
  var editor = document.getElementById("bolosEditor");
  var bolosState = [];
  function loadBolos() {
    var b = null;
    try { b = JSON.parse(localStorage.getItem("saldoce_bolos")); } catch (e) {}
    if (!b || !b.length) b = (CFG.bolos || []).map(function (x) { return { img: x.img, name: x.name }; });
    return b;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/"/g, "&quot;"); }
  function renderEditor() {
    editor.innerHTML = bolosState.map(function (b, i) {
      var isData = b.img.indexOf("data:") === 0;
      var opts = LIB.map(function (l) {
        return '<option value="' + l[0] + '"' + (l[0] === b.img ? " selected" : "") + '>' + l[1] + '</option>';
      }).join("");
      var custom = isData ? '<option value="__custom" selected>Foto do telemóvel ✓</option>' : "";
      return '<div class="bolo-edit">' +
        '<img class="be-thumb" src="' + b.img + '" alt="">' +
        '<div class="be-fields">' +
        '<input class="be-name input" data-i="' + i + '" value="' + esc(b.name) + '" placeholder="Nome do bolo">' +
        '<select class="be-src input" data-i="' + i + '">' + custom + opts + '<option value="__upload">📷 Foto do telemóvel…</option></select>' +
        '</div></div>';
    }).join("");
  }
  if (editor) {
    bolosState = loadBolos();
    renderEditor();
    editor.addEventListener("input", function (e) {
      if (e.target.classList.contains("be-name")) bolosState[+e.target.getAttribute("data-i")].name = e.target.value;
    });
    editor.addEventListener("change", function (e) {
      var el = e.target;
      if (!el.classList.contains("be-src")) return;
      var i = +el.getAttribute("data-i");
      if (el.value === "__upload") {
        var fi = document.createElement("input");
        fi.type = "file"; fi.accept = "image/*";
        fi.onchange = function () {
          var f = fi.files && fi.files[0];
          if (!f) { renderEditor(); return; }
          resizeFile(f, function (data) { bolosState[i].img = data; renderEditor(); });
        };
        fi.click();
      } else if (el.value !== "__custom") {
        bolosState[i].img = el.value;
        var thumb = el.closest(".bolo-edit").querySelector(".be-thumb");
        if (thumb) thumb.src = el.value;
      }
    });
    document.getElementById("bolosSave").addEventListener("click", function () {
      try { localStorage.setItem("saldoce_bolos", JSON.stringify(bolosState)); }
      catch (e) { alert("Sem espaço para guardar. Use menos fotos do telemóvel (as da biblioteca não ocupam espaço)."); return; }
      var lines = bolosState.map(function (b) {
        var img = b.img.indexOf("data:") === 0 ? "assets/SUA-FOTO.jpg" : b.img;
        return '    { img: "' + img + '", name: "' + String(b.name || "").replace(/"/g, '\\"') + '" }';
      });
      var snip = document.getElementById("bolosSnippet");
      snip.style.display = "block";
      snip.textContent = "bolos: [\n" + lines.join(",\n") + "\n  ],";
      alert("✅ Bolos guardados neste dispositivo! Abra o site para ver.");
    });
    document.getElementById("bolosReset").addEventListener("click", function () {
      try { localStorage.removeItem("saldoce_bolos"); } catch (e) {}
      bolosState = loadBolos(); renderEditor();
      document.getElementById("bolosSnippet").style.display = "none";
    });
  }

  render();
})();
