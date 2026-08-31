# Grammar Canvas

Una plataforma personal de gramática inglesa para usar localmente y sin cuentas.

## Abrirla

Haz doble clic en `Abrir Grammar Canvas.bat`. Abrirá en tu navegador la versión portátil `dist/grammar-canvas.html`.

Es un único archivo HTML autocontenido: no necesita servidor, instalación, internet ni una terminal. El progreso se guarda sólo en ese navegador y computadora.

## Si necesitas volver a compilarla

Requiere Node.js 20 o posterior y pnpm.

```powershell
pnpm install
pnpm build
```

El comando también vuelve a generar automáticamente la versión portátil.

Para trabajar en modo de desarrollo:

```powershell
pnpm dev
```

## Qué incluye

- Mapa visual de 12 tiempos verbales con A1–A2 disponible y B1–B2 señalizado.
- Lecciones y tablas para estructuras fundamentales, pronombres, modales, cuantificadores, preposiciones, preguntas, `there is/are`, `have got`, `used to` y `ever/never`.
- Ejercicios de elegir, ordenar y completar con corrección inmediata.
- Progreso local con exportación e importación de respaldo desde la pantalla **Progress**.

El contenido de las lecciones está centralizado en `src/data/grammar.ts`, para ampliarlo o corregirlo sin tocar la interfaz.
