# Mapa digital das rotas de escolta de urnas, Eleições 2026, 3ª RPM

Mapa interativo que mostra como foi feita a escolta das urnas eletrônicas em Ouro Preto, Mariana e Itabirito (52º BPM) nas Eleições 2026. Nesta etapa o mapa retrata apenas o **cenário atual**, fiel à planilha. A estrutura já está pronta para receber um segundo cenário (otimizado) e comparar os dois.

O que o mapa mostra:

- 3 pontos de origem, um por cidade, com o escudo da unidade.
- 131 destinos (locais de votação) e 122 rotas de escolta de 2026, desenhadas pelo traçado real das vias.
- Animação do sentido do deslocamento (origem para destino).
- Rota selecionada em vermelho, com o sentido animado e as paradas numeradas na ordem. As demais rotas ficam transparentes e param de animar.
- Cor da rota conforme a modalidade de escolta: viatura PM, policial embarcado no veículo do TRE ou modalidade não informada.
- Filtros por visão geral da 3ª RPM, por unidade (52º BPM e Cias) e por cidade, com enquadramento automático.
- Lista de rotas com busca pelo nome do destino, cartões de detalhe e painel de indicadores.
- Mapa real de fundo com a mesma tecnologia do painel do PPAG (Leaflet com OpenStreetMap): ruas, satélite, claro ou escuro, com relevo sombreado opcional.

## Estrutura da pasta

```
mapa-escolta-urnas-3rpm/
  mapa-escolta-urnas-3rpm.html  arquivo único: abre com duplo clique (gerado pelo script)
  index.html               página do mapa (versão site)
  css/estilo.css           visual (paleta caqui e preto, fonte Rawline)
  js/app.js                funcionamento do mapa
  js/config.js             cores, cidades, unidades, mapas base e campos dos cartões
  data/cenario-atual.geojson   origens, destinos e rotas (gerado pelo script)
  data/unidades.json       unidades e escudos (gerado pelo script)
  assets/escudos/          escudo da 3ª RPM e do 52º BPM
  assets/fontes/           fonte Rawline (woff2)
  assets/lib/leaflet-1.9.4/  biblioteca Leaflet, usada no arquivo único
  assets/favicon.png
  scripts/gerar_dados.py   lê a planilha, calcula as rotas e gera os arquivos de data/
  scripts/montar_arquivo_unico.py  junta tudo no arquivo único
  scripts/cache_rotas.json traçados já calculados (evita recalcular)
  README.md
  .nojekyll
  .gitignore
```

## Como publicar no GitHub Pages

1. Crie uma conta em https://github.com, se ainda não tiver.
2. Clique em **New repository**, dê um nome sem acento e sem espaço (por exemplo `mapa-escolta-urnas-3rpm`) e clique em **Create repository**.
3. Na página do repositório, clique em **uploading an existing file** (ou **Add file > Upload files**).
4. Arraste **todo o conteúdo** desta pasta (os arquivos e as pastas `css`, `js`, `data`, `assets` e `scripts`), não a pasta em si. O arquivo `.nojekyll` também deve ir. Se ele não aparecer no Windows, crie no GitHub um arquivo vazio com esse nome em **Add file > Create new file**.
5. Clique em **Commit changes**.
6. Vá em **Settings > Pages**. Em **Build and deployment**, escolha **Deploy from a branch**, branch **main**, pasta **/(root)**, e clique em **Save**.
7. Aguarde 1 ou 2 minutos. O endereço aparece no topo da página de Pages, no formato `https://SEU-USUARIO.github.io/mapa-escolta-urnas-3rpm/`.

Todos os caminhos do site são relativos, por isso ele funciona dentro da subpasta do repositório.

**Atenção:** em contas gratuitas, um site do GitHub Pages é público, mesmo que o repositório seja privado. Antes de publicar, confirme se as rotas de escolta podem ficar acessíveis a qualquer pessoa com o link.

## Como atualizar os dados quando a planilha mudar

