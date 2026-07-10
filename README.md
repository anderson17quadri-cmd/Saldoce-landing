# Sal Doce — Landing Page 🧁

Landing page de alta conversão para a doçaria artesanal **Sal Doce** ([@saldoce.pt](https://www.instagram.com/saldoce.pt)).
Site estático (HTML + CSS + JS), sem dependências, pronto a publicar.

Especialidade: **bolos personalizados**, brigadeiros gourmet, cheesecakes, morango do amor e **salgados** para festa.
Paleta da marca: **rosa + creme + menta (turquesa)**. Logótipo real incluído. As fotos em `assets/` são reais, do Instagram da marca.

## ✨ Destaques

- **Bolos à frente** — hero e secção de destaque com os bolos.
- **Chocolate a escorrer** — animação (drip) por baixo do hero.
- **Carrossel automático** de fotos que passa sozinho.
- **Cardápio de bolos** — massas, recheios e adicionais.
- **Página de encomenda** (`encomenda.html`) — o cliente monta o pedido (bolo + brigadeiros + salgados),
  descreve a decoração, escolhe tamanho/data e **envia o resumo direto para o WhatsApp**.
- Botão flutuante de WhatsApp, menu mobile, animações on-scroll e 100% responsiva.

## Estrutura

```
index.html      → página principal
encomenda.html  → construtor de encomenda (→ WhatsApp)
styles.css      → design e responsividade (paleta em :root)
config.js       → nº de WhatsApp e Instagram (EDITAR)
script.js       → menu, carrossel, chocolate a escorrer, animações
encomenda.js    → lógica do pedido e mensagem de WhatsApp
assets/         → logótipo e fotografias dos produtos
```

## ⚙️ Personalizar (importante)

Abra **`config.js`** e edite:

```js
window.SALDOCE = {
  whatsapp: "351000000000",  // número real, só dígitos, com indicativo (351 = Portugal)
  instagram: "https://www.instagram.com/saldoce.pt",
};
```

- **WhatsApp:** substitua `351000000000` pelo número real (formato internacional, sem `+`, espaços ou traços).
  Todos os botões e o envio do pedido passam a abrir a conversa certa, com a mensagem já preenchida.
- **Instagram:** confirme o link.

### Textos, cardápio e sabores
- Cardápio e produtos: edite `index.html`.
- Opções da encomenda (recheios, massas, sabores de brigadeiro, salgados): estão em `encomenda.html`
  (recheios/massas) e no topo de `encomenda.js` (listas `BRIGADEIROS` e `SALGADOS`).

### Fotos e logótipo
As imagens estão em `assets/`. Para atualizar, substitua os ficheiros mantendo o mesmo nome
(ou aponte os `<img src="...">` para novas fotos).

### Cores
Centralizadas no topo de `styles.css`, em `:root` (`--rosa`, `--menta`, `--creme`, etc.).

## 🚀 Publicar

**GitHub Pages:** Settings → Pages → Deploy from branch → selecione a branch / root.

**Localmente / Termux:**
```bash
python -m http.server 8080
# abrir http://localhost:8080
```

---
Feito com 🍓 em Portugal.
