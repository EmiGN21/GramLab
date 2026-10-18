# GramLab: mapa de aprendizaje

Estado: dirección implementada. La versión actual añade arte píxel al mapa y al profesor a partir de la nueva referencia del usuario.

## Dirección acordada

- La pantalla principal será un mapa de aventura de plataformas en 2D, limpio y moderno. Cada parada abre una lección existente; un castillo representa el desafío de cierre de un mundo.
- El guía es un profesor de caricatura original, de formas sencillas y reconocible en tamaño pequeño. Su diseño de referencia tiene cabello oscuro ondulado, lentes redondos, chaqueta verde azulado y una bolsa de libros ocre.
- El recorrido propone un orden de estudio, pero la biblioteca, la búsqueda y los verbos seguirán accesibles en cualquier momento.
- La barra superior da acceso a Mapa, Lecciones, Verbos, Repaso y Progreso. Repaso y los retos de castillo ya funcionan y guardan el progreso localmente.
- La primera composición está pensada para computadora, con una adaptación posterior para pantallas pequeñas. El movimiento será discreto: el profesor puede dar unos pasos al cambiar de lección y las paradas pueden responder suavemente al foco o al cursor.
- Las lecciones conservarán su contenido y su división actual. Las ilustraciones de ejemplos se diseñarán por separado, para que apoyen una oración concreta sin competir con el texto.

## Mundos implementados

Hay nueve mundos de 20 paradas cada uno: Primeros pasos, Desierto del tiempo, Vida y lugares, Conversaciones, Más allá, Cumbres de hielo, Caldera de lava, Marte rojo y Jardín de sombras. Las 51 fichas del catálogo aparecen una vez, los 100 verbos tienen práctica propia y los nuevos mundos incluyen 29 retos de repaso con progreso independiente. Cada mundo termina en un castillo con cinco preguntas. Ninguna parada se bloquea.

El profesor usado en la página es [`profesor-guia-pixel.png`](../../src/assets/profesor-guia-pixel.png): hombre adulto de piel más clara, ahora como sprite pixelado. Los nueve biomas pixelados están en `src/assets/world-*.png`. Las imágenes de los ejemplos de Presente simple, Preposiciones y Contables/incontables conservan un tratamiento editorial para no dificultar la lectura.

## Referencias

- [Mapa de referencia](mapa-referencia.png): composición de la pantalla principal. Es un boceto visual; sus rótulos y controles deberán construirse como interfaz real.
- [Profesor de referencia](profesor-referencia.png): identidad y poses del personaje, con fondo transparente.

## Referencia de píxel y prompts

La captura del juego aportada por el usuario se empleó únicamente para el tamaño visible del píxel, el césped y las terrazas escalonadas. Los fondos y el profesor fueron generados como recursos originales, sin personajes, criaturas, objetos o símbolos de Pokémon. Los prompts reproducibles están en [pixel-art-assets.md](pixel-art-assets.md). La interfaz del mapa mantiene sus rutas y rótulos interactivos; los fondos son solo ilustración.

## Pendiente de una siguiente etapa

Extender las ilustraciones de ejemplos a otras lecciones donde realmente ayuden a entender la regla. Higgsfield no se usó porque la conexión del plugin no estaba iniciada; los recursos incorporados se generaron con la herramienta de imagen integrada.
