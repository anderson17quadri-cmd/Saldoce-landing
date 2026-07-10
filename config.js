/* =========================================================
   SAL DOCE — Configuração partilhada
   Edite aqui o WhatsApp, o Instagram, a foto de capa e a base de dados.
   ========================================================= */
window.SALDOCE = {
  // WhatsApp em formato internacional, SÓ dígitos (351 = Portugal).
  whatsapp: "351934244718",              // Sal Doce (+351 934 244 718)
  instagram: "https://www.instagram.com/saldoce.pt",

  // Foto de capa (hero). Pode escolher no painel privado: admin.html
  heroImage: "assets/cake-berry.webp",

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
  },
};
