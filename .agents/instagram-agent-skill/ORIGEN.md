# Origen

Las 13 carpetas `ig-*` de `.agents/skills/` son una copia sin modificar de [Jakeschincariol/instagram-agent-skill](https://github.com/Jakeschincariol/instagram-agent-skill), licencia MIT (ver `LICENSE` en esta carpeta).

- Commit: `d03c56b` (13 de septiembre de 2026), "Restore sentence capitals after a deleted opener".
- Instalado el 16 de octubre de 2026.
- Aquí quedan además el `README.md`, la plantilla `templates/voice.md` y el manifiesto `.claude-plugin/` del paquete.

**No edites las skills originales.** Lo que hay que cambiar para este repo (contenido en español, rutas propias, reglas del carrusel) vive en la capa [`skills/ig-es/`](../../skills/ig-es/SKILL.md):

- un léxico de relleno en español (`slop-es.json`);
- fórmulas de gancho con patrones en español (`ganchos-es.json`);
- wrappers en Python que importan los scripts originales y solo reemplazan las listas en inglés.

Para actualizar: copia la versión nueva del repositorio encima de estas carpetas, anota aquí el commit y corre las pruebas de `skills/ig-es/SKILL.md`. Si un wrapper deja de funcionar, es porque cambió un nombre interno del script original.
