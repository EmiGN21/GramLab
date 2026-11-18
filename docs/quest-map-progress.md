# GramLab quest-map redesign — continuation note

## Current milestone

The learning library is now presented as nine original pixel-art worlds with a fixed game HUD, a world atlas, five grouped checkpoints per world, an animated route, mission logs, guide objects, and the existing local/offline progress system. Each checkpoint contains four original learning missions, so all 180 activities remain reachable without making the map unreadable.

The public reference was researched only for interaction patterns: a persistent HUD, world selection, a route between stations, explicit mission states, and short completion feedback. No reference code, visual assets, writing, names, or branding were copied. GramLab uses its own assets and interface code.

## Minimap and mission progression

- The minimap mirrors each world's route and selects the same checkpoints as the full map. The guide moves to that checkpoint and the mission log shows its four missions.
- The lantern has an on/off state with a short lighting effect. The trail sign explains the mission icons. Both report their status in the mission log.
- A grammar note opened from the map offers a return to that world. Reading-only missions can be marked as read, and exercises can be retried. Clearing a mission offers the next one. Clearing a world challenge offers travel to the next world.

## Verified locally

- `pnpm check:content`
- `pnpm build` (including `dist/gramlab.html`, the portable offline file)
- Isolated browser checks at 1440px and touch checks at 320px, 390px, and 820px covered navigation, mission progression, the world challenge, and reduced motion.
- Tested saving a note, reloading, exporting a backup, and restoring it in the portable HTML while the browser was offline.

## Next focused work

1. Let each biome have its own route and world-specific interactive landmarks.
2. Design additional levels using original English practice without repeating the current 180 missions.
3. Continue verifying desktop, mobile, and the standalone build before publishing.
