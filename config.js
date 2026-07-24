/* =========================================================
   SAL DOCE — Configuração partilhada
   Edite aqui o WhatsApp, o Instagram, a foto de capa e a base de dados.
   ========================================================= */
window.SALDOCE = {
  // WhatsApp em formato internacional, SÓ dígitos (351 = Portugal).
  whatsapp: "351934244718",              // Sal Doce (+351 934 244 718)
  instagram: "https://www.instagram.com/saldoce.pt",

  // Foto de capa (hero). Pode escolher no painel privado: admin.html
  heroImage: "assets/new-hero.jpg",

  // Bolos em destaque (secção "Bolos personalizados"). Editável no admin.html
  bolos: [
    { img: "assets/nb-berries.jpg", name: "Frutos vermelhos" },
    { img: "assets/nb-chocodrip.jpg", name: "Chocolate & frutos" },
    { img: "assets/nb-lavender.jpg", name: "Minimalista lavanda" },
    { img: "assets/nb-heart.jpg", name: "Coração" },
    { img: "assets/nb-daisies.jpg", name: "Branco & margaridas" },
    { img: "assets/nb-melancia.jpg", name: "Melancia" }
  ],

  // Envio das encomendas para a app Sal Doce Premium (Supabase).
  // As encomendas passam a aparecer diretamente na app.
  supabase: {
    enabled: true,
    url: "https://nkwhqrgsfytsohnmhhch.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rd2hxcmdzZnl0c29obm1oaGNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMTE2ODMsImV4cCI6MjA5Njc4NzY4M30.YUyJ23_wlZcSwHtKi-Gqf4QuuMOHbFTE0SAUX1Xo9e0",
    table: "orders",
    sourceChannel: "Site",
    // Se true, também abre o WhatsApp com o resumo (para enviar a foto da decoração)
    alsoWhatsApp: true,
    // Armazenamento das definições/fotos do site (painel admin)
    bucket: "Photos",
    configFile: "site-config.json",
  },

  // Notificação de nova encomenda (push mesmo com tudo fechado, via ntfy.sh)
  // Instale a app "ntfy" e subscreva o tópico abaixo para receber os avisos.
  ntfy: {
    enabled: true,
    server: "https://ntfy.sh",
    topic: "saldoce-ord-63d687b8abde0c5a",
  },
};
