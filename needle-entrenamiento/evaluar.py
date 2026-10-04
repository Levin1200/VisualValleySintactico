"""
Mide cuántas frases de prueba resuelve el modelo con la llamada exacta.

    python evaluar.py                          # modelo base de Needle
    python evaluar.py --pesos modelos/ajustado.cact
    python evaluar.py --pesos modelos/ajustado.cact --errores 20
    python evaluar.py --sin-tildes            # quita las tildes de la frase antes de enviarla

Una respuesta cuenta como correcta solo si llama a las mismas funciones con los mismos
argumentos (el orden de las llamadas no importa). Los valores por defecto se completan
antes de comparar, porque Needle omite los argumentos que el usuario no dijo.

Se reportan dos números:
  directas          llamadas que el motor ejecuta sin preguntar
  con confirmación  además, las que el motor retiene (suppressed_calls) cuando son las
                    correctas: tu app puede proponerlas al usuario («¿Querés bloquear tu
                    tarjeta de débito?») en vez de ejecutarlas
"""
import argparse
import json
import os
import time
import unicodedata
import warnings
from collections import defaultdict
from pathlib import Path

os.environ.setdefault("NEEDLE_TELEMETRY", "0")
import needle  # noqa: E402

from herramientas import TOOLS, schemas  # noqa: E402

DEFAULTS = {}
for s in schemas():
    props = s["parameters"]["properties"]
    DEFAULTS[s["name"]] = {k: v["default"] for k, v in props.items() if "default" in v}


def sin_tildes(texto):
    """«débito» → «debito». El motor exige que los valores de las listas aparezcan tal cual
    en la frase, con o sin tilde, así que conviene quitarlas antes de enviar la frase."""
    return "".join(c for c in unicodedata.normalize("NFD", texto) if unicodedata.category(c) != "Mn")


def normalizar(llamadas):
    out = []
    for c in llamadas or []:
        args = {**DEFAULTS.get(c["name"], {}), **{k: v for k, v in (c.get("arguments") or {}).items() if v is not None}}
        args = {k: (float(v) if isinstance(v, (int, float)) and not isinstance(v, bool) else
                    sin_tildes(v.strip().casefold()) if isinstance(v, str) else v) for k, v in args.items()}
        out.append(json.dumps({"name": c["name"], "arguments": args}, sort_keys=True, ensure_ascii=False))
    return sorted(out)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--pesos", help="archivo .cact ajustado (sin esto usa el modelo base)")
    ap.add_argument("--datos", default=str(Path(__file__).with_name("datos") / "prueba.jsonl"))
    ap.add_argument("--errores", type=int, default=10, help="cuántos errores mostrar")
    ap.add_argument("--json", help="guarda el resumen en este archivo")
    ap.add_argument("--sin-tildes", action="store_true", help="quita las tildes de cada frase antes de enviarla")
    args = ap.parse_args()

    with warnings.catch_warnings():
        warnings.simplefilter("ignore")   # el modelo ajustado en local avisa que no trae confianza
        agente = needle.Needle(tools=TOOLS, weights=args.pesos, stateless=True)
    filas = [json.loads(l) for l in open(args.datos, encoding="utf-8") if l.strip()]

    por_cat = defaultdict(lambda: [0, 0, 0])   # directas, con confirmación, total
    errores, t0 = [], time.time()
    for f in filas:
        query = sin_tildes(f["query"]) if args.sin_tildes else f["query"]
        r = agente.complete(query)
        esperado = normalizar(f["answers"])
        ok = normalizar(r.get("function_calls")) == esperado
        retenida = not r.get("function_calls") and r.get("suppressed_calls")
        ok_conf = ok or bool(retenida and normalizar(r["suppressed_calls"]) == esperado)
        cat = f.get("categoria", "-")
        por_cat[cat][0] += ok
        por_cat[cat][1] += ok_conf
        por_cat[cat][2] += 1
        if not ok:
            errores.append((query, f["answers"], r.get("function_calls"), r.get("suppressed_calls")))
    total = sum(v[0] for v in por_cat.values())
    total_conf = sum(v[1] for v in por_cat.values())
    seg = time.time() - t0

    nombre = (Path(args.pesos).name if args.pesos else "modelo base") + (" · sin tildes" if args.sin_tildes else "")
    n = len(filas)
    print(f"\n{nombre}  ({1000 * seg / n:.0f} ms por frase)")
    print(f"  directas:          {total}/{n} = {100 * total / n:.1f} %")
    print(f"  con confirmación:  {total_conf}/{n} = {100 * total_conf / n:.1f} %\n")
    print(f"  {'categoría':<14} {'directas':>10} {'con conf.':>10}")
    for cat, (ok, okc, m) in sorted(por_cat.items()):
        print(f"  {cat:<14} {ok:>3}/{m:<3} {100 * ok / m:3.0f} %  {okc:>3}/{m:<3} {100 * okc / m:3.0f} %")
    if errores and args.errores:
        print(f"\nAlgunos errores ({min(args.errores, len(errores))} de {len(errores)}):")
        for q, esperado, obtenido, suprimido in errores[: args.errores]:
            print(f"  «{q}»\n     esperado: {json.dumps(esperado, ensure_ascii=False)}"
                  f"\n     obtenido: {json.dumps(obtenido, ensure_ascii=False)}"
                  + (f"\n     retenido: {json.dumps(suprimido, ensure_ascii=False)}" if suprimido else ""))
    if args.json:
        Path(args.json).write_text(json.dumps({
            "modelo": nombre, "directas": total, "con_confirmacion": total_conf, "total": n,
            "categorias": {k: {"directas": v[0], "con_confirmacion": v[1], "total": v[2]}
                           for k, v in por_cat.items()},
        }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
