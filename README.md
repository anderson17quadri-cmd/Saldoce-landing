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
admin.html      → painel PRIVADO para escolher a foto de capa
styles.css      → design e responsividade (paleta em :root)
config.js       → nº de WhatsApp, Instagram e foto de capa (EDITAR)
script.js       → menu, carrossel, reel, chocolate a escorrer, animações
encomenda.js    → lógica do pedido e mensagem de WhatsApp
admin.js        → lógica do painel da capa
assets/         → logótipo e fotografias dos produtos
```

## 🎂 Painel privado da capa (`admin.html`)

Abra **`/admin.html`** (página não listada no site) para editar a **foto de capa**
e os **bolos em destaque** (nome + foto), usando fotos da biblioteca **ou do
telemóvel**. Ao carregar em **"💾 Guardar tudo no site"**, as fotos e definições
são gravadas no **Supabase** (bucket `Photos` + `site-config.json`) e passam a
aparecer para **todos os visitantes** — não é preciso editar código. O site lê
essas definições no arranque (com as predefinições de `config.js` como reserva).

## 🧾 Encomendas → app Sal Doce Premium (Supabase)

As encomendas feitas em `encomenda.html` são **registadas diretamente na base
de dados (Supabase) da app Sal Doce Premium** (tabela `orders`, com
`source_channel: "Site"`) e, em paralelo, abrem o WhatsApp para confirmação e
envio da foto de decoração. A configuração está em `config.js` → `supabase`.

> ⚠️ **Segurança:** a `anonKey` fica visível no site (é assim que funcionam as
> chaves públicas do Supabase). Como as políticas (RLS) atuais permitem leitura/
> remoção à role `anon`, recomenda-se reforçar as políticas para permitir apenas
> **inserção** anónima (INSERT) e restringir SELECT/UPDATE/DELETE a utilizadores
> autenticados. Posso ajudar a configurar isto.

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
