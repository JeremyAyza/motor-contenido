"""Carga los scripts originales de .agents/skills sin copiarlos ni editarlos.

Los wrappers de esta carpeta importan el módulo original y solo reemplazan las
listas y funciones que dependen del inglés. Si el original cambia un nombre
interno, el wrapper falla con un error claro en vez de dar resultados falsos.
"""

import importlib.util
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.abspath(os.path.join(AQUI, "..", ".."))
SKILLS = os.path.join(RAIZ, ".agents", "skills")


def cargar(skill, script):
    ruta = os.path.join(SKILLS, skill, script)
    if not os.path.exists(ruta):
        raise SystemExit(f"No encuentro {ruta}. Instala las skills originales en .agents/skills.")
    nombre = f"original_{skill.replace('-', '_')}_{os.path.splitext(script)[0]}"
    spec = importlib.util.spec_from_file_location(nombre, ruta)
    modulo = importlib.util.module_from_spec(spec)
    sys.modules[nombre] = modulo
    spec.loader.exec_module(modulo)
    return modulo


def exigir(modulo, *nombres):
    """Falla si el original ya no tiene lo que el wrapper reemplaza."""
    faltan = [n for n in nombres if not hasattr(modulo, n)]
    if faltan:
        raise SystemExit(f"{modulo.__name__} cambió: ya no tiene {', '.join(faltan)}. Revisa el wrapper.")


def utf8():
    """Windows no usa UTF-8 por defecto en la consola ni en las tuberías."""
    for stream in (sys.stdout, sys.stderr, sys.stdin):
        try:
            stream.reconfigure(encoding="utf-8")
        except (AttributeError, ValueError):
            pass
