# Art and Design Asset List

## Approach: Isometric 2D Sprite Art

All assets are 2D sprites rendered from an isometric perspective (roughly 45-degree top-down angle). If you want the blocky Minecraft flavor, you can model in MagicaVoxel and render to sprite sheets. If you prefer hand-drawn pixel art, Aseprite is the tool.

Pick a consistent base tile size early (e.g., 32x32 or 64x64 pixels for ground tiles) and scale everything relative to that. Characters are typically 1.5-2x the height of a floor tile.

---

## Phase 1: Core Loop (Minimum Playable)

This is the bare minimum to test whether the game feels fun. Placeholder art is fine here. Colored rectangles and simple shapes work. But if you want to start with real art, here's the list.

### Player Characters (2)

Each player character needs a sprite sheet with animation frames for:

- **Idle** (4-6 frames, gentle breathing/bobbing loop)
- **Walk/Run** in 4 or 8 directions (6-8 frames per direction)
- **Melee attack** (4-6 frames, swing animation)
- **Dodge roll** (4-6 frames)
- **Hit/hurt reaction** (2-3 frames, flinch)
- **Death** (4-6 frames, collapse)
- **Reviving teammate** (3-4 frames, kneeling)

For v1, two visually distinct characters are enough. They don't need to change appearance based on armor yet. That's a Phase 2 nicety.

**Total per character:** ~100-150 individual frames across all animations and directions.

**Shortcut:** Start with 4-directional movement instead of 8. Cuts the walk cycle frames roughly in half.

### Enemies

#### Melee Chaser (e.g., zombie/skeleton type)

- Idle (4 frames)
- Walk in 4 directions (6 frames per direction)
- Attack (4 frames)
- Hit reaction (2 frames)
- Death (4-6 frames)

#### Ranged Attacker (e.g., archer/caster type)

- Idle (4 frames)
- Walk in 4 directions (6 frames per direction)
- Ranged attack / cast (4-6 frames)
- Hit reaction (2 frames)
- Death (4-6 frames)

#### Projectile

- Arrow or magic bolt sprite (1-2 frames, or a simple static sprite that rotates)

### One Test Level Tileset

A single biome tileset for your first playable level:

- **Floor tiles** (3-5 variations to avoid repetition: stone, cracked stone, mossy stone, etc.)
- **Wall tiles** (front-facing wall, side walls, corners, wall tops visible from isometric angle)
- **Wall transitions** (where wall meets floor)
- **Door/entrance** (open and closed states)
- **Basic obstacles** (rocks, pillars, barrels that block movement)

This is typically one sprite sheet / tileset image that Tiled references.

### Loot Drops (Ground Items)

- Generic weapon drop sprite (a small sword/axe icon on the ground)
- Generic armor drop sprite (a small chestplate icon on the ground)
- Health orb or potion drop (small glowing orb)
- Currency drop (emerald or coin, 2-3 frames for a spin/sparkle animation)

These are small, like half the size of a floor tile. They just need to be readable at a glance.

### Basic UI / HUD

- **Health bar** (frame + fill, for both players)
- **Healing potion icon** with cooldown overlay
- **Player indicator** (P1 / P2 label or colored marker above each character)
- **Font** (pick a free pixel font, or use a system font for v1)

### Minimal Effects

- **Hit spark** (3-4 frame burst animation when weapon connects)
- **Damage numbers** (can just be text, no sprite needed)

---

## Phase 2: Depth

Once the core loop feels good, these assets add the systems that create replayability.

### Weapon Variety (Visible as Ground Drops + Inventory Icons)

Each weapon type needs two things: a small ground-drop sprite and an inventory icon. If weapons are visible on the character during combat, they also need in-hand sprites per attack animation, which is significantly more work.

**Simpler approach:** Weapons are only visible as icons in inventory and as ground drops. The player's attack animation stays the same regardless of weapon. Many 2D ARPGs do this.

**If you want visible weapons:** Each weapon needs a sprite positioned correctly for each frame of the attack animation. This multiplies the art workload significantly. Save this for later.

Weapon types to design icons for:

- Sword (fast, balanced)
- Hammer (slow, high damage, area)
- Daggers (very fast, low damage per hit)
- Axe (medium speed, high damage)
- Spear (medium speed, long reach)
- Bow (ranged, single target)
- Crossbow (ranged, slower, higher damage)

**Per weapon type:** 1 ground drop sprite + 1 inventory icon. Rarity can be indicated by a colored glow/border on the same base sprite (white = common, blue = rare, gold = unique).

### Armor Sets (Inventory Icons)

Same approach as weapons. Armor changes stats but doesn't need to change the character's visual appearance in v1.

