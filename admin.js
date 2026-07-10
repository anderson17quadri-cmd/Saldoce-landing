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

  render();
})();
