#!/usr/bin/env python3
"""detect.py original (ig-human) adaptado a textos en español.

Qué cambia respecto del original:
- usa slop-es.json en vez de slop.json (se puede cambiar con --lexicon);
- cuenta palabras y nombres propios con tilde y ñ;
- VOICE: el español no tiene contracciones como el inglés, así que el chequeo
  pesa la persona gramatical (yo, tú, nosotros) y las estructuras de IA, en
  vez de contracciones y pronombres en inglés. Sin este cambio, cualquier
  texto en español saldría marcado como de máquina.

Uso: igual que el original.
  python skills/ig-es/detect_es.py texto.txt
  python skills/ig-es/detect_es.py antes.txt despues.txt
  python skills/ig-es/detect_es.py texto.txt --json
"""

import os
import re
import statistics

from _original import AQUI, cargar, exigir, utf8

d = cargar("ig-human", "detect.py")
exigir(d, "LEX", "WORD_RE", "NUMBERS", "PROPER", "check_voice", "scale", "clamp", "words", "main")

d.LEX = os.path.join(AQUI, "slop-es.json")
d.WORD_RE = re.compile(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ']+")
d.PROPER = re.compile(r"(?<![.!?]\s)(?<![¿¡])(?<!^)\b[A-ZÁÉÍÓÚÑ][a-záéíóúüñ]{2,}\b", re.MULTILINE)

PERSONA = re.compile(
    r"\b(yo|me|mi|mis|m[íi]o|conmigo|nosotros|nosotras|nos|nuestro|nuestra|nuestros|nuestras"
    r"|t[úu]|te|ti|tus?|contigo|usted|ustedes|vos)\b",
    re.IGNORECASE,
)


def check_voice(text, lex):
    w = d.words(text)
    if len(w) < 25:
        return 50.0, "muy corto para juzgar"
    per100 = 100 / len(w)
    person = len(PERSONA.findall(text)) * per100
    tells, names = 0, []
    for s in lex["structures"]:
        try:
            n = len(re.compile(s["regex"], re.MULTILINE).findall(text))
        except re.error:
            continue
        if n:
            tells += n
            names.append(s["id"])
    bullets = [len(b.split()) for b in re.findall(r"(?m)^\s*[-*•]\s+(.+)$", text)]
    uniform = len(bullets) >= 3 and statistics.pstdev(bullets) < 1.6
    score = d.scale(person, human=6.0, machine=0.5) * 0.5 + d.clamp(100 - tells * 22) * 0.5
    if uniform:
        score -= 12
        names.append("viñetas-uniformes")
    detail = f"{person:.1f} marcas de persona por 100 palabras, {tells} estructura(s) de IA"
    if names:
        detail += " [" + ", ".join(names[:4]) + "]"
    return d.clamp(score), detail


d.check_voice = check_voice

if __name__ == "__main__":
    utf8()
    d.main()
