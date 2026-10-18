# GramLab · dirección de interfaz

La identidad visual es una aventura 2D original con un mapa pixelado y una interfaz limpia. Su función es orientar el aprendizaje: el camino expresa secuencia, las paradas son contenido real, el castillo es un reto y el profesor guía señala el siguiente paso. La referencia del usuario inspira el tratamiento de píxeles y terrazas del terreno; no se reproducen criaturas ni elementos reconocibles de franquicias existentes.

## Estructura

- Barra superior: marca, Mapa, Lecciones, Verbos, Repaso, Progreso, búsqueda y tema.
- Inicio: introducción breve, selector de nueve mundos en una cuadrícula compacta, mapa amplio de 20 paradas y salida al índice completo. En móvil, el selector se desplaza horizontalmente.
- Lecciones: se conserva la lectura estructurada y el contenido; las ilustraciones deben corresponder a ejemplos específicos.
- Prácticas de verbos: pregunta, retroalimentación y enlace al diccionario.
- Castillos: cinco preguntas, resultado y opción de repetir. Todo el contenido permanece abierto.

## Sistema visual

- Base cálida: `--bg`, `--paper`, `--ink` y `--line` del tema actual.
- Acentos: `--adventure-teal` para progreso y lecciones; `--adventure-orange` para verbos y retos.
- Mapas: nueve fondos de píxel originales, uno por bioma, incluidos hielo, lava, Marte y un jardín gótico; camino de bordes rectos, paradas cuadradas con rótulos claros y castillo geométrico. El profesor es un sprite pixelado que conserva su identidad previa.
- IBM Plex Sans se usa para navegación y mapa; Literata se mantiene para ejemplos y contenido de lectura.
- Movimiento: desplazamientos cortos de nodos y profesor, con salida completa mediante `prefers-reduced-motion`.
- Escritorio primero, pero búsqueda y navegación siguen accesibles en móvil; el mapa es una región desplazable y operable con teclado.

Los recursos ilustrados viven en `src/assets`. El archivo `dist/gramlab.html` incrusta imágenes y fuentes para seguir funcionando sin conexión.