- Light armor icon
- Medium armor icon
- Heavy armor icon

Rarity indicated by border color.

### Enchantment Icons

Small square icons for the enchantment selection screen. Each enchantment needs one icon:

- Fire (flame)
- Lightning (bolt)
- Poison (green droplet)
- Lifesteal (red heart with fangs)
- Sharpness (blade with sparkle)
- Swirling (spiral)
- Gravity (vortex)
- Speed (wind lines)

**Per enchantment:** 1 small icon (16x16 or 24x24).

### Enchantment Visual Effects

When enchantments trigger in gameplay, players need to see them:

- **Fire** (small flame particles on hit, 3-4 frames)
- **Lightning** (chain lightning bolt sprite, 3-4 frames)
- **Poison** (green cloud puff, 3-4 frames)
- **Healing/Lifesteal** (green or red particles floating up, 3-4 frames)

These are small particle-style animations reused across all weapons.

### Artifact Icons and Effects

Each artifact needs an inventory/HUD icon and a gameplay effect:

- **Summoned wolf** (needs idle, walk, attack, death animations like a small enemy, ~40-50 frames)
- **Speed mushroom** (icon + speed lines particle effect on player)
- **Fireworks arrow** (icon + explosion animation, 4-6 frames)
- **Healing totem** (icon + a small placed object sprite with a glow pulse, 3-4 frames)

### Inventory/Equipment Screen

- **Background panel** (dark semi-transparent overlay)
- **Item slot frames** (melee, ranged, armor, 3 artifact slots)
- **Inventory grid** (backpack slots)
- **Enchantment slot UI** (the selection interface where you pick from 3 options per slot)
- **Salvage button**
- **Rarity color coding** (borders or backgrounds: white, blue, gold)
- **Stat text styling** (damage numbers, enchantment descriptions)

### Procedural Level Room Templates

For procedural generation to work, you need room templates designed in Tiled:

- **Start room** (where players spawn)
- **Exit room** (level completion area)
- **Combat rooms** (3-5 variations, open areas for fighting)
- **Treasure room** (smaller room with a chest)
- **Corridor segments** (2-3 variations connecting rooms)
- **Dead-end / secret room** (optional exploration reward)
- **Boss arena** (larger room with space for boss mechanics)

Each room is built from the tileset above. The procedural system connects them via doorways.

### Chest

- Closed chest sprite
- Opening animation (3-4 frames)
- Open/empty chest sprite
- Loot burst effect (items flying out, can be particles)

### Boss Enemy

One boss for your first biome. Needs more animation than regular enemies:

- Idle (4-6 frames)
- Walk in 4 directions (6 frames per direction)
- Attack pattern 1, e.g., melee slam (6-8 frames)
- Attack pattern 2, e.g., ranged projectile or area attack (6-8 frames)
- Phase transition or rage animation (4-6 frames)
- Hit reaction (2-3 frames)
- Death (6-8 frames, bigger and more dramatic than regular enemies)

**Total:** ~120-150 frames for a proper boss.

---

## Phase 3: Polish and Content

### Second Biome Tileset

A completely new visual theme (e.g., if biome 1 is stone dungeon, biome 2 could be forest, swamp, or desert):

- Floor tiles (3-5 variations)
- Wall/boundary tiles
- Transitions
- Biome-specific decorations (mushrooms, vines, sand piles, lava pools, etc.)
- Biome-specific obstacles

### New Enemy Types for Biome 2

2-3 new enemies with full animation sets (same frame counts as Phase 1 enemies). Visually distinct from biome 1 enemies to reinforce the new environment.

### Environmental Props and Decorations

Non-functional visual objects that make levels feel alive:

- Torches / light sources (2-3 frame flicker animation)
- Banners / flags
- Bones / debris
- Puddles / cracks
- Cobwebs
- Crates and barrels (some breakable with a break animation, 3-4 frames)
- Tables, bookshelves, etc. for indoor areas

### More Visual Effects

- **Level up burst** (celebratory particle effect)
- **Loot drop rarity glow** (pulsing colored light under rare/unique items on the ground)
- **Enchantment ambient effects** (subtle glow on enchanted weapons during gameplay)
- **Dodge roll dust puff** (2-3 frames)
- **Enemy spawn effect** (appear from smoke/portal, 4-6 frames)
- **Healing potion use effect** (green swirl around player, 3-4 frames)

### Menu and Hub Screens

- **Title screen background** (could be a simple illustrated scene or just a logo on a dark background)
- **Game logo / title text**
- **Mission select screen** (map-style layout with mission nodes)
- **Shop interface** (NPC portrait, item grid, buy/sell buttons)
- **Button styles** (normal, hover, pressed states)

