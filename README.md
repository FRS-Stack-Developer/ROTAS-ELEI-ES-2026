# Mapa digital das rotas de escolta de urnas, Eleições 2026, 3ª RPM

Mapa interativo que mostra como foi feita a escolta das urnas eletrônicas em Ouro Preto, Mariana e Itabirito (52º BPM) nas Eleições 2026. Nesta etapa o mapa retrata apenas o **cenário atual**, fiel à planilha. A estrutura já está pronta para receber um segundo cenário (otimizado) e comparar os dois.

O que o mapa mostra:

- 3 pontos de origem, um por cidade, com o escudo da unidade.
- Os locais de votação das demais UEOp da 3ª RPM e de Diogo de Vasconcelos (52º BPM), só os pontos, ainda sem rotas: vêm da planilha do TSE (`--tse`), apenas os com situação ATIVO. A UEOp de cada município segue a aba "Resumo por município". Locais sem coordenada, ou com coordenada fora das áreas das UEOp, não entram e são listados pelo script.
- Todos os 418 locais de votação com situação ATIVO dos 18 municípios (sede, distritos, povoados e zona rural), conforme a planilha do TSE. Os que vêm sem coordenada, ou com coordenada errada, usam a aba `COORD_TSE` da planilha base (coordenada aproximada pelo CEP ou pela rua, em amarelo no mapa até ser conferida: marcar SIM em `CONFERIDO`).
- Chaves para ligar e desligar os locais de votação de cada UEOp (painel de Camadas) e, na parte de baixo do mapa, cartões com o total de locais de votação e de eleitores da 3ª RPM e de cada UEOp. Clicar no cartão liga ou desliga os pontos daquela UEOp.
- Os cartórios eleitorais das outras UEOp da 3ª RPM (1ª Cia PM Ind, 35º BPM, 36º BPM, 61º BPM e 8ª Cia PM Ind), com o escudo de cada uma. Ficam na aba `PONTOS_SAIDA` (colunas extras `ZONA_ELEITORAL`, `MUNICIPIOS_ATENDIDOS`, `TELEFONE`, `EMAIL` e `FONTE`) e aparecem no mapa sem rotas. Os endereços vêm da consulta oficial do TRE-MG (cartorios-eleitorais.tre-mg.jus.br).
- 131 destinos (locais de votação), todos com rota: as 122 rotas de escolta de 2026 da planilha, desenhadas pelo traçado real das vias, mais uma rota criada para cada local que não aparece na planilha de 2026.
- Cores das rotas:
  - **Verde**: rota de escolta da planilha de 2026, sem problema.
  - **Vermelho**: rota que não existia nos registros (local sem rota na planilha de 2026), criada no mapa da origem da cidade até o local.
  - **Amarelo**: problema de georreferenciamento: o traçado pelas vias termina a 100 m ou mais do local (via não mapeada ou coordenada a conferir), coordenada com pendência em aberto na aba PENDENCIAS ou rota não calculada.
  - O local com problema aparece com o ponto na mesma cor, e a descrição fica no cartão e no painel de Indicadores.
