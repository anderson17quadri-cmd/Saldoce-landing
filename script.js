/* =========================================================
   SALDOCE — Landing Page  •  script.js
   ========================================================= */

/* -------------------------------------------------------
   1) CONFIGURAÇÃO — EDITE AQUI
   ------------------------------------------------------- */
const SALDOCE = {
  // Número de WhatsApp em formato internacional, SÓ dígitos.
  // Ex.: Portugal +351 912 345 678  ->  "351912345678"
  whatsapp: "351000000000",   // <-- SUBSTITUA pelo número real

  // Link do Instagram
  instagram: "https://www.instagram.com/saldoce.pt",
};

/* -------------------------------------------------------
   2) WhatsApp — monta os links a partir do data-msg
   ------------------------------------------------------- */
(function initWhatsApp() {
  const links = document.querySelectorAll(".js-whatsapp");
  links.forEach((el) => {
    const msg = el.getAttribute("data-msg") || "Olá Saldoce!";
    const url =
      "https://wa.me/" + SALDOCE.whatsapp + "?text=" + encodeURIComponent(msg);
    el.setAttribute("href", url);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  // Substitui os placeholders do Instagram
  document.querySelectorAll('a[href="INSTAGRAM_URL"]').forEach((el) => {
    el.setAttribute("href", SALDOCE.instagram);
  });
})();

/* -------------------------------------------------------
   3) Menu mobile
   ------------------------------------------------------- */
(function initMenu() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
})();

/* -------------------------------------------------------
   4) Reveal on scroll
   ------------------------------------------------------- */
(function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !els.length) {
    els.forEach((e) => e.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el) => io.observe(el));
})();

/* -------------------------------------------------------
   5) Ano no rodapé
   ------------------------------------------------------- */
document.getElementById("year").textContent = new Date().getFullYear();
