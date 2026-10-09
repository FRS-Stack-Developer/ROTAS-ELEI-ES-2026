#!/usr/bin/env python3
"""Monta um único arquivo HTML com tudo embutido (dados, escudos, fontes e a biblioteca Leaflet).

O arquivo abre com duplo clique, direto da pasta, sem servidor. Só o mapa de fundo
(ruas, satélite, relevo) vem da internet.

Uso, na pasta do projeto, depois de rodar o gerar_dados.py:
    python scripts/montar_arquivo_unico.py
    python scripts/montar_arquivo_unico.py --saida "C:\\Users\\SEU_USUARIO\\Desktop\\mapa-escolta-urnas-3rpm.html"
"""
import argparse
import base64
import json
import pathlib
import re

RAIZ = pathlib.Path(__file__).resolve().parent.parent
LEAFLET = RAIZ / "assets" / "lib" / "leaflet-1.9.4"
MIME = {".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2"}


def data_uri(caminho):
    mime = MIME.get(caminho.suffix.lower(), "application/octet-stream")
    return "data:" + mime + ";base64," + base64.b64encode(caminho.read_bytes()).decode("ascii")


def ler(rel):
    return (RAIZ / rel).read_text(encoding="utf-8")


def script_seguro(texto):
    """Evita que um '</script' dentro do código feche a tag antes da hora."""
    return re.sub(r"</(script)", r"<\\/\1", texto, flags=re.IGNORECASE)


def trocar(html, antigo, novo):
    if antigo not in html:
        raise SystemExit("Trecho não encontrado no index.html: " + antigo[:80])
    return html.replace(antigo, novo)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--saida", default=str(RAIZ / "mapa-escolta-urnas-3rpm.html"), help="arquivo HTML a gerar")
    ap.add_argument("--sem-mapa-base", action="store_true", help="não usar mapa de fundo (prévia em ambiente sem internet)")
    args = ap.parse_args()

    html = ler("index.html")

    # estilos: Leaflet e o visual do mapa, com a fonte Rawline embutida
    css = ler("css/estilo.css")
    css = re.sub(r'url\("\.\./(assets/fontes/[^"]+)"\)', lambda m: 'url("' + data_uri(RAIZ / m.group(1)) + '")', css)
    css_leaflet = (LEAFLET / "leaflet.css").read_text(encoding="utf-8")
    html = re.sub(r'\s*<link rel="preload"[^>]*>', "", html)
    html = re.sub(r'<link rel="stylesheet" href="https://unpkg\.com/leaflet@1\.9\.4/dist/leaflet\.css"[^>]*>', lambda m: "<style>\n" + css_leaflet + "\n</style>", html)
    html = trocar(html, '<link rel="stylesheet" href="css/estilo.css">', "<style>\n" + css + "\n</style>")
    html = trocar(html, 'href="assets/favicon.png"', 'href="' + data_uri(RAIZ / "assets/favicon.png") + '"')

    # imagens (escudos) e mapa de caminhos para o app.js
    assets = {}
    for arq in sorted((RAIZ / "assets" / "escudos").iterdir()):
        if arq.suffix.lower() in MIME:
            assets["assets/escudos/" + arq.name] = data_uri(arq)
    for rel, uri in assets.items():
        html = html.replace('src="' + rel + '"', 'src="' + uri + '"')

    # dados: todos os cenários gerados e as unidades
    cenarios = {}
    for arq in sorted((RAIZ / "data").glob("cenario-*.geojson")):
        cenarios[arq.stem.replace("cenario-", "", 1)] = json.loads(arq.read_text(encoding="utf-8"))
    if not cenarios:
        raise SystemExit("Nenhum data/cenario-*.geojson encontrado. Rode antes o scripts/gerar_dados.py.")
    unidades = json.loads(ler("data/unidades.json"))
    dados = {"cenarios": cenarios, "unidades": unidades, "assets": assets}

    config = ler("js/config.js")
    if args.sem_mapa_base:
        config += "\nwindow.CONFIG.mapaBaseDisponivel = false;\n"
    leaflet_js = (LEAFLET / "leaflet.js").read_text(encoding="utf-8")
    app = ler("js/app.js")
    blocos = ("<script>\n" + script_seguro(leaflet_js) + "\n</script>\n"
              "<script>\n" + script_seguro(config) + "\n</script>\n"
              "<script>\nwindow.__DADOS_EMBUTIDOS = " + script_seguro(json.dumps(dados, ensure_ascii=False, separators=(",", ":"))) + ";\n</script>\n"
              "<script>\n" + script_seguro(app) + "\n</script>")
    html = re.sub(r'<script src="https://unpkg\.com/leaflet@1\.9\.4/dist/leaflet\.js"[^>]*></script>\s*<script src="js/config\.js"></script>\s*<script src="js/app\.js"></script>',
                  lambda m: blocos, html)
    if "window.__DADOS_EMBUTIDOS" not in html:
        raise SystemExit("Não foi possível embutir os scripts no index.html.")

    saida = pathlib.Path(args.saida)
    saida.write_text(html, encoding="utf-8")
    rotas = sum(1 for c in cenarios.values() for f in c["features"] if f["properties"]["tipo"] == "rota")
    print("Arquivo gerado:", saida, "(" + str(round(saida.stat().st_size / 1024)) + " KB,", rotas, "rotas)")


if __name__ == "__main__":
    main()
