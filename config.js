/* Configuração do mapa. Edite aqui cores, cidades, unidades, mapas base e campos dos cartões. */
window.CONFIG = {
  titulo: "Escolta de Urnas",
  subtitulo: "Eleições 2026",
  regiao: { nome: "3ª RPM", escudo: "assets/escudos/3rpm.webp" },

  /* Cenários disponíveis. O primeiro é aberto por padrão.
     Para comparar depois, acrescente { id: "otimizado", nome: "Cenário otimizado", arquivo: "data/cenario-otimizado.geojson" } */
  cenarios: [
    { id: "atual", nome: "Cenário atual", arquivo: "data/cenario-atual.geojson" }
  ],
  arquivoUnidades: "data/unidades.json",

  cidades: [
    { nome: "Ouro Preto", unidade: "248cia" },
    { nome: "Mariana", unidade: "239cia" },
    { nome: "Itabirito", unidade: "250cia" }
  ],

  /* Modalidades de escolta (valor gerado pelo script a partir da coluna MODALIDADE da planilha).
     "cor" é usada sobre os mapas claros (ruas, claro, satélite); "corClara" sobre o mapa escuro e no painel. */
  modalidades: {
    VIATURA_PM:    { rotulo: "Viatura PM",                  cor: "#B07D12", corClara: "#D9B45A" },
    EMBARCADO_TRE: { rotulo: "Embarcado no veículo do TRE", cor: "#1565C0", corClara: "#5FB3E8" },
    NAO_INFORMADA: { rotulo: "Modalidade não informada",    cor: "#5B4A2E", corClara: "#CFC7B4" }
  },

  /* Rota selecionada: cor própria, mais grossa e com a animação do sentido.
     As demais ficam transparentes (0 = some, 1 = sem transparência) e os destinos fora da rota ficam apagados. */
  selecao: { cor: "#E0182D", opacidadeNaoSelecionadas: 0.38, opacidadeDestinosFora: 0.45 },

  /* Mapas base (camadas de imagens, como no Leaflet do PPAG). "ruas" é o padrão.
     Com o arquivo aberto direto da pasta (duplo clique) não existe site de origem, e alguns servidores recusam:
     o OpenStreetMap mostra "Access blocked" e a CARTO mostra "API KEY REQUIRED". Por isso "semServidor"
     define o mapa usado nesse caso (Esri, que não exige site de origem). Publicado num site, vale "camadas". */
  mapaBase: {
    padrao: "ruas",
    opcoes: {
      ruas: { rotulo: "Ruas", escuro: false,
        camadas: [{ url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", maxZoom: 19,
          atribuicao: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }],
        semServidor: [{ url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", maxZoom: 19,
          atribuicao: "Mapa &copy; Esri, HERE, Garmin, USGS, OpenStreetMap" }] },
      satelite: { rotulo: "Satélite", escuro: false,
        camadas: [
          { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", maxZoom: 19,
            atribuicao: "Imagens &copy; Esri, Maxar, Earthstar Geographics" },
          { url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}", maxZoom: 19, opacidade: 0.75 },
          { url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", maxZoom: 19 }
        ] },
      claro: { rotulo: "Claro", escuro: false,
        camadas: [
          { url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", maxZoom: 16,
            atribuicao: "Mapa &copy; Esri, HERE, Garmin, OpenStreetMap" },
          { url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}", maxZoom: 16 }
        ] },
      escuro: { rotulo: "Escuro", escuro: true,
        camadas: [
          { url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", maxZoom: 16,
            atribuicao: "Mapa &copy; Esri, HERE, Garmin, OpenStreetMap" },
          { url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", maxZoom: 16 }
        ] }
    }
  },
  /* Relevo sombreado por cima do mapa base (opcional, desligado ao abrir) */
  relevo: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}",
    maxZoom: 16, opacidade: 0.45, atribuicao: "Relevo &copy; Esri"
  },
  /* false quando não há acesso a mapas externos (ex.: prévia dentro do Claude) */
  mapaBaseDisponivel: true,

  /* Campos sensíveis: ficam ocultos por padrão na versão publicada.
     O script gerar_dados.py também não exporta esses campos para os arquivos de dados. */
  ocultarCamposSensiveis: true,
  camposSensiveis: ["equipe", "viatura", "placa", "horario", "horarios", "comandante", "militares", "telefone"],

  /* Campos exibidos nos cartões, na ordem. "campo" é a propriedade no GeoJSON. */
  cartoes: {
    rota: [
      { campo: "municipio", rotulo: "Cidade" },
      { campo: "origem", rotulo: "Origem" },
      { campo: "distancia_km", rotulo: "Distância", formato: "km" },
      { campo: "tempo_min", rotulo: "Tempo estimado", formato: "tempo" },
      { campo: "urnas", rotulo: "Urnas" }
    ],
    destino: [
      { campo: "endereco", rotulo: "Endereço" },
      { campo: "bairro", rotulo: "Bairro" },
      { campo: "municipio", rotulo: "Cidade" },
      { campo: "urnas", rotulo: "Urnas" }
    ],
    origem: [
      { campo: "endereco", rotulo: "Endereço" },
      { campo: "bairro", rotulo: "Bairro" },
      { campo: "municipio", rotulo: "Cidade" }
    ]
  },

  /* Animação do sentido (origem para destino). Com rota selecionada, só ela anima. */
  animacaoFluxo: true
};