### Sound Design (Not Visual, But Listed Here for Completeness)

- Melee hit sounds (2-3 variations)
- Ranged shot and impact sounds
- Dodge roll swoosh
- Enemy hurt and death sounds (per enemy type)
- Loot pickup sound (satisfying chime)
- Rare item drop sound (distinct, exciting)
- UI navigation clicks
- Healing potion use
- Enchantment trigger sounds (fire whoosh, lightning crack, poison hiss)
- Ambient dungeon sounds (drips, wind, distant rumbling)
- Background music (1 track per biome + 1 boss track + 1 menu track)

---

## Asset Count Summary

### Phase 1 (Minimum Playable)

| Category | Items | Est. Frames/Sprites |
|---|---|---|
| Player characters (x2) | 7 animations each | ~200-300 total |
| Melee enemy | 5 animations | ~40-50 |
| Ranged enemy | 5 animations | ~40-50 |
| Projectile | 1 sprite | 1-2 |
| Tileset (1 biome) | ~15-20 tile types | ~20-30 |
| Loot drops | 4 types | ~10 |
| HUD elements | Health bar, potion, labels | ~10 |
| Hit effects | 1 type | 3-4 |

**Phase 1 total: ~350-450 individual sprites/frames**

### Phase 2 (Depth)

| Category | Items | Est. Frames/Sprites |
|---|---|---|
| Weapon icons | 7 types x 1 icon + 1 drop | ~14 |
| Armor icons | 3 types | ~6 |
| Enchantment icons | 8 types | ~8 |
| Enchantment effects | 4 types | ~16 |
| Artifact icons | 4 types | ~4 |
| Summoned wolf | Full animation set | ~50 |
| Artifact effects | 3 types | ~12 |
| Inventory/equipment UI | Panels, slots, buttons | ~20 |
| Chest | Open/close animation | ~8 |
| Boss enemy | Full animation set | ~120-150 |
| Room templates (Tiled) | 8-10 rooms | (uses existing tileset) |

**Phase 2 total: ~260-290 additional sprites/frames**

### Phase 3 (Polish)

| Category | Items | Est. Frames/Sprites |
|---|---|---|
| Second biome tileset | ~15-20 tile types | ~20-30 |
| New enemies (2-3) | Full animation sets | ~100-150 |
| Environmental props | 10-15 types | ~30-40 |
| Visual effects | 6-8 types | ~30-40 |
| Menu/hub screens | 3-4 screens | ~30-40 |

**Phase 3 total: ~210-300 additional sprites/frames**

---

## Shortcuts and Time-Savers

### Use Asset Packs to Start

There are free and cheap isometric dungeon crawler asset packs on itch.io that can get you to playable fast. You can replace them with custom art later. Search for:

- "isometric dungeon tileset"
- "isometric character sprites"
- "pixel art RPG enemies"

Notable free/cheap packs: Kenney.nl has extensive free game assets. itch.io game assets section has hundreds of isometric RPG packs in the $5-15 range.

### Limit Directions

4-directional movement (up, down, left, right) instead of 8-directional cuts your character animation workload nearly in half. Many successful isometric games use 4 directions.

### Palette Swaps for Enemy Variants

Design one enemy base sprite and recolor it for different tiers. A blue skeleton, red skeleton, and gold skeleton can represent normal, enchanted, and elite variants with zero additional drawing.

### Minimal Animation Frames

You can get away with surprisingly few frames. A 3-frame walk cycle looks decent at small sprite sizes. A 3-frame attack still reads clearly. Don't over-animate early on. Add frames later when you're polishing.

### Weapons as Icons Only

Don't animate weapons in the character's hand. Show weapon type only in the inventory screen and as ground drops. The character's attack animation stays the same. This removes an enormous amount of sprite work.

### Use Particle Systems for Effects

Phaser's built-in particle emitter can generate fire, lightning, poison clouds, sparkles, and healing effects from a single small particle sprite (a 4x4 pixel circle or spark). You don't need to hand-animate most effects.

---

## Tools

| Tool | Purpose | Cost |
|---|---|---|
| Aseprite | Pixel art sprite creation and animation | $20 (one time, on Steam) |
| MagicaVoxel | Voxel modeling, rendered to 2D sprite sheets | Free |
| Tiled | Tilemap / room template editor | Free |
| Kenney Asset Packs | Placeholder and starter art | Free |
| Piskel | Browser-based pixel art editor (good for your son) | Free |
| LibreSprite | Free Aseprite alternative | Free |
| TexturePacker | Sprite sheet packing (optional, Phaser can use individual files) | Free tier available |
