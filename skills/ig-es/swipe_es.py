#!/usr/bin/env python3
"""swipe.py original (ig-viral) adaptado a carruseles de cuentas en español.

Qué cambia respecto del original:
- clasifica con ganchos-es.json (patrones en español) y puntúa con hookscore_es;
- acepta encabezados en español: cuenta, seguidores, mediana, megusta, portada.
  Los carruseles no muestran vistas públicas, así que la columna megusta ocupa
  el lugar de views. El informe sigue diciendo "reels" y "views": léelo como
  carruseles y me gusta.

Uso
  python skills/ig-es/swipe_es.py docs/swipe/2026-10.tsv --out docs/swipe.md
"""

import os
import re
import sys
import tempfile

from _original import AQUI, cargar, exigir, utf8

import hookscore_es

sw = cargar("ig-viral", "swipe.py")
exigir(sw, "HOOKS", "WORD_RE", "read_rows", "main")

sw.HOOKS = os.path.join(AQUI, "ganchos-es.json")
sw.WORD_RE = re.compile(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9$%'’-]+")
sw.score_hook = hookscore_es.h.run

ALIAS = {
    "cuenta": "account", "seguidores": "followers", "mediana": "median",
    "megusta": "views", "me_gusta": "views", "likes": "views", "vistas": "views",
    "portada": "hook", "gancho": "hook",
}
_read_rows = sw.read_rows


def read_rows(path):
    raw = sys.stdin.read() if path == "-" else open(path, encoding="utf-8").read()
    lines = raw.splitlines()
    for i, line in enumerate(lines):
        if line.strip() and not line.lstrip().startswith("#"):
            lines[i] = "\t".join(ALIAS.get(c.strip().lower(), c.strip().lower()) for c in line.split("\t"))
            break
    with tempfile.NamedTemporaryFile("w", suffix=".tsv", delete=False, encoding="utf-8") as tmp:
        tmp.write("\n".join(lines) + "\n")
    try:
        return _read_rows(tmp.name)
    finally:
        os.unlink(tmp.name)


sw.read_rows = read_rows

if __name__ == "__main__":
    utf8()
    sw.main()
