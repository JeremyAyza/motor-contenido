#!/usr/bin/env python3
"""caption.py original (ig-caption) adaptado a textos de post en español.

Qué cambia respecto del original:
- reconoce las peticiones en español (guárdalo, mándaselo, comenta, sígueme...);
- cuenta hashtags con tilde y ñ (#programación) y no cuenta "#1" (sin letras no es hashtag);
- agrega hashtags de relleno en español (#parati, #viral...) y dominios .dev y .pe.

Lo demás es igual: los 125 caracteres visibles, el tope de 5 hashtags (anunciado
por Instagram el 19 de diciembre de 2025), una sola petición, sin enlaces.

Uso: igual que el original.
  python skills/ig-es/caption_es.py texto-del-post.txt
  python skills/ig-es/caption_es.py texto-del-post.txt --keywords "claude code,mods"
  python skills/ig-es/caption_es.py texto-del-post.txt --json
"""

import re

from _original import cargar, exigir, utf8

c = cargar("ig-caption", "caption.py")
exigir(c, "HASHTAG_RE", "LINK_RE", "CONCRETE_RE", "ASKS", "FILLER_TAGS", "main")

# Un hashtag necesita al menos una letra: "#1" no es hashtag en Instagram.
c.HASHTAG_RE = re.compile(r"(?:^|\s)(#(?=\w*[^\W\d_])\w+)")
c.LINK_RE = re.compile(
    r"https?://\S+|\bwww\.\S+|\b[a-z0-9-]+\.(?:com|co|io|net|org|ai|app|dev|pe|es|mx|tech)/\S*",
    re.IGNORECASE,
)
c.CONCRETE_RE = re.compile(r"\$\s?\d|\b\d[\d,.]*\b|(?<!^)\b[A-ZÁÉÍÓÚÑ][a-záéíóúüñ]{2,}\b", re.MULTILINE)

c.ASKS = [
    (re.compile(r"(?i)\bcomenta (?:la palabra )?[\"“«]?[A-ZÁÉÍÓÚÑ0-9]{2,}\b"), "comentar una palabra"),
    (re.compile(r"(?i)\b(?:escr[íi]beme|m[aá]ndame un (?:dm|mensaje)|por dm)\b"), "escribir por DM"),
    (re.compile(r"(?i)\bgu[aá]rd(?:a|alo|ala|atelo|en)\b"), "guardar"),
    (re.compile(r"(?i)\b(?:m[aá]nd(?:a|aselo|asela|ale)|env[íi](?:a|aselo|ale)|comp[aá]rt(?:e|elo|ela|irlo))\b"), "enviar o compartir"),
    (re.compile(r"(?i)\bs[íi]gue(?:me|nos)\b"), "seguir"),
    (re.compile(r"(?i)\b(?:link|enlace) en (?:la |mi )?bio\b"), "enlace en la bio"),
    (re.compile(r"(?i)\b(?:desliza|pasa) (?:a la|para|hasta)\b"), "deslizar"),
    (re.compile(r"(?i)\b(?:cu[ée]ntame|te leo|d[íi]me)\b|¿(?:cu[aá]l|qu[ée]) (?:usas|prefieres|eliges|har[íi]as|usar[íi]as)\b"), "responder una pregunta"),
]

c.FILLER_TAGS = set(c.FILLER_TAGS) | {
    "#parati", "#paratii", "#explorar", "#tendencia", "#tendencias", "#viralizar",
    "#sigueme", "#síguenos", "#instagramers", "#fotodeldia",
}

if __name__ == "__main__":
    utf8()
    c.main()