A fonte dos dados é a planilha `BASE_OTIMIZACAO_ROTAS_URNAS_2026.xlsx`, com as abas `PONTOS_SAIDA`, `LOCAIS`, `ROTAS_2026` e `PARADAS_2026`. A planilha **não** vai para o repositório (está no `.gitignore`).

1. Instale o Python 3 (https://www.python.org) e, no terminal, rode uma vez:
   ```
   pip install openpyxl
   ```
2. Na pasta do projeto, rode:
   ```
   python scripts/gerar_dados.py --planilha "C:\Users\SEU_USUARIO\Desktop\ROTAS OURO PRETO\BASE_OTIMIZACAO_ROTAS_URNAS_2026.xlsx"
   ```
3. O script mostra quantas rotas e destinos gerou por cidade e lista as pendências (local sem coordenada, rota não calculada).
4. Para atualizar também o arquivo único (o de duplo clique), rode:
   ```
   python scripts/montar_arquivo_unico.py
   ```
5. Suba de novo os arquivos da pasta `data/`, o `scripts/cache_rotas.json` e o `mapa-escolta-urnas-3rpm.html` para o GitHub.

Como funciona o cálculo das rotas:

- O traçado vem do OSRM (servidor público `router.project-osrm.org`, perfil carro). Cada traçado calculado fica guardado em `scripts/cache_rotas.json` e não é pedido de novo.
- Só são calculadas rotas novas ou que mudaram de coordenada. Sem internet, ou com `--sem-rede`, a rota nova sai como linha reta tracejada e marcada como **rota não calculada**.
- A modalidade de escolta vem da coluna `MODALIDADE` da aba `ROTAS_2026`, com os valores `VIATURA PM` ou `EMBARCADO TRE`. Em branco, a rota aparece como "modalidade não informada".
- Os campos sensíveis (equipe, viatura, placa, horários, nomes de militares, telefones) nunca são exportados para os arquivos do site. No `js/config.js`, a opção `ocultarCamposSensiveis` também os esconde dos cartões.

### Cenário otimizado (etapa futura)

Gere o segundo cenário com `--cenario otimizado`, o que cria `data/cenario-otimizado.geojson` no mesmo formato. Depois acrescente o cenário na lista `cenarios` do `js/config.js`.

## Como abrir no computador

O jeito mais simples é dar **duplo clique** no arquivo `mapa-escolta-urnas-3rpm.html`. Ele já traz dentro os dados, os escudos, a fonte e a biblioteca do mapa. Só o mapa de fundo vem da internet, então o computador precisa estar conectado.

Aberto direto da pasta, o mapa de ruas é o da Esri (World Street Map). O servidor do OpenStreetMap recusa pedidos que não vêm de um site e mostra "Access blocked" no lugar do mapa; a CARTO faz o mesmo com "API KEY REQUIRED". Publicado no GitHub Pages ou aberto por um servidor, o mapa de ruas passa a ser o OpenStreetMap padrão, igual ao do PPAG.

Para testar a versão site (`index.html`), abrir direto não funciona, porque o navegador bloqueia a leitura dos arquivos JSON. Use um servidor simples:

1. Abra o terminal na pasta **acima** de `mapa-escolta-urnas-3rpm`.
2. Rode:
   ```
   python -m http.server 8000
   ```
3. Acesse `http://localhost:8000/mapa-escolta-urnas-3rpm/`. É o mesmo formato de subpasta do GitHub Pages.

## Créditos e licenças

- Mapa: Leaflet 1.9.4 (licença BSD de 2 cláusulas, texto em `assets/lib/leaflet-1.9.4/LICENSE`).
- Mapas base: OpenStreetMap (ruas, no site publicado), Esri World Street Map (ruas, no arquivo aberto da pasta), Esri World Light Gray e World Dark Gray (claro e escuro) e Esri World Imagery, World Transportation e World Boundaries and Places (satélite com nomes).
- Relevo sombreado: Esri World Hillshade.
- Traçado das rotas: OSRM, com dados OpenStreetMap.
- Locais de votação: TSE, arquivo de 10/09/2026.
- Fonte Rawline (derivada da Raleway, SIL Open Font License).
- Escudos: Polícia Militar de Minas Gerais, 3ª RPM e 52º BPM.
