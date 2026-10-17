#!/usr/bin/env python3
"""humanize.py original (ig-human) con el léxico en español.

Qué cambia respecto del original:
- usa slop-es.json en vez de slop.json (se puede cambiar con --lexicon);
- restore_capitals reconoce mayúsculas con tilde y los signos ¿ ¡.

Uso: igual que el original.
  python skills/ig-es/humanize_es.py borrador.txt --report
  python skills/ig-es/humanize_es.py borrador.txt --json
"""

import os
import re

from _original import AQUI, cargar, exigir, utf8

h = cargar("ig-human", "humanize.py")
exigir(h, "LEX", "restore_capitals", "humanize", "main")

h.LEX = os.path.join(AQUI, "slop-es.json")

MAYUS = "A-ZÁÉÍÓÚÜÑ"
MINUS = "a-záéíóúüñ"


def restore_capitals(original, text):
    starts = re.findall(rf"(?:^|[.!?]\s+|\n)\s*[¿¡]?([{MAYUS}{MINUS}])", original)
    if not starts or sum(1 for c in starts if c.isupper()) * 2 < len(starts):
        return text
    return re.sub(rf"(?:^|(?<=[.!?] )|(?<=[.!?]\n)|(?<=\n))\s*[¿¡]?([{MINUS}])",
                  lambda m: m.group(0)[:-1] + m.group(1).upper(), text)


h.restore_capitals = restore_capitals

if __name__ == "__main__":
    utf8()
    h.main()
