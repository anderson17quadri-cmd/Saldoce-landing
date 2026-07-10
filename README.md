# Sal Doce — Landing Page 🧁

Landing page de alta conversão para a doçaria artesanal **Sal Doce** ([@saldoce.pt](https://www.instagram.com/saldoce.pt)).
Página estática (HTML + CSS + JS), sem dependências, pronta a publicar.

Especialidade: brigadeiros gourmet, bolos temáticos, cheesecakes/brownies, boxes e ovos de Páscoa.
Paleta da marca: **rosa + creme/bege**. CTA principal: **encomenda por WhatsApp**.

As fotos em `assets/` são reais, retiradas do Instagram da marca.

## Estrutura

```
index.html    → conteúdo e secções
styles.css    → design e responsividade (paleta em :root)
script.js     → menu, animações e ligação ao WhatsApp
assets/       → fotografias dos produtos (hero, cards, galeria)
```

## ⚙️ Personalizar (importante)

Abra **`script.js`** e edite o bloco de configuração no topo:

```js
const SALDOCE = {
  whatsapp: "351000000000",  // número real, só dígitos, com indicativo (351 = Portugal)
  instagram: "https://www.instagram.com/saldoce.pt",
};
```

- **WhatsApp:** substitua `351000000000` pelo número real (formato internacional, sem `+`, espaços ou traços). Todos os botões passam a abrir uma conversa já com mensagem pré-preenchida.
- **Instagram:** confirme o link.

### Trocar textos e preços
Edite diretamente em `index.html` (secção `#produtos` para os cards e preços).

### Trocar as fotos
As imagens estão em `assets/` e são referenciadas em `index.html` (hero, cards de produto e galeria).
Para atualizar, substitua os ficheiros mantendo o mesmo nome, ou aponte os `<img src="...">` para novas fotos.

### Ajustar cores
As cores estão centralizadas no topo de `styles.css`, em `:root` (`--rosa`, `--creme`, `--bege`, etc.).

## 🚀 Publicar

**GitHub Pages:** Settings → Pages → Deploy from branch → `main` (ou a branch atual) / root.

**Localmente:** basta abrir `index.html` no navegador.

---
Feito com 🍓 em Portugal.
