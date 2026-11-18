# GramLab quest-map redesign — continuation note

## Current milestone

The learning library is now presented as nine original pixel-art worlds with a fixed game HUD, a world atlas, five grouped checkpoints per world, an animated route, mission logs, guide objects, and the existing local/offline progress system. Each checkpoint contains four original learning missions, so all 180 activities remain reachable without making the map unreadable.

In an isolated browser, reviewed the [reference game's map and station interface](https://recursos.skilio.com/dropshipping-videojuego/#nivel-3) at desktop and mobile widths. Completed level 3, advanced through two missions in level 4, and revisited the map after earning progress. The station interaction pairs guide movement with a change in the mission panel. Its map and collectible indicators reflect completed actions. GramLab implements those interaction patterns with original scenes, trails, English scenarios, and artwork.

## Minimap and mission progression

- The minimap mirrors each world's route and selects the same checkpoints as the full map. The guide moves to that checkpoint and the mission log shows its four missions.
- Each biome has distinct checkpoint positions and names, a trail colour, environmental animation, and a clickable sign with a grammar hint.
- A dotted path leads to one optional mission per biome. Its pixel-art object reacts when selected and displays a completion badge after the two questions are answered. Side missions have their own counter and use the existing local save and backup format.
- The world atlas connects the nine terrain previews, with progress on each destination. All destinations are available from the start.
- A grammar note opened from the map offers a return to that world. Reading-only missions can be marked as read, and exercises can be retried. Clearing a mission offers the next one. Clearing a world challenge offers travel to the next world.

## Verified locally

- `pnpm check:content`
- `pnpm build` (including `dist/gramlab.html`, the portable offline file)
- Isolated browser checks at 1440px covered the nine routes, field objects, wrong-answer retries, completed badges, and reload. Touch and keyboard checks covered all nine minimaps at 320px. The atlas was checked at 320px, 390px, 820px, and 1440px.
- Tested the font, side mission, saved notes, regular progress, backup export and restore in the portable HTML while the browser was offline.
