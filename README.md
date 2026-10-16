# Mapa digital das rotas de escolta de urnas, Eleições 2026, 3ª RPM

Mapa interativo que mostra como foi feita a escolta das urnas eletrônicas nas Eleições 2026 na 3ª RPM: Ouro Preto, Mariana, Itabirito e Diogo de Vasconcelos (52º BPM), Nova Lima, Raposos e Rio Acima (1ª Cia PM Ind), Santa Luzia (35º BPM), Caeté, Nova União, Sabará e Taquaraçu de Minas (61º BPM), Vespasiano e São José da Lapa (36º BPM) e Lagoa Santa e Confins (8ª Cia PM Ind). Nesta etapa o mapa retrata apenas o **cenário atual**, fiel às planilhas. A estrutura já está pronta para receber um segundo cenário (otimizado) e comparar os dois.

O que o mapa mostra:

- Origem das rotas com o escudo da unidade: os 3 pontos de partida do 52º BPM (Ouro Preto, Mariana e Itabirito) e, nas outras UEOp, o cartório eleitoral da zona. As capturas do sistema dessas UEOp não mostram o local de partida: o cartório é a **origem presumida** (194ª Zona, em Nova Lima, para Nova Lima, Raposos e Rio Acima; 56ª, em Caeté, para Caeté, Nova União e Taquaraçu de Minas; 241ª, em Sabará; 246ª e 312ª, em Santa Luzia, cada uma para as rotas da sua zona; 311ª, em Vespasiano, para Vespasiano e São José da Lapa). O cartão da rota e o do cartório avisam isso. Em Lagoa Santa a saída não é presumida: o papel do cartório da 157ª Zona mostra as Rotas A e B (as 2 rotas da 8ª Cia PM Ind) saindo do cartório. Em Confins também não: as urnas saem do cartório da 215ª Zona, em Pedro Leopoldo, como informou a 3ª RPM. Nos dois casos a coluna `ORIGEM_CONFIRMADA` da aba `PONTOS_SAIDA` traz SIM e a fonte, que aparece no cartão.
- Os locais de votação ainda sem rotas no mapa, só os pontos: vêm da planilha do TSE (`--tse`), apenas os com situação ATIVO que não estão na aba LOCAIS (Jaboticatubas e Santana do Riacho, da 8ª Cia PM Ind; e os demais locais de Lagoa Santa, com escolta da Aeronáutica (PAMA), sem rota da PM). A escolta feita por outro órgão vem da coluna `ESCOLTA_DEMAIS_LOCAIS` do cartório da zona e aparece no cartão do local. A UEOp de cada município segue a aba "Resumo por município". Locais sem coordenada, ou com coordenada fora das áreas das UEOp, não entram e são listados pelo script.
- As 6 rotas de Diogo de Vasconcelos (171ª Zona), transcritas das capturas da pasta ROTAS DIOGO DE VASCONCELOS. As capturas não mostram o local de partida: no mapa, as rotas saem do ponto de partida de Mariana (MRN-S1), pelos horários (cerca de 1 h até a primeira entrega). Ficam com a Cia desse ponto de saída enquanto a coluna CIA da aba ROTAS_2026 estiver em branco.
- As 82 rotas das outras UEOp, transcritas em 14 e 15/10/2026 das capturas das pastas ROTA NOVA LIMA (30 de Nova Lima, 3 de Rio Acima e 4 de Raposos, 1ª Cia PM Ind), ROTA 61 BPM (9 de Caeté, 1 de Nova União, as rotas 09 a 17 de Sabará e 2 de Taquaraçu de Minas, cujo evento está cadastrado no sistema com Município Caeté), ROTAS 35 BPM (22 de Santa Luzia, 12 da 246ª Zona e 10 da 312ª), 8 CIA IND PM (2 de Lagoa Santa e 1 de Confins, com as entregas em 03/10/2026, véspera da eleição) e ROTAS 36 BPM (11 de Vespasiano e 3 de São José da Lapa, cujo evento está cadastrado no sistema com Município Vespasiano). Cada ponto de entrega foi ligado ao local do TSE pelo nome, endereço e bairro, conferido um a um. No 36º BPM, quase todos os pontos vêm sem Referência no sistema: o local foi ligado pelo endereço, pelo bairro, pela quantidade de urnas (igual às seções do TSE) e pelos nomes das escolas nas Observações da Rota; os 45 locais de Vespasiano e São José da Lapa receberam urnas. O Salão Paroquial do Galo Velho, entregue pela rota 30 de Nova Lima, é local de Raposos no TSE. As paradas seguem a ordem real de entrega (hora). Nome, endereço e coordenada dos locais vêm do TSE; em 14/10/2026 as coordenadas sem confirmação anterior foram conferidas no Google Maps, e as diferentes foram corrigidas na aba COORD_TSE (Ceçota Diniz, em Santa Luzia, estava a 3,8 km). Três locais seguem com coordenada a conferir, em amarelo: Centro Municipal de Reabilitação (Rio Acima), Creche Maria das Graças Pimenta (Raposos) e E.M. Manoel Fonseca Viana Sobrinho (Imperial, Vespasiano). As coordenadas da Escola Municipal de Altamira e da Escola Municipal do Carmo (Nova União) foram corrigidas pelo usuário em 15/10/2026. Também em 15/10/2026, 15 locais rurais de Jaboticatubas e Santana do Riacho passaram a usar a coordenada da lista de locais de votação da 8ª Cia PM Ind (a anterior ficava de 185 m a 19,8 km do local; as maiores diferenças foram conferidas no Google Maps).
- Nove locais com situação BLOQUEADO no TSE receberam urnas (Regional Noroeste, em Nova Lima; E.E. Dom Cirilo de Paula Freitas, em Raposos; 6 em Vespasiano; E.E. José Elias Issa, em São José da Lapa): estão no mapa, com aviso no cartão, e ficam fora da conta dos locais ATIVO. Quatro deles, em Vespasiano, vêm sem coordenada no TSE: a posição foi tirada do Google Maps pelo nome da escola (aba COORD_TSE).
- Todos os 418 locais de votação com situação ATIVO dos 18 municípios (sede, distritos, povoados e zona rural), conforme a planilha do TSE. Em 13/10/2026 as coordenadas das demais UEOp (fora o 52º BPM) foram conferidas no Google Maps. Os que vêm sem coordenada, ou com coordenada diferente do Google, usam a aba `COORD_TSE` da planilha base, que substitui a coordenada do TSE no mapa (o arquivo do TSE não é alterado). `CONFERIDO` = SIM: posição do local com o nome da escola no Google Maps. Sem SIM: coordenada aproximada (número da rua, rua ou CEP), em amarelo no mapa até ser conferida.
- Chaves para ligar e desligar os locais de votação de cada UEOp (painel de Camadas) e, numa gaveta escondida na borda direita do mapa (aba "Eleitores", com a seta), cartões com o total de locais de votação e de eleitores da 3ª RPM e de cada UEOp. Clicar no cartão de uma UEOp mostra só ela no mapa (locais de votação, cartório ou pontos de saída e rotas), aproxima e centraliza a área dela e abre as informações embaixo do cartão: locais e eleitores por município (com quantos têm rota no mapa), locais com rota no mapa, escolta feita por outro órgão, locais BLOQUEADO, cartório eleitoral e rotas. O cartão da 3ª RPM também mostra quantos locais ATIVO têm rota. No celular, a gaveta fecha e as informações aparecem no cartão de baixo. O cartão da 3ª RPM volta a mostrar todas as UEOp, com a região inteira na tela. Os números contam os locais com situação ATIVO na planilha do TSE e os eleitores desses mesmos locais; os locais BLOQUEADO (funcionam no dia com as seções já lotadas neles) aparecem à parte em cada cartão: os que receberam urnas estão no mapa, os outros ficam fora.
- Os cartórios eleitorais das outras UEOp da 3ª RPM (1ª Cia PM Ind, 35º BPM, 36º BPM, 61º BPM e 8ª Cia PM Ind), com o escudo de cada uma. Ficam na aba `PONTOS_SAIDA` (colunas extras `ZONA_ELEITORAL`, `MUNICIPIOS_ATENDIDOS`, `TELEFONE`, `EMAIL` e `FONTE`). Os das zonas com rotas são a origem delas (presumida ou confirmada); o da 143ª Zona (Jaboticatubas e Santana do Riacho) aparece sem rotas. O da 215ª Zona fica em Pedro Leopoldo, fora da área da 3ª RPM, e é de onde saem as urnas de Confins (8ª Cia PM Ind); o cartão dele avisa isso. Os endereços vêm da consulta oficial do TRE-MG (cartorios-eleitorais.tre-mg.jus.br) e as coordenadas foram conferidas no Google Maps (a da 246ª Zona, em Santa Luzia, foi informada pelo usuário).
- 373 destinos com rota: os 137 locais do 52º BPM, todos com rota (as 128 rotas de 2026 das capturas, 44 de Ouro Preto, 41 de Mariana, 37 de Itabirito e 6 de Diogo de Vasconcelos, mais uma rota criada para o local de Itabirito que não aparece nos registros), os 210 locais das 97 rotas das outras UEOp (62 da 1ª Cia PM Ind, 52 do 35º BPM, 45 do 61º BPM, 45 do 36º BPM e 6 da 8ª Cia PM Ind) e os 26 locais do 61º BPM sem rota nas capturas do sistema (23 de Sabará, das rotas 01 a 08, que ainda não têm capturas; 2 de Nova União, da Rota 2; e o Presídio de Caeté, que não aparece em nenhuma rota de Caeté), cada um com uma rota criada em vermelho do cartório eleitoral da zona até o local. Na base, esses 26 estão na aba LOCAIS com URNAS em branco (nenhuma entrega lançada) e na aba PENDENCIAS, tipo ROTA SEM CAPTURA. Ao todo, 225 rotas de 2026 e 27 criadas, desenhadas pelo traçado das vias. Distância e tempo das rotas são estimados pelo traçado (OSRM); os totais por cidade, por unidade e geral somam os valores mostrados em cada rota.
- Cores das rotas:
  - **Verde**: rota de escolta da planilha de 2026, sem problema.
  - **Vermelho**: rota que não existia nos registros, criada no mapa até o local: no 52º BPM, local sem rota na planilha de 2026, com a rota saindo da origem da cidade; no 61º BPM, local sem rota nas capturas do sistema, com a rota saindo do cartório eleitoral da zona. O cartão mostra "nenhuma entrega lançada no sistema" e as seções do TSE.
  - **Amarelo**: problema de georreferenciamento: o traçado pelas vias termina a 100 m ou mais do local (via não mapeada ou coordenada a conferir), coordenada com pendência em aberto na aba PENDENCIAS ou rota não calculada.
  - **Lilás**: trajeto presumido da escolta feita pela Aeronáutica (PAMA) nos 26 locais ATIVO de Lagoa Santa fora das rotas da PM. Como o agrupamento das rotas da Aeronáutica não foi informado, cada local tem um trajeto próprio, do cartório eleitoral da 157ª Zona até ele, pelas vias (OSRM). Esses trajetos não são rotas da PM: ficam fora da lista de rotas, dos indicadores e de todas as contagens. Os pontos desses locais também ficam lilás. O clique no trajeto abre o cartão com a distância, o tempo estimado e a explicação; o cartão do local tem o botão "Ver o trajeto". Liga e desliga no painel de Camadas.
  - O local com problema aparece com o ponto na mesma cor, e a descrição fica no cartão e no painel de Indicadores.
