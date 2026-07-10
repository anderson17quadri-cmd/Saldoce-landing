/* =========================================================
   SAL DOCE — admin.js  (painel privado, guarda no Supabase)
   ========================================================= */
(function () {
  var CFG = window.SALDOCE || {};
  var S = CFG.supabase || {};
  var BUCKET = S.bucket || "Photos";
  var CFGFILE = S.configFile || "site-config.json";

  /* ---------- Supabase Storage ---------- */
  function publicUrl(name) { return S.url + "/storage/v1/object/public/" + BUCKET + "/" + name; }
  function uploadBlob(name, blob, contentType) {
    return fetch(S.url + "/storage/v1/object/" + BUCKET + "/" + name, {
      method: "POST",
      headers: { "apikey": S.anonKey, "Authorization": "Bearer " + S.anonKey, "Content-Type": contentType, "x-upsert": "true" },
      body: blob
    }).then(function (r) { if (!r.ok) return r.text().then(function (t) { throw new Error("HTTP " + r.status + " " + t); }); return publicUrl(name); });
  }
  function dataURLtoBlob(d) {
    var parts = d.split(","), mime = parts[0].match(/:(.*?);/)[1], bin = atob(parts[1]);
    var arr = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }
  function uploadImage(dataUrl, prefix) {
    return uploadBlob(prefix + "-" + Date.now() + ".jpg", dataURLtoBlob(dataUrl), "image/jpeg");
  }
  function listRoot() {
    return fetch(S.url + "/storage/v1/object/list/" + BUCKET, {
      method: "POST",
      headers: { "apikey": S.anonKey, "Authorization": "Bearer " + S.anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ prefix: "", limit: 1000, sortBy: { column: "name", order: "desc" } })
    }).then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; });
  }
  function latestConfigName(list) {
    var cfgs = (list || []).map(function (o) { return o.name; })
      .filter(function (n) { return n.indexOf("site-config-") === 0 && /\.json$/.test(n); });
    cfgs.sort();
    return cfgs.length ? cfgs[cfgs.length - 1] : CFGFILE;
  }
  function loadRemoteConfig() {
    return listRoot().then(function (list) {
      return fetch(publicUrl(latestConfigName(list)) + "?t=" + Date.now(), { cache: "no-store" })
        .then(function (r) { return r.ok ? r.json() : null; });
    }).catch(function () { return null; });
  }
  function saveRemoteConfig(cfg) {
    // ficheiro novo com data (o anon pode criar, mas não sobrescrever)
    var name = "site-config-" + Date.now() + ".json";
    return uploadBlob(name, new Blob([JSON.stringify(cfg)], { type: "application/json" }), "application/json");
  }

  /* ---------- Redimensionar imagem do dispositivo ---------- */
  function resizeFile(file, cb) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var MAX = 1400;
        var scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
        var w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
        var c = document.createElement("canvas"); c.width = w; c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        cb(c.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
  function pickFile(cb) {
    var fi = document.createElement("input");
    fi.type = "file"; fi.accept = "image/*";
    fi.onchange = function () { var f = fi.files && fi.files[0]; if (f) resizeFile(f, cb); };
    fi.click();
  }

  /* ---------- Estado ---------- */
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
  var heroImage = CFG.heroImage || "assets/cake-berry.webp";
  var bolos = (CFG.bolos || []).map(function (b) { return { img: b.img, name: b.name }; });
  var busy = false;

  var grid = document.getElementById("grid");
  var snippet = document.getElementById("snippet");
  var upPreview = document.getElementById("upPreview");
  var editor = document.getElementById("bolosEditor");
  var statusEl = ensureStatus();

  function ensureStatus() {
    var el = document.getElementById("saveStatus");
    if (!el) { el = document.createElement("div"); el.id = "saveStatus"; el.style.cssText = "text-align:center;margin:14px auto 0;max-width:520px;font-weight:600;padding:10px 14px;border-radius:12px;display:none"; var host = document.querySelector(".admin"); if (host) host.appendChild(el); }
    return el;
  }
  function setStatus(t, ok) {
    statusEl.textContent = t; statusEl.style.display = "block";
    statusEl.style.color = ok ? "#127a63" : "#b02a5b";
    statusEl.style.background = ok ? "var(--menta-suave)" : "var(--rosa-suave)";
  }

  /* ---------- Render capa ---------- */
  function renderHero() {
    var isRemote = heroImage.indexOf("http") === 0;
    grid.innerHTML = LIB.map(function (l) {
      var sel = (l[0] === heroImage) ? " sel" : "";
      return '<div class="pick' + sel + '" data-src="' + l[0] + '"><img src="' + l[0] + '" alt=""><span class="tick">✓</span></div>';
    }).join("");
    if (isRemote) {
      upPreview.innerHTML = '<p style="margin-bottom:8px;color:var(--menta-forte);font-weight:500">✓ Foto do telemóvel escolhida</p><img src="' + heroImage + '" alt="">';
    } else { upPreview.innerHTML = ""; }
    if (snippet) snippet.style.display = "none";
  }
  grid.addEventListener("click", function (e) {
    var p = e.target.closest(".pick"); if (!p) return;
    heroImage = p.getAttribute("data-src"); renderHero();
  });

  /* ---------- Render editor de bolos ---------- */
  function renderEditor() {
    editor.innerHTML = bolos.map(function (b, i) {
      var isRemote = b.img.indexOf("http") === 0;
      var opts = LIB.map(function (l) { return '<option value="' + l[0] + '"' + (l[0] === b.img ? " selected" : "") + '>' + l[1] + '</option>'; }).join("");
      var custom = isRemote ? '<option value="__custom" selected>Foto do telemóvel ✓</option>' : "";
      return '<div class="bolo-edit">' +
        '<img class="be-thumb" src="' + b.img + '" alt="">' +
        '<div class="be-fields">' +
        '<input class="be-name input" data-i="' + i + '" value="' + String(b.name || "").replace(/"/g, "&quot;") + '" placeholder="Nome do bolo">' +
        '<select class="be-src input" data-i="' + i + '">' + custom + opts + '<option value="__upload">📷 Foto do telemóvel…</option></select>' +
        '</div></div>';
    }).join("");
  }
  editor.addEventListener("input", function (e) {
    if (e.target.classList.contains("be-name")) bolos[+e.target.getAttribute("data-i")].name = e.target.value;
  });
  editor.addEventListener("change", function (e) {
    var el = e.target; if (!el.classList.contains("be-src")) return;
    var i = +el.getAttribute("data-i");
    if (el.value === "__upload") {
      pickFile(function (dataUrl) {
        setStatus("A enviar foto…", true);
        uploadImage(dataUrl, "site-bolo" + i).then(function (url) {
          bolos[i].img = url; renderEditor(); setStatus("Foto enviada ✓ — não esqueça de Guardar.", true);
        }).catch(function (err) { console.error(err); setStatus("Erro ao enviar a foto. Tente outra.", false); renderEditor(); });
      });
    } else if (el.value !== "__custom") {
      bolos[i].img = el.value;
      var t = el.closest(".bolo-edit").querySelector(".be-thumb"); if (t) t.src = el.value;
    }
  });

  /* ---------- Upload de capa a partir do dispositivo ---------- */
  var fileInput = document.getElementById("fileInput");
  if (fileInput) {
    fileInput.addEventListener("change", function () {
      var f = fileInput.files && fileInput.files[0]; if (!f) return;
      resizeFile(f, function (dataUrl) {
        setStatus("A enviar foto de capa…", true);
        uploadImage(dataUrl, "site-hero").then(function (url) {
          heroImage = url; renderHero(); setStatus("Foto de capa enviada ✓ — carregue em Guardar.", true);
          upPreview.scrollIntoView({ behavior: "smooth", block: "center" });
        }).catch(function (err) { console.error(err); setStatus("Erro ao enviar a foto de capa.", false); });
      });
    });
  }
  var dlBtn = document.getElementById("dlBtn"); if (dlBtn) dlBtn.style.display = "none";

  /* ---------- GUARDAR TUDO (para todos) ---------- */
  function saveAll() {
    if (busy) return;
    if (!S || !S.url) { setStatus("Supabase não configurado.", false); return; }
    busy = true; setStatus("💾 A guardar no site…", true);
    var cfg = { heroImage: heroImage, bolos: bolos, updatedAt: new Date().toISOString() };
    saveRemoteConfig(cfg).then(function () {
      setStatus("✅ Guardado! Todos os visitantes vão ver as alterações. (Atualize o site para confirmar.)", true);
    }).catch(function (err) {
      console.error(err); setStatus("⚠️ Erro ao guardar: " + err.message, false);
    }).then(function () { busy = false; });
  }
  var saveBtns = [document.getElementById("bolosSave")];
  saveBtns.forEach(function (btn) { if (btn) { btn.textContent = "💾 Guardar tudo no site"; btn.addEventListener("click", saveAll); } });

  /* ---------- Repor ---------- */
  var resetHero = document.getElementById("resetBtn");
  if (resetHero) resetHero.addEventListener("click", function () { heroImage = CFG.heroImage || "assets/cake-berry.webp"; renderHero(); setStatus("Capa reposta (por guardar).", true); });
  var resetBolos = document.getElementById("bolosReset");
  if (resetBolos) resetBolos.addEventListener("click", function () { bolos = (CFG.bolos || []).map(function (b) { return { img: b.img, name: b.name }; }); renderEditor(); setStatus("Bolos repostos (por guardar).", true); });

  /* ---------- Arranque: carrega config guardada ---------- */
  renderHero(); renderEditor();
  loadRemoteConfig().then(function (cfg) {
    if (cfg) {
      if (cfg.heroImage) heroImage = cfg.heroImage;
      if (cfg.bolos && cfg.bolos.length) bolos = cfg.bolos.map(function (b) { return { img: b.img, name: b.name }; });
      renderHero(); renderEditor();
    }
  });
})();
