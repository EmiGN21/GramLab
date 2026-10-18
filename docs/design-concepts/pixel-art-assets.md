# Recursos pixelados de GramLab

Se generaron con la herramienta de imagen integrada, sin usar créditos de Higgsfield. La captura de juego proporcionada por el usuario se usó solo como referencia de técnica píxel; no se incorporó al proyecto.

## Profesor

Se editó `src/assets/profesor-guia-v2.png` para producir `src/assets/profesor-guia-pixel.png` con este prompt:

> Edit the supplied GramLab teacher into one ORIGINAL top-down adventure game pixel-art sprite, full body, standing and facing slightly right. Preserve his identity exactly: adult male professor, light warm skin, dark wavy hair, round glasses, teal jacket, cream shirt, ochre cross-body book satchel, dark trousers. Render as crisp hand-placed 16-bit-style pixels with a limited 24-color palette and chunky deliberate pixel clusters, dark brown 1-pixel outline, readable at 72 px tall. Slight 3/4 view and friendly calm expression. Center the character with only a small transparent margin. Truly transparent background, no glow, no vignette, no cast shadow, no scenery, no text, no sprite sheet, no creatures, no balls or icons, and no visual elements identifiable with Pokémon or any existing video game franchise.

## Fondos de los cinco mundos originales

Cada fondo se generó por separado con este prompt base y la variante de bioma indicada abajo:

> Create an ORIGINAL top-down pixel-art overworld terrain background for a minimalist English-learning web game. Landscape 4:3 composition, seamless-feeling broad open center and lower areas where interactive lesson markers will be overlaid. Hand-placed crisp pixel clusters, 16-bit inspired but modern, chunky 4-8 px visual grid, restrained color count, selective dark outlines, no blur, no gradients, no photorealism, no isometric buildings. Terraced ground and small vegetation inspired by classic pixel game readability, without copying any existing game. No characters, monsters, creatures, collectible balls, UI, text, labels, route, path, level nodes, castle or copyrighted franchise elements. Keep contrast moderate so dark UI markers remain readable.

- `world-meadow-pixel.png`: “Biome: green meadow with layered ochre stone terraces near the top, short grass tufts, a few tiny white flowers and two small bushes. Rich fresh greens, warm cream rocks.”
- `world-dunes-pixel.png`: “Biome: warm sandy plateau with terraced sandstone ledges near the top, sparse dry grass tufts, two tiny ochre shrubs, open muted golden ground. Restrained warm sand and olive palette.”
- `world-coast-pixel.png`: “Biome: quiet coast meadow with a slim pixel water inlet at the far right edge, soft teal-green grass, pale sandy stone terraces near the top, sparse sea flowers and two reeds. Leave most of the map open.”
- `world-grove-pixel.png`: “Biome: leafy grove with deeper sage-green grass, an upper terraced earth ledge, a few small pixel trees confined to the edges, tiny white flowers, lots of uncluttered open ground.”
- `world-highlands-pixel.png`: “Biome: cool highlands with slate stone terraces near the top, muted blue-green grass, a few small pixel rocks and alpine flowers near edges, open ground for lesson markers.”

## Cuatro expediciones fantásticas

Se generaron con la herramienta de imagen integrada. Cada prompt fue el texto base siguiente concatenado con una de las variantes, sin alterar las imágenes originales:

> Use case: stylized-concept. Asset type: original pixel-art overworld terrain background for GramLab, an English-learning web game. Landscape 4:3 composition designed as a scrolling 1200x1110 map background with broad open center and lower areas for interactive route markers overlaid later. Crisp hand-placed 16-bit inspired pixel clusters, chunky visible 4-8 px grid, selective dark outlines, restrained palette, readable terrain. Slight top-down game viewpoint, terraced ledges near top and sides, open walkable ground elsewhere. No character, creature, route, path, nodes, castle, UI, text, logo, game franchise iconography, or recognizable Mario or Pokémon elements. Avoid blur, gradients, photorealism, isometric buildings, and excessive clutter.

- `world-ice-pixel.png`: “Biome: enchanted winter plateau. Frost-blue snowy terraces and ice cliffs, pale silver evergreen silhouettes at edges, a few crystalline rocks, cool blue/cyan/white palette with warm stone accents. Magical but calm, visibly different from existing green highlands.”
- `world-volcano-pixel.png`: “Biome: volcanic caldera. Charcoal basalt terraces with glowing orange-red lava rivers confined mostly to top and far edges, ash-tinted walkable stone center, a few ember specks and obsidian boulders. Dramatic and readable, not apocalyptic.”
- `world-mars-pixel.png`: “Biome: imaginative red planet. Rust-red and coral terraced canyons, dusty rose open ground, small blue mineral crystals and pale ochre rocks near edges, dark indigo sky only hinted at far upper boundary. Alien and curious, no spaceships or technology.”
- `world-gothic-pixel.png`: “Biome: moonlit gothic fantasy garden. Deep violet-blue stone terraces, old wrought-iron fence fragments and bare tree silhouettes confined to edges, tiny luminous lavender flowers, broad open cobblestone clearing, mystical and elegant rather than horror. No castle.”

Los caminos, paradas, títulos, castillos y controles se dibujan en la aplicación, de modo que siguen siendo accesibles y funcionan independientemente de las imágenes.
