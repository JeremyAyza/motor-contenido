#!/usr/bin/env python3
"""beats.py original (ig-reel) adaptado a guiones de Reels en español.

Qué cambia respecto del original:
- palabras con tilde y ñ: el original parte "revés" en "rev" y "s";
- cuenta como concreto lo mismo que hookscore_es: cifras, nombres propios con
  tilde, siglas (RTX, GPU), código, números dichos y sustantivos técnicos;
- las palabras vacías del bucle (la última frase que repite una del gancho)
  son en español;
- el ritmo por defecto es el de la voz de la cuenta (162 palabras por minuto,
  WORDS_PER_SECOND en packages/video/src/script.ts, con las pausas), no 165;
- --video lee un content/<pieza>/video.json: cada frase de cada escena es un
  beat, y --json agrega a cada beat su escena y la lista de palabras del bucle.

Igual que el original, los tiempos son una estimación por cantidad de palabras.
Sirven para la puerta A; el video real lo mide el inspector de video.

Uso
  python skills/ig-es/beats_es.py guion.txt --target 45
  python skills/ig-es/beats_es.py --video content/<pieza>/video.json --json
"""

import json
import re
import sys

from _original import cargar, exigir, utf8
from hookscore_es import CODE_RE, DEV_NOUNS, h as hookscore

b = cargar("ig-reel", "beats.py")
exigir(b, "WORD_RE", "SENT_RE", "CONCRETE_RE", "STOPWORDS", "analyse", "render", "words", "main")

VOICE_WPM = 162

b.WORD_RE = re.compile(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9$%'’-]+")


def _any_word(words):
    return r"(?i:\b(?:" + "|".join(re.escape(w) for w in sorted(words, key=len, reverse=True)) + r")\b)"


# The original only knows unaccented capitals and digits. The proper-noun part
# stays case-sensitive; the word lists match in any case.
b.CONCRETE_RE = re.compile(
    r"\$\s?\d|\b\d[\d,.]*\b"
    r"|(?<!^)(?<![¿¡])\b[A-ZÁÉÍÓÚÑ][a-záéíóúüñ]{2,}\b"
    r"|\b[A-Z]{2,}\d*\b"
    rf"|{CODE_RE.pattern}"
    rf"|{_any_word(DEV_NOUNS)}"
    rf"|{_any_word(hookscore.SPOKEN_NUMBERS | hookscore.MONEY_WORDS)}",
    re.MULTILINE,
)

b.STOPWORDS = {
    "el", "la", "los", "las", "lo", "un", "una", "unos", "unas", "y", "e", "o", "u", "pero",
    "si", "sí", "no", "ni", "de", "del", "a", "al", "en", "con", "sin", "por", "para", "que",
    "qué", "como", "cómo", "es", "son", "fue", "era", "ser", "está", "están", "hay", "va",
    "eso", "esto", "esa", "ese", "esta", "este", "se", "le", "les", "su", "sus", "tu", "tus",
    "te", "ti", "mi", "me", "yo", "nos", "más", "muy", "ya", "también", "todo", "toda",
    "nada", "algo", "porque", "cuando", "donde", "ahí", "aquí", "así", "solo", "sólo",
}


def loop_words(rows):
    """The words of the last beat that come back from the first one (the replay)."""
    def content(text):
        return {w.lower() for w in b.words(text) if w.lower() not in b.STOPWORDS}
    return sorted(content(rows[0]["text"]) & content(rows[-1]["text"]))


def video_script(path):
    """One line per sentence of each scene, and the scene of each line."""
    with open(path, encoding="utf-8") as fh:
        script = json.load(fh)
    lines, scenes = [], []
    for scene in script.get("scenes", []):
        for sentence in b.SENT_RE.findall(scene.get("say", "")):
            if sentence.strip():
                lines.append(sentence.strip())
                scenes.append(scene.get("id"))
    return "\n".join(lines), scenes


def option(args, name):
    if name not in args:
        return None
    i = args.index(name)
    if i + 1 >= len(args):
        raise SystemExit(f"Falta el valor de {name}")
    return args[i + 1]


def main():
    utf8()
    args = sys.argv[1:]
    if "--video" not in args:
        if "--wpm" not in args:
            sys.argv += ["--wpm", str(VOICE_WPM)]
        return b.main()
    raw, scenes = video_script(option(args, "--video"))
    wpm = float(option(args, "--wpm") or VOICE_WPM)
    target = option(args, "--target")
    a = b.analyse(raw, wpm=wpm, target=float(target) if target else None)
    if not a:
        raise SystemExit("El guion no tiene escenas con texto.")
    # A sentence is one beat, so rows and lines line up unless the original
    # splits differently; then the beats go without their scene.
    if len(a["beats"]) == len(scenes):
        for row, scene in zip(a["beats"], scenes):
            row["scene"] = scene
    a["loop"] = loop_words(a["beats"])
    if "--json" in args:
        print(json.dumps(a, indent=2, ensure_ascii=False))
    else:
        for row in a["beats"]:
            if row.get("scene"):
                row["text"] = f"[{row['scene']}] {row['text']}"
        b.render(a)


if __name__ == "__main__":
    main()
