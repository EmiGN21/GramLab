# GramLab

Biblioteca visual y local de gramática inglesa. Está diseñada para consultar una duda en segundos, conectar conceptos como en Obsidian y conservar notas personales sin cuentas ni internet.

## Abrir la versión portátil

Haz doble clic en `Abrir GramLab.bat`. El lanzador abre `dist/gramlab.html`, un único archivo autocontenido que funciona sin servidor.

## Desarrollo

Requiere Node.js 20 o posterior y pnpm.

```powershell
pnpm install
pnpm dev
pnpm build
```

`pnpm build` verifica TypeScript, compila la aplicación y genera de nuevo `dist/gramlab.html`.

## Qué incluye

- Buscador local por títulos, alias, secciones, formas verbales y significados.
- Rutas profundas como `#/topic/prepositions?section=at`.
- Matriz completa de 12 tiempos verbales, sin contenido bloqueado.
- Biblioteca por conceptos con fichas, tablas, contrastes, errores y conexiones inversas.
- Diccionario de 100 verbos irregulares; `went` abre `go` y `written` abre `write`.
- Leyenda visual de partes de la oración y modos claro/oscuro persistentes.
- Una nota local por tema, ejercicios heredados y respaldo GramLab v2.
- Migración automática e importación de respaldos Grammar Canvas v1.
- Verificación interna de IDs, enlaces, secciones y referencias verbales.

El catálogo editorial vive en `src/data/catalog.ts`, los verbos en `src/data/verbs.ts` y la matriz privada del curso en `docs/course-coverage.md`. Los videos y enlaces del curso no forman parte de la interfaz.
