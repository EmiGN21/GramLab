# GramLab

Plataforma local de gramática inglesa con un mapa de aventura 2D pixelado. Puedes seguir un camino de aprendizaje o consultar una duda directamente, sin cuentas ni internet.

## Abrir la versión portátil

Haz doble clic en `Abrir GramLab.bat`. El lanzador abre `dist/gramlab.html`, un único archivo autocontenido que funciona sin servidor.

## Desarrollo

Requiere Node.js 20 o posterior. Puedes usar npm o pnpm.

```powershell
npm install
npm run dev
npm run build
```

`npm run build` verifica TypeScript, compila la aplicación y genera de nuevo `dist/gramlab.html` con imágenes y fuentes incrustadas.

## Qué incluye

- Nueve mundos de 20 paradas (180 en total): las 51 fichas aparecen una sola vez, los 100 verbos tienen práctica propia y los mundos fantásticos añaden retos de repaso.
- Castillos con retos de cinco preguntas y una vista de repaso; el progreso se guarda localmente.
- Profesor guía original e ilustraciones en ejemplos de Presente simple, Preposiciones y Contables/incontables.
- Buscador local por títulos, alias, secciones, formas verbales y significados.
- Rutas profundas como `#/topic/prepositions?section=at`.
- Matriz completa de 12 tiempos verbales, sin contenido bloqueado.
- Biblioteca por conceptos con fichas, tablas, contrastes, errores y conexiones inversas.
- Diccionario de 100 verbos irregulares; `went` abre `go` y `written` abre `write`.
- Leyenda visual de partes de la oración y modos claro/oscuro persistentes.
- Una nota local por tema, ejercicios heredados y respaldo GramLab v2.
- Migración automática e importación de respaldos Grammar Canvas v1.
- Verificación interna de IDs, enlaces, secciones y referencias verbales.

El catálogo editorial vive en `src/data/catalog.ts`, los mundos en `src/data/worlds.ts`, los verbos en `src/data/verbs.ts` y la matriz privada del curso en `docs/course-coverage.md`. Los videos y enlaces del curso no forman parte de la interfaz.
