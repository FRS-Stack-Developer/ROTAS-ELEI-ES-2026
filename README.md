# Mapa digital das rotas de escolta de urnas, Eleições 2026, 3ª RPM

Mapa interativo que mostra como foi feita a escolta das urnas eletrônicas em Ouro Preto, Mariana e Itabirito (52º BPM) nas Eleições 2026, com três modos, escolhidos no canto superior direito:

- **Cenário atual:** as rotas lançadas no sistema em 2026, fiéis à planilha.
- **Cenário otimizado:** locais próximos juntos numa mesma rota pela **regra B** (até 4 locais por rota, até 90 min até a última entrega, no máximo 15 min entre um local e outro, 10 min de parada em cada entrega). Cada rota otimizada corresponde a uma equipe de escolta, com o veículo do TRE seguindo a mesma rota. O painel de Indicadores compara os dois cenários por cidade.
- **Simulador:** ajuste a regra (locais por rota, tempos, parada, urnas) e veja as rotas se refazerem na hora, com a economia em relação ao atual e ao otimizado. Dá para mudar um local de rota clicando nele, traçar as rotas pelas vias e exportar a simulação em planilha.

Endereços diretos: acrescente `#otimizado` ou `#simulador` ao final do link para abrir nesse modo.

O que o mapa mostra:

- 3 pontos de origem, um por cidade, com o escudo da unidade.
- 131 destinos (locais de votação), todos com rota: as 122 rotas de escolta de 2026 da planilha, desenhadas pelo traçado real das vias, mais uma rota criada para cada local que não aparece na planilha de 2026.
- Rotas em amarelo. Rotas com problema detectado em vermelho, com o local marcado por um anel vermelho e a descrição do problema no cartão e no painel de Indicadores.
- Problema detectado: local sem rota na planilha de 2026 (rota criada no mapa), traçado pelas vias que termina a mais de 100 m do local, menos urnas entregues do que seções do TSE (possível entrega não lançada no sistema), rota não calculada ou pendência em aberto na aba PENDENCIAS.
- Quando a escola fica fora de uma via mapeada, o trecho final até ela aparece tracejado, para que todo local tenha a rota chegando nele.
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
  js/app.js                funcionamento do mapa, dos cenários e do simulador
  js/roteirizador.js       método de otimização usado pelo simulador (o mesmo do otimizar.py)
  js/config.js             cores, cidades, unidades, mapas base, cenários, regra do simulador e campos dos cartões
  data/cenario-atual.geojson   origens, destinos e rotas (gerado pelo script)
  data/cenario-otimizado.geojson  rotas do cenário otimizado (gerado pelo script)
  data/matriz.json         tempo e distância pelas vias entre os locais, usada pelo simulador (gerado pelo script)
  data/unidades.json       unidades e escudos (gerado pelo script)
  assets/escudos/          escudo da 3ª RPM e do 52º BPM
  assets/fontes/           fonte Rawline (woff2)
  assets/lib/leaflet-1.9.4/  biblioteca Leaflet, usada no arquivo único
  assets/favicon.png
  scripts/gerar_dados.py   lê a planilha, calcula as rotas e gera os arquivos de data/
  scripts/otimizar.py      monta o cenário otimizado (regra B) e grava nas abas ROTAS_OTIMIZADO e PARADAS_OTIMIZADO
  scripts/montar_arquivo_unico.py  junta tudo no arquivo único
  scripts/matriz_cache.json  matriz de tempo e distância já calculada
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
   O `--tse` é opcional: com ele, o script compara as urnas entregues em cada local com as seções que funcionam no TSE e marca problema quando faltam urnas.
3. O script mostra quantas rotas e destinos gerou por cidade e lista as pendências (local sem coordenada, rota não calculada).
4. Para atualizar também o arquivo único (o de duplo clique), rode:
   ```
   python scripts/montar_arquivo_unico.py
   ```
5. Suba de novo os arquivos da pasta `data/`, o `scripts/cache_rotas.json` e o `mapa-escolta-urnas-3rpm.html` para o GitHub.

Como funciona o cálculo das rotas:

- O traçado vem do OSRM (servidor público `router.project-osrm.org`, perfil carro). Cada traçado calculado fica guardado em `scripts/cache_rotas.json` e não é pedido de novo.
- Só são calculadas rotas novas ou que mudaram de coordenada. Sem internet, ou com `--sem-rede`, a rota nova sai como linha reta tracejada e marcada como **rota não calculada**.
- Todo local da aba `LOCAIS` recebe uma rota. O local que não aparece em `PARADAS_2026` ganha uma rota criada da origem da cidade até ele (identificada como `ROTA CRIADA` e marcada como problema).
- O trecho final até o local é desenhado tracejado quando o traçado pelas vias termina a 15 m ou mais dele; a partir de 100 m a rota é marcada como problema. Os dois limites ficam no início do `scripts/gerar_dados.py` (`LIGACAO_MIN_M` e `LIGACAO_PROBLEMA_M`).
- Pendência em aberto na aba `PENDENCIAS` (coluna `RESOLVIDO` diferente de SIM) também marca a rota do local como problema.
- A modalidade de escolta vem da coluna `MODALIDADE` da aba `ROTAS_2026`, com os valores `VIATURA PM` ou `EMBARCADO TRE`. Em branco, a rota aparece como "modalidade não informada" no cartão.
- Os campos sensíveis (equipe, viatura, placa, horários, nomes de militares, telefones) nunca são exportados para os arquivos do site. No `js/config.js`, a opção `ocultarCamposSensiveis` também os esconde dos cartões.

### Cenário otimizado

O cenário otimizado fica gravado na própria planilha base, nas abas `ROTAS_OTIMIZADO` e `PARADAS_OTIMIZADO` (os parâmetros usados ficam em `OTIMIZACAO_PARAMETROS`). Dá para revisar e mexer à mão nessas abas.

1. Para recalcular pela regra B (ou por outra regra):
   ```
   python scripts/otimizar.py --planilha "...\BASE_OTIMIZACAO_ROTAS_URNAS_2026.xlsx"
   python scripts/otimizar.py --planilha "..." --paradas 5 --ida 100 --salto 20 --parada 10 --urnas 0
   ```
2. Para usar uma simulação feita no mapa (botão "Exportar planilha" do simulador):
   ```
   python scripts/otimizar.py --planilha "..." --importar simulacao-rotas-escolta-4locais-90min-15min.csv
   ```
3. Depois, gere os dados do cenário e o arquivo único:
   ```
   python scripts/gerar_dados.py --planilha "..." --cenario otimizado
   python scripts/montar_arquivo_unico.py
   ```

Como o otimizador decide: começa com uma rota por local e vai juntando os pares de rotas que mais economizam quilômetros (método das economias de Clarke e Wright), sempre dentro da mesma cidade e respeitando os limites da regra. Depois escolhe a melhor ordem de visita de cada rota. Os tempos e distâncias vêm do OSRM pelas vias (matriz em `scripts/matriz_cache.json`, recalculada só quando uma coordenada muda). O simulador do mapa usa exatamente o mesmo método, por isso, com a regra B, ele reproduz o cenário otimizado.

Km e horas de equipe, nos indicadores e no simulador, contam a ida, as paradas e a volta à origem.

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
