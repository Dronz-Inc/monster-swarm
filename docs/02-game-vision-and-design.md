# Our Game: Vision and Design Thinking

## The Starting Point

This is a father-son project to build a game inspired by Minecraft Dungeons. The goal is a playable co-op dungeon crawler that runs in a web browser on an iPad, with two players using Bluetooth controllers on a shared screen.

The game doesn't need to replicate Minecraft Dungeons feature-for-feature. It needs to capture the feeling: pick up and play co-op, satisfying loot drops, simple but deep combat, and a reason to keep coming back.

---

## What to Keep from Minecraft Dungeons

These are the design pillars that make the game work and should carry over:

### No Class System

Gear defines the player's abilities, not a class selection. This is critical for a co-op family game because it means no commitment anxiety, no wrong choices, and instant gratification when new loot drops. If you find a cool weapon, you just equip it.

### Simple Combat, Deep Builds

The moment-to-moment gameplay is straightforward: attack, dodge, use abilities. The depth comes from how gear and enchantments combine into synergies. This layering means a young player can button-mash through early content while more experienced players can min-max builds later.

### Forgiving Co-op

The revival system and lenient death penalties are what make Minecraft Dungeons work as a family game. Getting wiped doesn't feel punishing. You keep your loot, you respawn quickly, you try again. This is non-negotiable for a game played with a kid.

### Loot as the Core Motivator

Every enemy killed, every chest opened, every room cleared has a chance to drop something interesting. The "one more run" feeling comes from the loot loop, not the story. Randomized enchantment options mean even duplicate items can be exciting.

### Procedural Levels from Hand-Crafted Pieces

Fully procedural generation creates soulless spaces. Fully hand-crafted levels kill replayability. The hybrid approach of pre-designed room templates stitched together algorithmically gives both quality and variety.

---

## What to Change or Simplify

### Art Style

Minecraft Dungeons uses 3D voxel rendering in Unreal Engine. For a browser game built as a side project, 2D isometric pixel art is the pragmatic choice. This isn't a downgrade in fun. Games like Hades, Enter the Gungeon, and classic Diablo prove that 2D top-down/isometric combat is incredibly satisfying.

The aesthetic could lean into pixel art with a blocky, chunky style that nods to Minecraft without trying to replicate it. Or it could have its own visual identity entirely.

### Scope of Content

Minecraft Dungeons shipped with 9 campaign missions across multiple biomes, dozens of weapon types, hundreds of enchantments, and extensive endgame systems. That took a professional studio years to build.

A realistic v1 target:

- 3-4 levels across 2 biomes
- 4-6 melee weapon types, 2-3 ranged weapon types
- 2-3 armor sets
- 6-8 enchantments
- 3-4 artifacts
- 2-3 enemy types per biome plus 1 boss per biome
- 3 rarity tiers (common, rare, unique)
- No endgame systems (Ancient Hunts, Tower, etc.) in v1

This is still a substantial game with real replayability.

### Multiplayer Approach

Minecraft Dungeons supports 4-player co-op with both local and online modes. For v1, the target is much simpler: **two players, same screen, same iPad, two Bluetooth controllers**. No networking, no server, no matchmaking.

Online multiplayer can come later as a stretch goal but adds massive complexity (game state sync, latency handling, server infrastructure) that isn't necessary for the core experience.

### Story

Minecraft Dungeons has a full narrative campaign with cutscenes. For v1, a minimal story wrapper is fine: "a villain has corrupted the land, fight through dungeons to stop them." The focus should be on gameplay systems, not narrative.

### Hub World

A simple menu-based hub rather than a walkable camp. Select your mission, manage gear, visit a shop. This avoids building an entire additional environment and NPC interaction system.

---

## Systems to Build (Priority Order)

### Phase 1: Core Loop (Minimum Playable)

1. **Two-player character controller** with gamepad input
2. **Basic melee combat** with attack combos and dodge roll
3. **One test level** with hand-placed enemies
4. **Health system** with healing potion on cooldown
5. **Basic enemy AI** (melee chaser, ranged attacker)
6. **Loot drops** from enemies (weapons and armor)
7. **Equipment screen** where players can swap gear
8. **Shared camera** that keeps both players in frame

This is the "is this fun?" milestone. If hitting enemies and picking up loot feels good at this stage, everything else is layering.

### Phase 2: Depth

9. **Enchantment system** with random enchantment options per item
10. **Artifact system** with 3 equippable active abilities
11. **Procedural level generation** from room templates
12. **Boss encounter** with attack phases
13. **Difficulty scaling** (enemy health/damage multipliers)
14. **Item rarity tiers**

### Phase 3: Polish and Content

15. **Second biome** with new enemy types
16. **More weapon/armor variety**
17. **Hub screen** with shop and gear management
18. **Sound design and music**
19. **Visual effects** (hit feedback, loot sparkles, enchantment glows)
20. **Save system** using localStorage

### Phase 4: Stretch Goals

21. **The Tower** (roguelike mode with floor progression)
22. **Online co-op** via WebSocket server
23. **More biomes and bosses**
24. **Souls system** as secondary resource
25. **Gilded gear tier**

---

## Key Design Questions to Resolve

These don't need answers right now but will come up during development:

- **Camera behavior in co-op:** Does the camera zoom out when players spread apart? Is there a leash that prevents them from going too far from each other? Minecraft Dungeons uses a leash approach.
- **Loot reservation:** With only two players on the same screen, is per-player loot still necessary or can drops be first-come-first-served? Reservation is friendlier, especially with a kid.
- **Inventory limits:** How many items can a player carry? Minecraft Dungeons has a generous inventory. For v1, a simple limited backpack (20-30 slots) with salvage-for-currency is probably fine.
- **Leveling curve:** How fast should players level up and earn enchantment points? Err on the side of generous for a family game.
- **Enemy density:** Minecraft Dungeons throws huge swarms at you. Browser performance on iPad will be the real constraint here. Need to test early how many animated sprites the game can handle before framerate drops.
- **Touch fallback:** Should the game be playable with touch controls as a fallback if only one person has a controller? Split-screen touch (virtual joystick per player) would be very cramped on iPad but a single-player touch mode could be useful.

---

## The North Star

The game is done when two people can sit on a couch, pick up controllers, run through a dungeon together, fight enemies, collect loot, argue over who gets the legendary sword, and say "one more run" at least twice before stopping.