- Avisos que não mudam a cor: menos urnas entregues do que seções do TSE (possível entrega não lançada no sistema) e outras pendências em aberto.
- Quando a escola fica fora de uma via mapeada, o trecho final até ela aparece tracejado, para que todo local tenha a rota chegando nele.
- Limites das áreas das UEOp da 3ª RPM (52º BPM, 1ª Cia PM Ind, 35º BPM, 36º BPM, 61º BPM e 8ª Cia PM Ind): só as linhas de divisa, sem preenchimento, com o nome de cada área. A cor da linha acompanha o mapa de fundo: escura em Ruas, Relevo e Claro, branca em Satélite e Escuro (ajustável em `js/config.js`, `ueops.estiloPorMapa`). Com rotas em várias UEOp, nenhuma área fica em destaque; a UEOp escolhida na aba Eleitores ganha a linha mais grossa. Liga e desliga no painel de Camadas.
- Divisa do estado de Minas Gerais, em linha tracejada mais grossa, com as mesmas cores das divisas das UEOp. Afaste o mapa para ver o estado inteiro. Liga e desliga no painel de Camadas. Vem da malha municipal do IBGE (municípios de MG unidos num contorno só).
- Animação do sentido do deslocamento (origem para destino).
- Rota selecionada em azul, com o sentido animado e as paradas numeradas na ordem. As demais rotas ficam transparentes e param de animar.
- Lista de rotas com a opção de mostrar só as rotas com problema.
- Filtros por visão geral da 3ª RPM (a região inteira na tela), por unidade (52º BPM e suas Cias, 1ª Cia PM Ind, 35º BPM, 36º BPM, 61º BPM e 8ª Cia PM Ind) e por cidade, com enquadramento automático.
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
  scripts/embaralhar.cjs   gera a versão embaralhada do arquivo único, para publicar
  scripts/cache_rotas.json traçados já calculados (evita recalcular)
  README.md
  .nojekyll
  .gitignore
