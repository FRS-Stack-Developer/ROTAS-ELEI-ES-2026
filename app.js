/* Mapa das rotas de escolta de urnas. 3ª RPM, Eleições 2026.
   Lê data/cenario-*.geojson e data/unidades.json (ou os dados embutidos no arquivo único) e monta o mapa com Leaflet. */
(function () {
  "use strict";
  const C = window.CONFIG;
  const EMB = window.__DADOS_EMBUTIDOS || null;
  const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const celular = () => window.matchMedia("(max-width: 760px)").matches;
  // arquivo aberto direto da pasta: sem site de origem, alguns servidores de mapa recusam os pedidos
  const semServidor = location.protocol === "file:";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const nf1 = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  const nf0 = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
  const semAcento = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const asset = (p) => (EMB && EMB.assets && EMB.assets[p]) || p;
  const ll = (c) => [c[1], c[0]];

  const estado = {
    cenario: C.cenarios[0].id,
    modo: "geral", cidades: new Set(), unidades: new Set(),
    rotaSel: null, destinoSel: null, painel: null,
    base: C.mapaBase.padrao, relevo: false,
    fluxo: !!C.animacaoFluxo,
    camadas: { rotas: true, destinos: true, origens: true },
    busca: ""
  };
  let mapa, unidades = {}, regiao = null, rotas = [], destinos = [], origens = [];
  const rotaPorId = {}, destinoPorId = {}, origemPorId = {};
  let visRotas = [], visDestinos = [];
  // camadas do Leaflet
  const linhas = {}, circulos = {}, marcadoresOrigem = {};
  let rend = {}, camadaBase = null, camadaRelevo = null, grupoSel = null, grupoParadas = null, grupoDestSel = null;

  /* ---------- carga de dados ---------- */
  async function carregarJSON(url) {
    const r = await fetch(url, { cache: "no-cache" });
    if (!r.ok) throw new Error(url + " (" + r.status + ")");
    return r.json();
  }

  async function iniciar() {
    $$("img").forEach((im) => { const s = im.getAttribute("src"); if (s) im.src = asset(s); });
    $("#titulo").textContent = C.titulo;
    $("#subtitulo").textContent = C.subtitulo;
    if (!window.L) {
      $("#carregando").textContent = "Não foi possível carregar a biblioteca do mapa (Leaflet). Verifique a conexão com a internet.";
      return;
    }
    try {
      const cen = C.cenarios.find((c) => c.id === estado.cenario);
      const [gj, uni] = EMB ? [EMB.cenarios[estado.cenario], EMB.unidades]
        : await Promise.all([carregarJSON(cen.arquivo), carregarJSON(C.arquivoUnidades)]);
      prepararDados(gj, uni);
      $("#chip-cenario").textContent = cen.nome;
      $("#legenda-fonte").textContent = "Dados gerados em " + (gj.metadata && gj.metadata.gerado_em || "") + ". Traçado: " + (gj.metadata && gj.metadata.roteamento || "") + ".";
    } catch (e) {
      $("#carregando").textContent = "Não foi possível carregar os dados (" + e.message + "). Abra o arquivo único do mapa ou use um servidor web, como explicado no README.";
      console.error(e);
      return;
    }
    criarMapa();
    montarInterface();
    $("#carregando").hidden = true;
  }

  function prepararDados(gj, uni) {
    regiao = uni.regiao;
    uni.unidades.forEach((u) => { unidades[u.id] = u; });
    const nomeUnidade = (p) => {
      const u = unidades[p.unidade], b = unidades[p.bpm];
      return [u && u.nome, b && b.nome !== (u && u.nome) ? b.nome : null].filter(Boolean).join(", ");
    };
    gj.features.forEach((f) => {
      const p = f.properties;
      p.unidade_nome = nomeUnidade(p);
      if (p.tipo === "rota") { rotas.push(f); rotaPorId[p.id] = f; }
      else if (p.tipo === "destino") { destinos.push(f); destinoPorId[p.id] = f; }
      else if (p.tipo === "origem") { origens.push(f); origemPorId[p.id] = f; }
    });
    const ordemCidade = (m) => C.cidades.findIndex((c) => c.nome === m);
    rotas.sort((a, b) => ordemCidade(a.properties.municipio) - ordemCidade(b.properties.municipio) || a.properties.id.localeCompare(b.properties.id));
  }

  /* ---------- filtros ---------- */
  function passaFiltro(p) {
    if (estado.modo === "cidade" && estado.cidades.size) return estado.cidades.has(p.municipio);
    if (estado.modo === "unidade" && estado.unidades.size) return estado.unidades.has(p.unidade);
    return true;
  }

  function aplicarFiltros(enquadrar = true) {
    visRotas = rotas.filter((f) => passaFiltro(f.properties));
    visDestinos = destinos.filter((f) => passaFiltro(f.properties));
    if (estado.rotaSel && !visRotas.some((f) => f.properties.id === estado.rotaSel)) estado.rotaSel = null;
    sincronizarCamadas();
    atualizarDestaque();
    $("#topo-filtro").textContent = textoFiltro();
    renderLista();
    renderIndicadores();
    sincronizarSeletores();
    if (enquadrar) enquadrarVisiveis();
  }

  function textoFiltro() {
    if (estado.modo === "cidade" && estado.cidades.size) return "Cidade: " + Array.from(estado.cidades).join(", ");
    if (estado.modo === "unidade" && estado.unidades.size) {
      const nomes = [];
      Object.values(unidades).filter((u) => u.tipo === "BPM").forEach((b) => {
        const filhos = Object.values(unidades).filter((u) => u.pai === b.id);
        const sel = filhos.filter((u) => estado.unidades.has(u.id));
        if (sel.length && sel.length === filhos.length) nomes.push(b.nome);
        else sel.forEach((u) => nomes.push(u.nome));
      });
      return "Unidade: " + nomes.join(", ");
    }
    return "Visão geral " + (regiao ? regiao.nome : "");
  }

  function definirGeral() { estado.modo = "geral"; estado.cidades.clear(); estado.unidades.clear(); fecharCartao(); aplicarFiltros(); }
  function definirCidades(lista) { estado.modo = lista.length ? "cidade" : "geral"; estado.cidades = new Set(lista); estado.unidades.clear(); fecharCartao(); aplicarFiltros(); }
  function definirUnidades(lista) { estado.modo = lista.length ? "unidade" : "geral"; estado.unidades = new Set(lista); estado.cidades.clear(); fecharCartao(); aplicarFiltros(); }

  /* ---------- cores ---------- */
  const baseEscura = () => C.mapaBaseDisponivel && !!(C.mapaBase.opcoes[estado.base] || {}).escuro;
  const modalidade = (m) => C.modalidades[m] || C.modalidades.NAO_INFORMADA;
  const corMapa = (m) => (baseEscura() ? modalidade(m).corClara : modalidade(m).cor);
  const corPainel = (m) => modalidade(m).corClara;
  const corContorno = () => (baseEscura() ? "#0c0b09" : "#ffffff");

  /* ---------- mapa ---------- */
  function criarMapa() {
    const el = $("#mapa");
    el.classList.toggle("sem-base", !C.mapaBaseDisponivel);
    el.style.setProperty("--op-nao-sel", String(C.selecao.opacidadeNaoSelecionadas));
    mapa = L.map(el, { zoomControl: false, zoomSnap: 0.25, zoomDelta: 0.5, wheelPxPerZoomLevel: 110, minZoom: 7, maxZoom: 19, attributionControl: true });
    mapa.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
    L.control.zoom({ position: "bottomright", zoomInTitle: "Aproximar", zoomOutTitle: "Afastar" }).addTo(mapa);
    L.control.scale({ position: "bottomleft", imperial: false }).addTo(mapa);

    // camadas em ordem: contorno, linhas, sentido, área de clique, rota selecionada, destinos
    [["contorno", 405], ["rotas", 410], ["fluxo", 415], ["toque", 418], ["rotaSel", 420], ["destinos", 430]].forEach(([n, z]) => {
      mapa.createPane(n).style.zIndex = z;
      rend[n] = L.svg({ pane: n, padding: 0.4 });
    });
    mapa.getPane("toque").classList.add("pane-toque");

    // enquadramento inicial antes de desenhar
    const b = limites([...rotas, ...destinos, ...origens]);
    mapa.fitBounds([[b[1], b[0]], [b[3], b[2]]], { animate: false, padding: [40, 40] });

    aplicarBase();
    criarRotas();
    criarDestinos();
    origens.forEach(criarMarcadorOrigem);
    grupoSel = L.layerGroup().addTo(mapa);
    grupoParadas = L.layerGroup().addTo(mapa);
    grupoDestSel = L.layerGroup().addTo(mapa);
    mapa.on("click", fecharCartao);
    el.classList.toggle("sem-fluxo", !estado.fluxo);
  }

  let errosBase = 0, okBase = false, avisoTimer = null;
  function aplicarBase() {
    if (!C.mapaBaseDisponivel) return;
    if (camadaBase) mapa.removeLayer(camadaBase);
    const op = C.mapaBase.opcoes[estado.base];
    const lista = semServidor && op.semServidor ? op.semServidor : op.camadas;
    errosBase = 0; okBase = false;
    camadaBase = L.layerGroup(lista.map((t, i) => {
      const tl = L.tileLayer(t.url, { maxZoom: 19, maxNativeZoom: t.maxZoom || 19, subdomains: t.sub || "abc", attribution: t.atribuicao || "",
        opacity: t.opacidade == null ? 1 : t.opacidade, zIndex: 1 + i });
      tl.on("tileload", () => { okBase = true; $("#aviso-mapa").hidden = true; });
      tl.on("tileerror", () => { errosBase++; });
      return tl;
    })).addTo(mapa);
    $("#mapa").classList.toggle("base-escura", !!op.escuro);
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(() => { if (!okBase && errosBase > 0) $("#aviso-mapa").hidden = false; }, 7000);
  }

  function aplicarRelevo() {
    if (!C.mapaBaseDisponivel) return;
    if (estado.relevo && !camadaRelevo) {
      camadaRelevo = L.tileLayer(C.relevo.url, { maxZoom: 19, maxNativeZoom: C.relevo.maxZoom, opacity: C.relevo.opacidade, zIndex: 10,
        className: "camada-relevo", attribution: C.relevo.atribuicao });
    }
    if (estado.relevo) camadaRelevo.addTo(mapa);
    else if (camadaRelevo) mapa.removeLayer(camadaRelevo);
  }

  function dicaRota(p) {
    const extra = p.destinos.length > 1 ? " e mais " + (p.destinos.length - 1) : "";
    return "<b>" + esc(p.rota) + ", " + esc(p.municipio) + "</b><br>" + esc(p.destinos[0] || "") + esc(extra) + "<br><small>" + nf1.format(p.distancia_km) + " km</small>";
  }

  function criarRotas() {
    const cap = { lineCap: "round", lineJoin: "round" };
    rotas.forEach((f) => {
      const p = f.properties, pts = f.geometry.coordinates.map(ll);
      const contorno = L.polyline(pts, Object.assign({ pane: "contorno", renderer: rend.contorno, color: corContorno(), weight: 7.5, opacity: 0.85, interactive: false }, cap));
      const linha = L.polyline(pts, Object.assign({ pane: "rotas", renderer: rend.rotas, color: corMapa(p.modalidade), weight: 3.6, opacity: 1, interactive: false,
        dashArray: p.calculada ? null : "8 7" }, cap));
      const fluxo = L.polyline(pts, { pane: "fluxo", renderer: rend.fluxo, color: "#ffffff", weight: 2, opacity: 0.9, interactive: false,
        dashArray: "2 14", lineCap: "round", lineJoin: "round", className: "fluxo fluxo-todos" });
      const toque = L.polyline(pts, { pane: "toque", renderer: rend.toque, color: "#000", weight: 16, opacity: 0, interactive: true, bubblingMouseEvents: false });
      toque.on("click", () => selecionarRota(p.id, false));
      toque.bindTooltip(() => dicaRota(p), { sticky: true, direction: "top", offset: [0, -10], className: "dica", opacity: 1 });
      linhas[p.id] = { contorno, linha, fluxo, toque };
    });
  }

  function estiloDestino(p, apagado) {
    const sem = !!p.sem_rota;
    const o = apagado ? C.selecao.opacidadeDestinosFora : 1;
    return { radius: 5.5, weight: sem ? 2 : 1.6, color: sem ? "#6b6355" : "#0c0b09", opacity: o,
      fillColor: "#ffffff", fillOpacity: sem ? 0 : o };
  }
  function criarDestinos() {
    destinos.forEach((f) => {
      const p = f.properties;
      const c = L.circleMarker(ll(f.geometry.coordinates), Object.assign({ pane: "destinos", renderer: rend.destinos, bubblingMouseEvents: false }, estiloDestino(p, false)));
      c.on("click", () => mostrarDestino(p.id));
      c.bindTooltip(esc(p.nome) + (p.sem_rota ? "<br><small>sem rota de escolta em 2026</small>" : ""), { direction: "top", offset: [0, -6], className: "dica", opacity: 1 });
      circulos[p.id] = c;
    });
  }

  function criarMarcadorOrigem(o) {
    const p = o.properties, u = unidades[p.unidade] || unidades[p.bpm];
    const icone = L.divIcon({
      className: "marcador-origem", iconSize: [46, 46], iconAnchor: [23, 23],
      html: '<span class="anel"><img alt="" src="' + esc(asset(u ? u.escudo : regiao.escudo)) + '"></span><span class="rotulo">' + esc(p.municipio) + "</span>"
    });
    const m = L.marker(ll(o.geometry.coordinates), { icon: icone, title: "Origem " + p.municipio, riseOnHover: true, keyboard: true });
    m.on("click", () => mostrarOrigem(p.id));
    marcadoresOrigem[p.id] = m;
  }

  const poe = (camada, ligado) => { if (ligado) { if (!mapa.hasLayer(camada)) camada.addTo(mapa); } else if (mapa.hasLayer(camada)) mapa.removeLayer(camada); };

  function sincronizarCamadas() {
    if (!mapa) return;
    const vr = new Set(visRotas.map((f) => f.properties.id));
    rotas.forEach((f) => {
      const id = f.properties.id, l = linhas[id], on = estado.camadas.rotas && vr.has(id);
      poe(l.contorno, on); poe(l.linha, on); poe(l.toque, on); poe(l.fluxo, on && estado.fluxo);
    });
    const vd = new Set(visDestinos.map((f) => f.properties.id));
    destinos.forEach((f) => poe(circulos[f.properties.id], estado.camadas.destinos && vd.has(f.properties.id)));
    origens.forEach((o) => poe(marcadoresOrigem[o.properties.id], estado.camadas.origens && passaFiltro(o.properties)));
    $("#mapa").classList.toggle("sem-fluxo", !estado.fluxo);
  }

  /* rota selecionada: cor própria, contorno branco e animação do sentido; as outras ficam transparentes */
  function atualizarDestaque() {
    if (!mapa) return;
    const sel = estado.rotaSel && estado.camadas.rotas ? estado.rotaSel : null;
    $("#mapa").classList.toggle("com-selecao", !!sel);
    grupoSel.clearLayers();
    grupoParadas.clearLayers();
    grupoDestSel.clearLayers();
    const paradas = sel ? new Set(rotaPorId[sel].properties.paradas) : null;
    destinos.forEach((f) => circulos[f.properties.id].setStyle(estiloDestino(f.properties, paradas && !paradas.has(f.properties.id))));
    if (sel) {
      const f = rotaPorId[sel], p = f.properties, pts = f.geometry.coordinates.map(ll);
      const base = { pane: "rotaSel", renderer: rend.rotaSel, interactive: false, lineCap: "round", lineJoin: "round" };
      grupoSel.addLayer(L.polyline(pts, Object.assign({}, base, { color: "#ffffff", weight: 12, opacity: 1 })));
      grupoSel.addLayer(L.polyline(pts, Object.assign({}, base, { color: C.selecao.cor, weight: 7, opacity: 1, dashArray: p.calculada ? null : "10 8" })));
      grupoSel.addLayer(L.polyline(pts, Object.assign({}, base, { color: "#ffffff", weight: 3, opacity: 0.95, dashArray: "8 12", lineCap: "butt", className: "fluxo fluxo-sel" })));
      p.paradas.forEach((d, i) => {
        const dd = destinoPorId[d];
        if (!dd) return;
        const m = L.marker(ll(dd.geometry.coordinates), { icon: L.divIcon({ className: "num-parada", html: "<span>" + (i + 1) + "</span>", iconSize: [26, 26], iconAnchor: [13, 13] }),
          title: dd.properties.nome, zIndexOffset: 500 });
        m.on("click", () => mostrarDestino(d));
        grupoParadas.addLayer(m);
      });
    }
    if (estado.destinoSel && destinoPorId[estado.destinoSel]) {
      const c = ll(destinoPorId[estado.destinoSel].geometry.coordinates);
      grupoDestSel.addLayer(L.circleMarker(c, { pane: "destinos", renderer: rend.destinos, radius: 12, color: "#ffffff", weight: 6, fill: false, interactive: false }));
      grupoDestSel.addLayer(L.circleMarker(c, { pane: "destinos", renderer: rend.destinos, radius: 12, color: C.selecao.cor, weight: 3, fill: false, interactive: false }));
    }
    $$(".item-rota").forEach((b) => b.classList.toggle("sel", b.dataset.id === estado.rotaSel));
  }

  function recolorir() {
    rotas.forEach((f) => {
      const l = linhas[f.properties.id];
      l.contorno.setStyle({ color: corContorno() });
      l.linha.setStyle({ color: corMapa(f.properties.modalidade) });
    });
    renderLegenda();
  }

  function limites(feats) {
    let b = null;
    const add = (c) => { if (!b) b = [c[0], c[1], c[0], c[1]]; else { b[0] = Math.min(b[0], c[0]); b[1] = Math.min(b[1], c[1]); b[2] = Math.max(b[2], c[0]); b[3] = Math.max(b[3], c[1]); } };
    feats.forEach((f) => { const g = f.geometry; if (g.type === "Point") add(g.coordinates); else g.coordinates.forEach(add); });
    return b;
  }

  function folgas() {
    const p = { top: 50, bottom: 50, left: 50, right: 50 };
    if (celular()) {
      if (!$("#painel").hidden) p.bottom = $("#painel").offsetHeight + 20;
      if (!$("#cartao").hidden) p.bottom = Math.max(p.bottom, $("#cartao").offsetHeight + 20);
    } else {
      if (!$("#painel").hidden) p.left = $("#painel").offsetWidth + 40;
      if (!$("#cartao").hidden) p.right = $("#cartao").offsetWidth + 40;
    }
    return p;
  }

  function enquadrar(feats, dur) {
    const b = limites(feats);
    if (!b || !mapa) return;
    const pt = folgas();
    const cv = mapa.getContainer();
    if (cv.clientWidth - pt.left - pt.right < 80) { pt.left = pt.right = 30; }
    if (cv.clientHeight - pt.top - pt.bottom < 80) { pt.top = pt.bottom = 30; }
    const lim = L.latLngBounds([b[1], b[0]], [b[3], b[2]]);
    const op = { paddingTopLeft: [pt.left, pt.top], paddingBottomRight: [pt.right, pt.bottom], maxZoom: 16 };
    if (dur === 0 || reduzirMovimento) mapa.fitBounds(lim, Object.assign(op, { animate: false }));
    else mapa.flyToBounds(lim, Object.assign(op, { duration: 0.9 }));
  }
  function enquadrarVisiveis(dur) {
    const oo = origens.filter((o) => passaFiltro(o.properties));
    const fs = [...visRotas, ...visDestinos, ...oo];
    enquadrar(fs.length ? fs : [...rotas, ...destinos], dur);
  }

  function trocarBase(k) {
    if (k === estado.base) return;
    estado.base = k;
    $$("#seg-mapa-base button").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.base === k)));
    aplicarBase();
    recolorir();
    atualizarDestaque();
  }

  /* ---------- cartões ---------- */
  function permitido(campo) {
    return !(C.ocultarCamposSensiveis && C.camposSensiveis.some((s) => campo.toLowerCase().includes(s)));
  }
  function fmtTempo(min) {
    if (min == null) return "não estimado";
    const m = Math.round(min);
    return m < 60 ? m + " min" : Math.floor(m / 60) + " h " + String(m % 60).padStart(2, "0") + " min";
  }
  function fmtValor(v, formato) {
    if (v == null || v === "") return "não informado";
    if (formato === "km") return nf1.format(v) + " km";
    if (formato === "tempo") return fmtTempo(v);
    return esc(v);
  }
  function camposHTML(p, lista) {
    return '<dl class="campos">' + lista.filter((c) => permitido(c.campo)).map((c) => "<dt>" + esc(c.rotulo) + "</dt><dd>" + fmtValor(p[c.campo], c.formato) + "</dd>").join("") + "</dl>";
  }
  function unidadeHTML(p) {
    const u = unidades[p.unidade] || unidades[p.bpm];
    if (!u) return "";
    return '<div class="cartao-unidade"><img alt="" src="' + esc(asset(u.escudo)) + '"><span>' + esc(p.unidade_nome) + "</span></div>";
  }
  function chipModalidade(m) {
    const d = modalidade(m);
    return '<span class="chip chip-mod" style="color:' + d.corClara + '">' + esc(d.rotulo) + "</span>";
  }
  function abrirCartao(html) {
    $("#cartao-conteudo").innerHTML = html;
    $("#cartao").hidden = false;
    if (celular()) fecharPainel();
    $$("#cartao-conteudo [data-destino]").forEach((b) => b.addEventListener("click", () => mostrarDestino(b.dataset.destino)));
    $$("#cartao-conteudo [data-rota]").forEach((b) => b.addEventListener("click", () => selecionarRota(b.dataset.rota, true)));
    $$("#cartao-conteudo [data-cidade]").forEach((b) => b.addEventListener("click", () => definirCidades([b.dataset.cidade])));
  }
  function fecharCartao() {
    $("#cartao").hidden = true;
    estado.rotaSel = null; estado.destinoSel = null;
    atualizarDestaque();
  }

  function selecionarRota(id, enq) {
    const f = rotaPorId[id];
    if (!f) return;
    if (!passaFiltro(f.properties)) { estado.modo = "geral"; estado.cidades.clear(); estado.unidades.clear(); aplicarFiltros(false); }
    estado.rotaSel = id; estado.destinoSel = null;
    const p = f.properties;
    const origem = origemPorId[p.id_saida];
    let paradas = '<ol class="paradas"><li class="origem"><span>' + esc(origem ? origem.properties.nome : p.origem) + "</span><span class=\"trecho\">origem</span></li>";
    p.paradas.forEach((d, i) => {
      const dd = destinoPorId[d], t = p.trechos && p.trechos[i];
      paradas += '<li><button class="link" data-destino="' + esc(d) + '">' + esc(dd ? dd.properties.nome : d) + '</button><span class="trecho">' +
        (t ? nf1.format(t.km) + " km, " + fmtTempo(t.min) : "") + "</span></li>";
    });
    paradas += "</ol>";
    let alertas = "";
    if (!p.calculada) alertas += '<div class="alerta-linha">Rota não calculada: linha reta entre os pontos.</div>';
    if (p.distancia_via_m > 300) alertas += '<div class="alerta-linha">O destino fica a ' + nf0.format(p.distancia_via_m) + " m da via mais próxima; o último trecho não aparece no traçado.</div>";
    abrirCartao('<div class="cartao-tipo">Rota de escolta</div><h3 class="cartao-titulo">' + esc(p.rota) + ", " + esc(p.municipio) + "</h3>" +
      unidadeHTML(p) + '<div class="cartao-chips">' + chipModalidade(p.modalidade) + '<span class="chip chip-sel">Selecionada</span></div>' + camposHTML(p, C.cartoes.rota) + paradas + alertas);
    atualizarDestaque();
    if (enq) enquadrar([f, ...p.paradas.map((d) => destinoPorId[d]).filter(Boolean), origem].filter(Boolean));
  }

  function mostrarDestino(id) {
    const f = destinoPorId[id];
    if (!f) return;
    estado.destinoSel = id; estado.rotaSel = null;
    const p = f.properties;
    const links = p.rotas.length ? '<div class="rotas-links">' + p.rotas.map((r) => '<button class="btn" data-rota="' + esc(r) + '">' + esc(rotaPorId[r] ? rotaPorId[r].properties.rota : r) + "</button>").join("") + "</div>"
      : '<div class="alerta-linha">Sem rota de escolta registrada em 2026.</div>';
    abrirCartao('<div class="cartao-tipo">Destino, local de votação</div><h3 class="cartao-titulo">' + esc(p.nome) + "</h3>" + unidadeHTML(p) +
      camposHTML(p, C.cartoes.destino) + '<h3 class="sub" style="margin-top:14px">Rotas que atendem</h3>' + links);
    atualizarDestaque();
  }

  function mostrarOrigem(id) {
    const f = origemPorId[id];
    if (!f) return;
    estado.rotaSel = null; estado.destinoSel = null;
    const p = f.properties;
    const n = rotas.filter((r) => r.properties.id_saida === id).length;
    abrirCartao('<div class="cartao-tipo">Ponto de origem</div><h3 class="cartao-titulo">' + esc(p.municipio) + "</h3>" + unidadeHTML(p) +
      camposHTML(p, C.cartoes.origem) + '<div class="rotas-links"><button class="btn btn-primario" data-cidade="' + esc(p.municipio) + '">Ver as ' + n + " rotas de " + esc(p.municipio) + "</button></div>");
    atualizarDestaque();
  }

  /* ---------- painel e interface ---------- */
  const TITULOS = { geral: "Visão geral", unidade: "Por unidade", cidade: "Por cidade", lista: "Lista de rotas", indicadores: "Indicadores", camadas: "Camadas e mapa base", legenda: "Legenda" };
  function abrirPainel(id) {
    estado.painel = id;
    $("#painel").hidden = false;
    $("#painel-titulo").textContent = TITULOS[id];
    $$(".painel-corpo").forEach((s) => s.classList.toggle("ativo", s.dataset.sec === id));
    $$(".barra-item[data-painel]").forEach((b) => b.classList.toggle("ativo", b.dataset.painel === id));
    if (celular()) $("#cartao").hidden = true;
  }
  function fecharPainel() {
    estado.painel = null;
    $("#painel").hidden = true;
    $$(".barra-item[data-painel]").forEach((b) => b.classList.remove("ativo"));
  }

  function renderLegenda() {
    $("#legenda-modalidades").innerHTML = Object.keys(C.modalidades).map((k) =>
      '<div class="leg-item"><span class="leg-linha" style="--c:' + corMapa(k) + '"></span>' + esc(C.modalidades[k].rotulo) + "</div>").join("");
    $("#leg-sel").style.setProperty("--c", C.selecao.cor);
  }

  function montarInterface() {
    $$(".barra-item[data-painel]").forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.painel;
      if (estado.painel === id) return fecharPainel();
      abrirPainel(id);
      if (id === "geral") definirGeral();
    }));
    $("#painel-fechar").addEventListener("click", fecharPainel);
    $("#cartao-fechar").addEventListener("click", fecharCartao);
    $("#btn-ver-tudo").addEventListener("click", definirGeral);
    $("#btn-recolher").addEventListener("click", () => {
      const aberta = $("#app").classList.toggle("barra-aberta");
      $("#btn-recolher").setAttribute("aria-expanded", String(aberta));
      try { localStorage.setItem("barraAberta", aberta ? "1" : "0"); } catch (e) { /* armazenamento indisponível */ }
      setTimeout(() => mapa && mapa.invalidateSize(), 400);
    });
    $("#mapa").addEventListener("transitionend", (e) => { if (e.target === $("#mapa") && e.propertyName === "left") mapa.invalidateSize(); });
    try { if (localStorage.getItem("barraAberta") === "1" && !celular()) { $("#app").classList.add("barra-aberta"); $("#btn-recolher").setAttribute("aria-expanded", "true"); setTimeout(() => mapa.invalidateSize(), 260); } } catch (e) { /* sem preferência salva */ }
    $("#btn-tela-cheia").addEventListener("click", () => {
      const d = document;
      if (d.fullscreenElement) d.exitFullscreen().catch(() => {});
      else if (d.documentElement.requestFullscreen) d.documentElement.requestFullscreen().catch(() => {});
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { if (!$("#cartao").hidden) fecharCartao(); else fecharPainel(); } });
    $("#aviso-mapa-fechar").addEventListener("click", () => { $("#aviso-mapa").hidden = true; });

    // visão geral: cartões das cidades
    $("#cidades-resumo").innerHTML = C.cidades.map((c) => {
      const rs = rotas.filter((r) => r.properties.municipio === c.nome);
      const ds = destinos.filter((d) => d.properties.municipio === c.nome);
      const km = rs.reduce((s, r) => s + r.properties.distancia_km, 0);
      return '<button class="cidade-card" data-cidade="' + esc(c.nome) + '"><strong>' + esc(c.nome) + '</strong><span class="cia">' + esc(unidades[c.unidade] ? unidades[c.unidade].nome : "") +
        '</span><span class="nums">' + rs.length + " rotas, " + ds.length + " destinos, " + nf1.format(km) + " km</span></button>";
    }).join("");
    $$("#cidades-resumo .cidade-card").forEach((b) => b.addEventListener("click", () => { definirCidades([b.dataset.cidade]); }));

    // por unidade
    const bpms = Object.values(unidades).filter((u) => u.tipo === "BPM");
    $("#lista-unidades").innerHTML = bpms.map((b) => {
      const filhos = Object.values(unidades).filter((u) => u.pai === b.id);
      const nB = rotas.filter((r) => r.properties.bpm === b.id).length;
      return '<label class="opcao"><input type="checkbox" data-unidade="' + b.id + '" data-pai="1"><img alt="" src="' + esc(asset(b.escudo)) +
        '"><span class="opcao-texto"><b>' + esc(b.nome) + "</b><small>" + filhos.length + ' companhias</small></span><span class="opcao-num">' + nB + " rotas</span></label>" +
        filhos.map((u) => {
          const cid = C.cidades.find((c) => c.unidade === u.id);
          const n = rotas.filter((r) => r.properties.unidade === u.id).length;
          return '<label class="opcao filho"><input type="checkbox" data-unidade="' + u.id + '" data-de="' + b.id + '"><img alt="" src="' + esc(asset(u.escudo)) +
            '"><span class="opcao-texto"><b>' + esc(u.nome) + "</b><small>" + esc(cid ? cid.nome : "") + '</small></span><span class="opcao-num">' + n + " rotas</span></label>";
        }).join("");
    }).join("");
    $$("#lista-unidades input").forEach((inp) => inp.addEventListener("change", () => {
      if (inp.dataset.pai) $$('#lista-unidades input[data-de="' + inp.dataset.unidade + '"]').forEach((f) => { f.checked = inp.checked; });
      const sel = $$("#lista-unidades input[data-de]").filter((f) => f.checked).map((f) => f.dataset.unidade);
      definirUnidades(sel);
    }));

    // por cidade
    $("#lista-cidades").innerHTML = C.cidades.map((c) => {
      const u = unidades[c.unidade];
      const n = rotas.filter((r) => r.properties.municipio === c.nome).length;
      return '<label class="opcao"><input type="checkbox" data-cidade="' + esc(c.nome) + '"><img alt="" src="' + esc(asset(u ? u.escudo : regiao.escudo)) +
        '"><span class="opcao-texto"><b>' + esc(c.nome) + "</b><small>" + esc(u ? u.nome : "") + '</small></span><span class="opcao-num">' + n + " rotas</span></label>";
    }).join("") + '<button class="btn" id="btn-todas-cidades">Todas as cidades</button>';
    $$("#lista-cidades input").forEach((inp) => inp.addEventListener("change", () => definirCidades($$("#lista-cidades input").filter((f) => f.checked).map((f) => f.dataset.cidade))));
    $("#btn-todas-cidades").addEventListener("click", () => definirCidades(C.cidades.map((c) => c.nome)));

    // busca
    $("#busca-rota").addEventListener("input", (e) => { estado.busca = e.target.value; renderLista(); });

    // camadas e mapa base
    if (C.mapaBaseDisponivel) {
      $("#seg-mapa-base").innerHTML = Object.entries(C.mapaBase.opcoes).map(([k, v]) => '<button role="radio" data-base="' + k + '" aria-checked="' + (k === estado.base) + '">' + esc(v.rotulo) + "</button>").join("");
      $$("#seg-mapa-base button").forEach((b) => b.addEventListener("click", () => trocarBase(b.dataset.base)));
      $("#chk-relevo").addEventListener("change", (e) => { estado.relevo = e.target.checked; aplicarRelevo(); });
    } else {
      $("#bloco-mapa-base").hidden = true;
      $("#aviso-sem-base").hidden = false;
    }
    $("#chk-fluxo").checked = estado.fluxo;
    $("#chk-fluxo").addEventListener("change", (e) => { estado.fluxo = e.target.checked; sincronizarCamadas(); });
    [["#chk-rotas", "rotas"], ["#chk-destinos", "destinos"], ["#chk-origens", "origens"]].forEach(([s, k]) =>
      $(s).addEventListener("change", (e) => { estado.camadas[k] = e.target.checked; sincronizarCamadas(); atualizarDestaque(); }));

    renderLegenda();
    aplicarFiltros(false);
  }

  function sincronizarSeletores() {
    $$("#lista-cidades input").forEach((f) => { f.checked = estado.modo === "cidade" && estado.cidades.has(f.dataset.cidade); });
    $$("#lista-unidades input[data-de]").forEach((f) => { f.checked = estado.modo === "unidade" && estado.unidades.has(f.dataset.unidade); });
    $$("#lista-unidades input[data-pai]").forEach((p) => {
      const fs = $$('#lista-unidades input[data-de="' + p.dataset.unidade + '"]');
      const n = fs.filter((f) => f.checked).length;
      p.checked = n > 0 && n === fs.length; p.indeterminate = n > 0 && n < fs.length;
    });
  }

  function renderLista() {
    const q = semAcento(estado.busca.trim());
    const lista = visRotas.filter((f) => !q || f.properties.destinos.some((d) => semAcento(d).includes(q)) || semAcento(f.properties.rota).includes(q));
    $("#lista-contagem").textContent = lista.length + (lista.length === 1 ? " rota" : " rotas") + (q ? (lista.length === 1 ? " encontrada" : " encontradas") : "");
    let html = "", cid = null;
    lista.forEach((f) => {
      const p = f.properties;
      if (p.municipio !== cid) { cid = p.municipio; html += '<li class="grupo-cidade">' + esc(cid) + "</li>"; }
      const extra = p.destinos.length > 1 ? " e mais " + (p.destinos.length - 1) : "";
      html += '<li><button class="item-rota' + (p.id === estado.rotaSel ? " sel" : "") + '" data-id="' + esc(p.id) + '"><span class="dot" style="background:' + corPainel(p.modalidade) + '"></span><span class="nome">' + esc(p.rota) +
        "<small>" + esc(p.destinos[0] || "") + esc(extra) + '</small></span><span class="km">' + nf1.format(p.distancia_km) + " km</span></button></li>";
    });
    $("#lista-rotas").innerHTML = html || '<li class="painel-nota">Nenhuma rota encontrada.</li>';
    $$("#lista-rotas .item-rota").forEach((b) => b.addEventListener("click", () => selecionarRota(b.dataset.id, true)));
  }

  function barrasHTML(grupos, total) {
    return grupos.map((g) => '<div class="barra-ind"><span>' + esc(g.nome) + '</span><span class="valor">' + g.n + (g.n === 1 ? " rota" : " rotas") + ", " + nf1.format(g.km) +
      ' km</span><span class="trilho"><i style="width:' + (total ? (100 * g.n / total).toFixed(1) : 0) + "%;" + (g.cor ? "background:" + g.cor : "") + '"></i></span></div>').join("");
  }
  function agrupar(chave, rotulo, cor) {
    const m = new Map();
    visRotas.forEach((f) => {
      const k = f.properties[chave];
      if (!m.has(k)) m.set(k, { nome: rotulo(k), n: 0, km: 0, cor: cor ? cor(k) : null });
      const g = m.get(k); g.n++; g.km += f.properties.distancia_km;
    });
    return Array.from(m.values());
  }
  function renderIndicadores() {
    const km = visRotas.reduce((s, f) => s + f.properties.distancia_km, 0);
    const min = visRotas.reduce((s, f) => s + (f.properties.tempo_min || 0), 0);
    $("#ind-grade").innerHTML = [["Rotas", nf0.format(visRotas.length)], ["Destinos", nf0.format(visDestinos.length)], ["Km total", nf1.format(km)], ["Tempo total", fmtTempo(min)]]
      .map(([r, v]) => '<div class="ind"><b>' + v + "</b><span>" + r + "</span></div>").join("");
    const total = visRotas.length;
    $("#ind-modalidade").innerHTML = barrasHTML(agrupar("modalidade", (k) => modalidade(k).rotulo, (k) => corPainel(k)), total);
    $("#ind-cidade").innerHTML = barrasHTML(agrupar("municipio", (k) => k), total);
    $("#ind-unidade").innerHTML = barrasHTML(agrupar("unidade", (k) => (unidades[k] ? unidades[k].nome : k)), total);
    if (!visRotas.length) { $("#ind-extremos").innerHTML = '<p class="painel-nota">Nenhuma rota no filtro atual.</p>'; return; }
    const ord = [...visRotas].sort((a, b) => b.properties.distancia_km - a.properties.distancia_km);
    const item = (tag, f) => '<button class="extremo" data-rota="' + esc(f.properties.id) + '"><span class="tag">' + tag + '</span><span class="nome">' + esc(f.properties.rota) + ", " + esc(f.properties.municipio) +
      "<br><small>" + esc(f.properties.destinos[0]) + '</small></span><span class="km">' + nf1.format(f.properties.distancia_km) + " km</span></button>";
    $("#ind-extremos").innerHTML = item("Maior", ord[0]) + item("Menor", ord[ord.length - 1]);
    $$("#ind-extremos .extremo").forEach((b) => b.addEventListener("click", () => selecionarRota(b.dataset.rota, true)));
  }

  window.mapaEscolta = { estado, get mapa() { return mapa; }, get rotasVisiveis() { return visRotas.length; }, get destinosVisiveis() { return visDestinos.length; },
    selecionarRota, definirCidades, definirUnidades, definirGeral, trocarBase };
  document.addEventListener("DOMContentLoaded", iniciar);
})();
