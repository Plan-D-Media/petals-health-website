// Shared layout constants (page px at 1366). The design artboard had a 142 px header and a 738 px hero; everything
// below the hero is offset by PAGE_DY relative to the design's page coordinates.
export const HEADER_HEIGHT = 166   // utility 124 + nav 42 (header x1.2, 2026-09-17)
export const HERO_HEIGHT = 640     // hero concept B
export const PAGE_DY = HEADER_HEIGHT + HERO_HEIGHT - 880   // -74: sections after the hero sit 74 px higher than in the design