```

## Como publicar no GitHub Pages

O site publicado usa só os dois arquivos da pasta PUBLICAR NO GITHUB: o `index.html`, que é o arquivo único na versão embaralhada, e este `README.md`. As pastas `css`, `js`, `data` e `scripts` e o `mapa-escolta-urnas-3rpm.html` ficam só no computador, porque têm o código e os dados legíveis.

1. Crie uma conta em https://github.com, se ainda não tiver.
2. Clique em **New repository**, dê um nome sem acento e sem espaço (por exemplo `mapa-escolta-urnas-3rpm`) e clique em **Create repository**.
3. Na página do repositório, clique em **uploading an existing file** (ou **Add file > Upload files**).
4. Arraste o `index.html` e o `README.md` da pasta PUBLICAR NO GITHUB. Se o repositório tiver as pastas `css`, `js`, `data`, `assets` ou `scripts` de envios antigos, apague-as no GitHub.
5. Clique em **Commit changes**.
6. Vá em **Settings > Pages**. Em **Build and deployment**, escolha **Deploy from a branch**, branch **main**, pasta **/(root)**, e clique em **Save**.
7. Aguarde 1 ou 2 minutos. O endereço aparece no topo da página de Pages, no formato `https://SEU-USUARIO.github.io/mapa-escolta-urnas-3rpm/`.

