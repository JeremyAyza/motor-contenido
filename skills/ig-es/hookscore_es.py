#!/usr/bin/env python3
"""hookscore.py original (ig-reel) adaptado a portadas de carrusel en español.

Qué cambia respecto del original:
- listas en español: números dichos, dinero, tensión, aperturas débiles,
  imperativos y frases que descartan el gancho (saludos, "¿sabías que...?");
- LENGTH mide una portada que se lee, no una frase que se dice: lo ideal son
  de 3 a 8 palabras y castiga más de 10;
- ADDRESS reconoce el tú y la segunda persona;
- cuenta como concreto el código (/comandos, `flags`, archivo.md, camelCase) y
  los sustantivos técnicos (repo, API, prompt, token...);
- --brief lee los ganchos de un brief.json del motor y deja al final los que
  tienen algo que los descarta, aunque sumen más puntos;
- --video lee los ganchos de un video.json del motor. Puntúa lo que dice la
  voz (`said`), como el original: LENGTH vuelve a medir una frase dicha (de 5
  a 12 palabras), no una portada. Los deja en el orden del archivo, porque el
  primero es el elegido.

Igual que el original, sirve para DESCARTAR ganchos débiles, no para elegir al
ganador: su autor midió que separa bien un gancho malo de uno real (AUC 0.83)
pero casi no distingue un éxito de un fracaso del mismo creador (AUC 0.56).

Uso
  python skills/ig-es/hookscore_es.py --hook "Deja de pegar todo el repo en el chat"
  python skills/ig-es/hookscore_es.py ganchos.txt
  python skills/ig-es/hookscore_es.py --brief content/<pieza>/brief.json --json
  python skills/ig-es/hookscore_es.py --video content/<pieza>/video.json --json
"""

import json
import re
import sys

from _original import cargar, exigir, utf8

h = cargar("ig-reel", "hookscore.py")
exigir(h, "WORD_RE", "NUMBER_RE", "PROPER_RE", "SPOKEN_NUMBERS", "MONEY_WORDS", "STAKES",
       "WEAK_OPENERS", "IMPERATIVES", "DEALBREAKERS", "HASHTAG_RE", "EMOJI_RE",
       "check_length", "check_address", "check_specificity", "run", "words", "clamp",
       "render_one", "render_table", "CHECKS", "main")
spoken_length = h.check_length