- Avisos que não mudam a cor: menos urnas entregues do que seções do TSE (possível entrega não lançada no sistema) e outras pendências em aberto.
- Quando a escola fica fora de uma via mapeada, o trecho final até ela aparece tracejado, para que todo local tenha a rota chegando nele.
- Limites das áreas das UEOp da 3ª RPM (52º BPM, 1ª Cia PM Ind, 35º BPM, 36º BPM, 61º BPM e 8ª Cia PM Ind): só as linhas de divisa, sem preenchimento, com o nome de cada área. A cor da linha acompanha o mapa de fundo: escura em Ruas, Relevo e Claro, branca em Satélite e Escuro (ajustável em `js/config.js`, `ueops.estiloPorMapa`). A área do 52º BPM tem a linha um pouco mais grossa. Liga e desliga no painel de Camadas.
- Animação do sentido do deslocamento (origem para destino).
- Rota selecionada em azul, com o sentido animado e as paradas numeradas na ordem. As demais rotas ficam transparentes e param de animar.
- Lista de rotas com a opção de mostrar só as rotas com problema.
- Filtros por visão geral da 3ª RPM, por unidade (52º BPM e Cias) e por cidade, com enquadramento automático.
- Lista de rotas com busca pelo nome do destino, cartões de detalhe e painel de indicadores.
- Mapa real de fundo com a mesma tecnologia do painel do PPAG (Leaflet com OpenStreetMap), trocado pelo seletor no canto superior direito do mapa: Ruas, Satélite (com nomes), Relevo (curvas de nível e sombreado), Claro e Escuro, mais a opção de sombreado do relevo por cima de qualquer mapa.

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
   python scripts/gerar_dados.py --planilha "C:\Users\SEU_USUARIO\Desktop\ROTAS OURO PRETO\BASE_OTIMIZACAO_ROTAS_URNAS_2026.xlsx" --tse "C:\Users\SEU_USUARIO\Desktop\ROTAS OURO PRETO\Secoes_eleitorais_2026_18municipios.xlsx"
   ```
   O `--tse` é opcional: com ele, o script compara as urnas entregues em cada local com as seções que funcionam no TSE e anota um aviso quando faltam urnas.
3. O script mostra quantas rotas e destinos gerou por cidade e lista as pendências (local sem coordenada, rota não calculada).
4. Se o arquivo de limites das UEOp mudar (UEOPS.geojson exportado do Google Earth), rode:
   ```
   python scripts/gerar_ueops.py --arquivo "C:\Users\SEU_USUARIO\Desktop\ROTAS OURO PRETO\UEOPS.geojson"
   ```
   O script grava `data/ueops.geojson` com o desenho simplificado (precisão de cerca de 10 m) e só o nome de cada área.
5. Para atualizar também o arquivo único (o de duplo clique), rode:
   ```
   python scripts/montar_arquivo_unico.py
   ```
6. Suba de novo os arquivos da pasta `data/`, o `scripts/cache_rotas.json` e o `mapa-escolta-urnas-3rpm.html` para o GitHub.

Como funciona o cálculo das rotas:

- O traçado vem do OSRM (servidor público `router.project-osrm.org`, perfil carro). Cada traçado calculado fica guardado em `scripts/cache_rotas.json` e não é pedido de novo.
- Só são calculadas rotas novas ou que mudaram de coordenada. Sem internet, ou com `--sem-rede`, a rota nova sai como linha reta tracejada e marcada como **rota não calculada**.
- Todo local da aba `LOCAIS` recebe uma rota. O local que não aparece em `PARADAS_2026` ganha uma rota criada da origem da cidade até ele (identificada como `ROTA CRIADA` e desenhada em vermelho).
- O trecho final até o local é desenhado tracejado quando o traçado pelas vias termina a 15 m ou mais dele; a partir de 100 m a rota fica amarela (problema de georreferenciamento). Os dois limites ficam no início do `scripts/gerar_dados.py` (`LIGACAO_MIN_M` e `LIGACAO_PROBLEMA_M`).
- Pendência em aberto na aba `PENDENCIAS` (coluna `RESOLVIDO` diferente de SIM) com tipo de coordenada deixa a rota amarela; os outros tipos entram como aviso.
- As cores ficam no `js/config.js` (`cores`).
- A modalidade de escolta vem da coluna `MODALIDADE` da aba `ROTAS_2026`, com os valores `VIATURA PM` ou `EMBARCADO TRE`. Em branco, a rota aparece como "modalidade não informada" no cartão.
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
- Mapas base: OpenStreetMap (ruas, no site publicado), Esri World Street Map (ruas, no arquivo aberto da pasta), OpenTopoMap (relevo, com Esri World Topo Map como reserva automática se o OpenTopoMap não responder), Esri World Light Gray e World Dark Gray (claro e escuro) e Esri World Imagery, World Transportation e World Boundaries and Places (satélite com nomes).
- Sombreado do relevo: Esri World Hillshade.
- Traçado das rotas: OSRM, com dados OpenStreetMap.
- Locais de votação: TSE, arquivo de 10/09/2026.
- Fonte Rawline (derivada da Raleway, SIL Open Font License).
- Escudos: Polícia Militar de Minas Gerais, 3ª RPM e 52º BPM.