Todos os caminhos do site são relativos, por isso ele funciona dentro da subpasta do repositório.

**Versão embaralhada:** o `index.html` publicado sai do `mapa-escolta-urnas-3rpm.html` com `node scripts/embaralhar.cjs mapa-escolta-urnas-3rpm.html index.html` (precisa do Node.js e de `npm install javascript-obfuscator@4 esbuild fflate`). O mapa funciona igual, com o código ofuscado, os dados compactados e o arquivo com menos da metade do tamanho. Isso dificulta a leitura e a cópia, mas não é criptografia: quem souber programar ainda consegue tirar os dados pelo navegador. As versões antigas do `index.html` continuam no histórico de commits do repositório.

**Atenção:** em contas gratuitas, um site do GitHub Pages é público, mesmo que o repositório seja privado. Antes de publicar, confirme se as rotas de escolta podem ficar acessíveis a qualquer pessoa com o link.

## Como atualizar os dados quando a planilha mudar

A fonte dos dados é a planilha `BASE_OTIMIZACAO_ROTAS_URNAS_2026.xlsx`, com as abas `PONTOS_SAIDA`, `LOCAIS`, `ROTAS_2026` e `PARADAS_2026`. Na aba `LOCAIS`, as colunas `ZONA_ELEITORAL` e `NO_LOCAL_TSE` ligam cada local à planilha do TSE (Santa Luzia tem duas zonas que repetem os números dos locais); os locais do TSE que não estão nessa aba aparecem no mapa como locais sem rota. A planilha **não** vai para o repositório (está no `.gitignore`).

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
   A divisa de Minas Gerais (`data/minas-gerais.geojson`) é gerada uma vez a partir da malha municipal do IBGE (arquivo `MUNICIPIOS_MINAS_GERAIS.geojson`, do projeto geodata-br) e não precisa ser refeita. Se quiser refazer (requer `pip install shapely`):
   ```
   python scripts/gerar_limite_estado.py --arquivo "C:\Users\SEU_USUARIO\Desktop\ROTAS OURO PRETO\MUNICIPIOS_MINAS_GERAIS.geojson"
   ```
5. Para atualizar também o arquivo único (o de duplo clique), rode:
   ```
   python scripts/montar_arquivo_unico.py
   ```
6. Suba de novo os arquivos da pasta `data/`, o `scripts/cache_rotas.json` e o `mapa-escolta-urnas-3rpm.html` para o GitHub.

Como funciona o cálculo das rotas:

- O traçado vem do OSRM (servidor público `router.project-osrm.org`, perfil carro). Cada traçado calculado fica guardado em `scripts/cache_rotas.json` e não é pedido de novo.
- Só são calculadas rotas novas ou que mudaram de coordenada. Sem internet, ou com `--sem-rede`, a rota nova sai como linha reta tracejada e marcada como **rota não calculada**.
- Todo local da aba `LOCAIS` recebe uma rota. O local que não aparece em `PARADAS_2026` ganha uma rota criada do ponto de saída dele (`ID_SAIDA`: a origem da cidade ou o cartório da zona) até ele, identificada como `ROTA CRIADA` e desenhada em vermelho.
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
- Versão embaralhada: fflate (licença MIT, Arjun Barrett), embutido para abrir os dados compactados.
- Mapas base: OpenStreetMap (ruas, no site publicado), Esri World Street Map (ruas, no arquivo aberto da pasta), OpenTopoMap (relevo, com Esri World Topo Map como reserva automática se o OpenTopoMap não responder), Esri World Light Gray e World Dark Gray (claro e escuro) e Esri World Imagery, World Transportation e World Boundaries and Places (satélite com nomes).
- Sombreado do relevo: Esri World Hillshade.
- Traçado das rotas: OSRM, com dados OpenStreetMap.
- Locais de votação: TSE, arquivo de 10/09/2026.
- Divisa de Minas Gerais: IBGE, malha municipal (projeto geodata-br, domínio público).
- Fonte Rawline (derivada da Raleway, SIL Open Font License).
- Escudos: Polícia Militar de Minas Gerais, 3ª RPM e 52º BPM.
