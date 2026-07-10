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

  function current() {
    var v = null;
    try { v = localStorage.getItem("saldoce_hero"); } catch (e) {}
    return v || CFG.heroImage || PHOTOS[0];
  }

  function render() {
    var cur = current();
    grid.innerHTML = PHOTOS.map(function (src) {
      var sel = src === cur ? " sel" : "";
      return '<div class="pick' + sel + '" data-src="' + src + '">' +
        '<img src="' + src + '" alt="">' +
        '<span class="tick">✓</span></div>';
    }).join("");
    snippet.textContent = 'heroImage: "' + cur + '",';
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