h.WORD_RE = re.compile(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9$%'’/._-]+")
h.NUMBER_RE = re.compile(
    r"\$\s?\d[\d,]*(?:\.\d+)?"
    r"|\b\d[\d,.]*\s?"
    r"(?:%|k\b|x\b|m\b|horas?\b|h\b|min(?:utos)?\b|d[íi]as?\b|semanas?\b|meses\b|mes\b|a[ñn]os?\b|tokens?\b)?",
    re.IGNORECASE)
h.PROPER_RE = re.compile(r"(?<!^)(?<![¿¡])\b[A-ZÁÉÍÓÚÑ][a-záéíóúüñ]{2,}\b|\b[A-Z]{2,}\d*\b")
CODE_RE = re.compile(r"(?:^|\s)[/`][\w-]+|\b[a-z]+[A-Z]\w+\b|\b\w+\.(?:md|json|ts|tsx|py|js|yaml|toml)\b|(?:^|\s)--\w+")

h.SPOKEN_NUMBERS = {
    "cero", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez",
    "once", "doce", "quince", "veinte", "treinta", "cuarenta", "cincuenta", "cien",
    "mil", "millón", "millon", "millones", "docena", "mitad", "doble", "triple",
}
h.MONEY_WORDS = {
    "dólares", "dolares", "soles", "euros", "gratis", "precio", "precios", "cuesta",
    "costo", "costos", "pagas", "pagar", "factura", "sueldo", "barato", "caro",
}
h.STAKES = {
    "deja", "dejen", "nunca", "mal", "error", "errores", "perdí", "perdi", "pierdes", "perder",
    "cuesta", "cuestan", "costó", "costo", "roto", "rota", "falla", "fallan", "falló",
    "nadie", "no", "ni", "sin", "solo", "sólo", "ya", "todavía", "aún", "antes", "hasta",
    "contra", "vs", "versus", "reemplaza", "reemplazó", "borra", "borró", "mata", "elimina",
    "prohibido", "peor", "secreto", "oculto", "trampa", "riesgo", "cuidado", "ojo",
    "gratis", "pagas", "pagando", "caro", "barato", "sube", "baja", "vence", "termina",
    "nuevo", "nueva", "primero", "primera", "único", "única", "realmente", "verdad",
    "mentira", "deberías", "necesitas", "olvida", "evita", "cambia", "cambió",
}
h.WEAK_OPENERS = [
    "hola", "buenas", "bueno", "entonces", "hoy", "básicamente", "basicamente",
    "sinceramente", "mira", "oye", "les", "te cuento", "te explico", "en este",
    "en el", "quiero", "vamos", "aquí", "aqui", "esto es", "este es", "hay",
    "sabías", "sabias", "alguna vez", "todo lo", "atención", "atencion",
]
h.IMPERATIVES = {
    "deja", "dejen", "usa", "usen", "prueba", "copia", "cópiate", "róbate", "robate",
    "guarda", "borra", "mira", "evita", "cambia", "revisa", "configura", "olvida",
    "nunca", "haz", "activa", "desactiva", "instala", "corre", "lee", "aprende",
}
h.DEALBREAKERS = [
    (re.compile(r"(?i)^\s*(?:deja de hacer scroll|no hagas scroll|no sigas bajando|espera)\b"),
     "Empieza pidiendo atención. Pedirla prueba que no la ganaste."),
    (re.compile(r"(?i)\b(?:en este (?:video|post|carrusel|reel)|te voy a (?:mostrar|enseñar|explicar)|te explico|te cuento|les traigo)\b"),
     "Preámbulo. Bórralo y empieza por lo que ibas a mostrar."),
    (re.compile(r"(?i)^\s*(?:hola|buenas|qué tal|bienvenid)"),
     "Saludo. Nadie entra al feed a que lo saluden."),
    (re.compile(r"(?i)^\s*¿?sab[íi]as que\b"),
     "\"¿Sabías que...?\" es la apertura más gastada en español. Di el dato directo."),
    (re.compile(r"(?i)\btodo lo que (?:necesitas|tienes que|debes) saber\b"),
     "\"Todo lo que necesitas saber\" no promete nada concreto."),
    (h.HASHTAG_RE, "Hashtag en el gancho. Los hashtags van al final del texto del post, si van."),
    (h.EMOJI_RE, "Emoji en el gancho. En la portada caben palabras o un emoji, no las dos cosas."),
]


def check_length(text):
    """Una portada se lee de un vistazo: de 3 a 8 palabras."""
    n = len(h.words(text))
    chars = len(text.strip())
    if 3 <= n <= 8:
        score = 100.0
    elif n < 3:
        score = h.clamp(100 - (3 - n) * 25)
    elif n <= 10:
        score = 80.0
    else:
        score = h.clamp(80 - (n - 10) * 12)
    if chars > 55:
        score -= 12
    return h.clamp(score), f"{n} palabras, {chars} caracteres (portada ideal: 3 a 8 palabras)"


# Para un público dev, estos sustantivos son tan concretos como un número.
DEV_NOUNS = {
    "repo", "repos", "api", "apis", "prompt", "prompts", "token", "tokens", "commit", "commits",
    "deploy", "pr", "bug", "bugs", "ide", "terminal", "script", "scripts", "cli", "sdk",
    "endpoint", "docker", "git", "branch", "rama", "merge", "test", "tests", "lint", "build",
    "servidor", "backend", "frontend", "sql", "json", "yaml", "regex",
    "agente", "agentes", "modelo", "modelos", "contexto", "mcp", "skill", "skills", "plugin",
}
_specificity = h.check_specificity


def check_specificity(text):
    score, detail = _specificity(text)
    code = CODE_RE.findall(text)
    low = [x.lower() for x in h.words(text)]
    nouns = sorted({x for x in low if x in DEV_NOUNS})
    extra = len(code) + len(nouns)
    if extra:
        score = h.clamp(max(score, 45) + 30 * extra if score <= 15 else score + 15 * extra)
        found = [c.strip() for c in code[:2]] + nouns[:2]
        detail += f"; técnico: {', '.join(found)}"
    return score, detail


def check_address(text):
    low = text.lower()
    w = [x.lower().strip("'’") for x in h.words(text)]
    if re.search(r"\b(t[úu]|te|tu|tus|ti|contigo)\b", low) or re.search(
            r"\b(?:est[áa]s|tienes|puedes|necesitas|sabes|usas|pagas|haces|quieres|deber[íi]as|eres)\b", low):
        return 100.0, "le habla a quien lee"
    if w and w[0] in h.IMPERATIVES:
        return 90.0, f"empieza con imperativo (\"{w[0]}\")"
    if re.search(r"\b(yo|me|mi|mis|nosotros|nos|nuestro|nuestra)\b", low):
        return 70.0, "primera persona, sin nombrar a quien lee"
    return 35.0, "tercera persona: no le habla a nadie"


h.check_length = check_length
h.check_specificity = check_specificity
h.check_address = check_address


def ganchos_del_brief(ruta):
    with open(ruta, encoding="utf-8") as fh:
        brief = json.load(fh)
    return [g["texto"] for g in brief.get("ganchos", []) if g.get("texto")]


def video_hooks(path):
    with open(path, encoding="utf-8") as fh:
        script = json.load(fh)
    return [hook for hook in script.get("hooks", []) if hook.get("said")]


# The account voice says about 2.7 words per second, pauses included (packages/video/src/script.ts).
VOICE_WORDS_PER_SECOND = 2.7


def check_spoken_length(text):
    """Un gancho dicho tiene que entrar antes de que se mueva el pulgar: el criterio del original."""
    score, _ = spoken_length(text)
    n = len(h.words(text))
    return score, f"{n} palabras, unos {n / VOICE_WORDS_PER_SECOND:.1f} s con la voz de la cuenta (ideal: 5 a 12 palabras)"


def score(line):
    results, overall, verdict, flags = h.run(line)
    return {
        "hook": line,
        "checks": {k: {"score": round(v[0], 1), "detail": v[1]} for k, v in results.items()},
        "weakest": min(h.CHECKS, key=lambda c: results[c][0]),
        "flags": flags,
        "score": round(overall, 1),
        "verdict": verdict,
    }


def score_video(path):
    hooks = video_hooks(path)
    if not hooks:
        raise SystemExit("El video.json no tiene ganchos.")
    h.check_length = check_spoken_length
    try:
        return [{**score(hook["said"]), "onScreen": hook.get("onScreen"), "formula": hook.get("formula")} for hook in hooks]
    finally:
        h.check_length = check_length


def main():
    utf8()
    args = sys.argv[1:]
    if "--video" in args:
        i = args.index("--video")
        if i + 1 >= len(args):
            raise SystemExit("Uso: hookscore_es.py --video content/<pieza>/video.json [--json]")
        payload = score_video(args[i + 1])
    elif "--brief" in args:
        i = args.index("--brief")
        if i + 1 >= len(args):
            raise SystemExit("Uso: hookscore_es.py --brief content/<pieza>/brief.json [--json]")
        lines = ganchos_del_brief(args[i + 1])
        if not lines:
            raise SystemExit("El brief no tiene ganchos.")
        payload = [score(line) for line in lines]
        # Un gancho con algo que lo descarta va al final aunque sume más puntos.
        payload.sort(key=lambda r: (bool(r["flags"]), -r["score"]))
    else:
        return h.main()
    if "--json" in args:
        print(json.dumps(payload, indent=2, ensure_ascii=False))
    else:
        h.render_table(payload)


if __name__ == "__main__":
    main()
