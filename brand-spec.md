# GramLab visual direction

## Design read

- Artifact: a local, offline English-grammar reference application.
- Audience: one learner who needs to resolve a grammar question quickly while studying, writing, or speaking.
- Visual language: a warm editorial grammar atlas with rigorous information architecture.
- Mode: Redesign · Overhaul.
- Dials: visual variance 6, motion 3, information density 7, asset dependence 2, brand fidelity 6.

## Anchors

The system deliberately combines Stripe Press warmth with Pentagram grid discipline and Tufte's data-ink principle. The combination is coherent because GramLab is both a collection of notes and a lookup tool: editorial warmth encourages reading, while the strict grid keeps retrieval fast.

## Identity

- Wordmark: `GramLab`, rendered typographically rather than as the previous square `GL` mark.
- Descriptor: `A visual grammar atlas`.
- Voice: calm, precise, studious, and human; never childish or promotional.
- English remains the primary language. Spanish support is subordinate and can be hidden inside notes.

## Palette

### Light

- Ground: `#F1ECDE`
- Paper: `#FBF8F0`
- Ink: `#1A1A18`
- Muted ink: `#736D5A`
- Hairline: `#C8BEA4`
- Deep teal: `#1B4B5A`
- Burnt sienna: `#A04A2A`

### Dark

- Ground: `#171713`
- Paper: `#201F1A`
- Ink: `#F1ECDE`
- Muted ink: `#B5AD96`
- Hairline: `#464236`
- Deep teal: `#79B7B5`
- Burnt sienna: `#D9825F`

The grammar-role colors are a separate semantic palette. They encode noun, verb, adjective, adverb, pronoun, preposition, auxiliary, and connector; they are never added as decoration.

## Typography

- Display and editorial emphasis: Literata Variable.
- Interface, navigation, tables, and controls: IBM Plex Sans Variable.
- No third display family. Formulae use IBM Plex Sans with tabular figures and controlled tracking.

## Layout and material

- Twelve-column desktop grid with 24–32px gutters.
- Spacing scale: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 72 / 96`.
- Square editorial surfaces. Radius is limited to 2–4px on interactive controls.
- No routine card shadows. Elevation is reserved for the search-results overlay.
- Sections are separated by alignment, whitespace, and hairline rules.

## Motion

- State feedback: 160–220ms.
- One restrained page-entry transition may use up to 420ms.
- No parallax, bouncing, looping decoration, or motion without meaning.
- Reduced-motion mode removes all nonessential transitions.

## Protected contracts

- Hash routes, topic IDs, anchor IDs, and deep links.
- Search, verb dictionary, exercises, personal notes, progress, backup import/export, and local-storage keys.
- English-first hierarchy and Spanish-support toggle.
- Light/dark preference and offline portable build.
- Existing grammar content and semantic category colors.

## v0 scope

The first checkpoint covers the shared shell, home page, library, and a representative grammar note. Verbs and Data remain functionally available but are not considered visually finished until the full-build checkpoint.
