# Technical Stack Recommendation

## Constraints That Drove the Decision

Three hard constraints shaped this recommendation:

1. **Must run in a web browser on iPad.** No native app, no App Store. Safari/WebKit is the target runtime.
2. **Claude Code is the primary development tool.** The entire codebase needs to be text files in a repo that Claude Code can read, write, and iterate on. Visual editors and GUI-dependent engines are out.
3. **Two Bluetooth controllers on one iPad.** Local co-op on a shared screen, no networking required for v1.

---

## Recommended Stack

| Layer | Choice | Why |
|---|---|---|
| Game Framework | **Phaser 3** | Most mature HTML5 game framework. Battle-tested on iPad Safari. All code, no GUI editor dependency. Huge ecosystem Claude Code knows well. |
| Language | **TypeScript** | Type safety catches bugs early. Claude Code is strongest with TS. Great Phaser 3 type definitions available. |
| Build Tool | **Vite** | Fast dev server, hot reload, simple config. Works perfectly with Phaser 3 and TypeScript. |
| Input | **Web Gamepad API** | `navigator.getGamepads()` surfaces each Bluetooth controller as a separate object. Player 1 = `gamepad[0]`, Player 2 = `gamepad[1]`. |
| Art Creation | **Aseprite** (2D sprites) or **MagicaVoxel** (3D models rendered to sprite sheets) | Aseprite for hand-drawn pixel art. MagicaVoxel if you want that blocky 3D look pre-rendered into 2D isometric sprites. |
| Level Design | **Tiled** | Free tilemap editor. Exports JSON that Phaser 3 natively imports. Design room templates visually, stitch them procedurally in code. |
| Audio | **Howler.js** | Handles Safari's autoplay restrictions properly. Simple API. Supports sprite sheets for sound effects. |
| Persistence | **localStorage** | Save game state, player inventory, and progress. No backend needed. |
| Hosting | **Cloudflare Pages** | Free tier. Serves static files globally. Or just `vite dev` on your MacBook during development. |
| Dev Workflow | **Claude Code** | Handles all code generation, refactoring, and iteration. You handle art assets and playtesting. |

---

## Options Considered and Why They Were Rejected

### PlayCanvas

A full 3D browser engine with a visual scene editor and good mobile performance.

**Why rejected:** The main value prop is the cloud-based visual editor, which Claude Code can't interact with. You can use PlayCanvas as a code-only engine, but at that point you're fighting the tool's design rather than leveraging it. The community and tutorials are also significantly smaller than Phaser's.

### Three.js + Custom Engine

Raw WebGL access with maximum flexibility. Could do true 3D voxel rendering.

**Why rejected:** You'd be building a game engine from scratch. No built-in physics, no scene management, no animation systems, no tilemap support, no input handling abstractions. The fun-to-boilerplate ratio is terrible for the first several weeks. Every hour spent on engine plumbing is an hour not spent on gameplay.

### Godot with Web Export

Full game engine with an editor, GDScript, and HTML5 export.

**Why rejected:** Godot's web export is historically its weakest target. 3D performance on iPad Safari is unpredictable. Build sizes are large. Claude Code can work with GDScript files but is significantly more fluent with TypeScript. The local editor is great for interactive development but adds a tool outside the Claude Code workflow.

### Unity with WebGL Export

Industry standard game engine with web export capability.

**Why rejected:** Unity's WebGL builds are large and perform poorly on mobile Safari. The engine is designed for native targets. Web is an afterthought. Also, Unity's licensing model adds uncertainty for a project that might grow.

---

## Why Phaser 3 Wins

### Perfect Claude Code Compatibility

The entire game is TypeScript files. No binary scene formats, no visual editor state, no proprietary project files. Claude Code can:

- Scaffold new scenes and game objects
- Write enemy AI behavior
- Build the entire loot/enchantment system
- Generate procedural level logic
- Wire up gamepad input handling
- Refactor and iterate on any system

Everything lives in `.ts` files that Claude Code reads and writes natively.

### Proven iPad Safari Performance

Phaser 3 uses WebGL for rendering with a Canvas fallback. It's been tested extensively on mobile Safari across thousands of shipped games. The framework handles browser-specific quirks (like Safari's audio autoplay policy) so you don't have to.

### Built-in Game Systems

Phaser 3 provides out of the box:

- **Physics** (Arcade physics for simple AABB collision, Matter.js for more complex needs)
- **Sprite animation** with frame-based animation management
- **Tilemap support** with native Tiled JSON import
- **Camera system** with follow, zoom, bounds, and shake effects
- **Particle system** for visual effects
- **Input management** including gamepad, touch, keyboard
- **Scene management** for switching between menu, gameplay, inventory screens
- **Audio** management (though Howler.js is recommended for Safari reliability)
- **Tweens** for smooth animations and transitions

### Massive Ecosystem

Phaser has the largest HTML5 game development community. This means:

- Extensive documentation and examples
- Hundreds of tutorials, many specifically for ARPG/dungeon crawler games
- Active forums and Discord for troubleshooting
- Claude Code has deep training data on Phaser patterns

---

## The 2D Isometric Tradeoff

The biggest tradeoff in this stack is going 2D isometric instead of true 3D. This means:

**What you lose:**

- The 3D voxel Minecraft look
- Dynamic lighting and shadows
- Camera rotation
- True depth/perspective

**What you gain:**

- Dramatically better iPad performance (2D sprites are far cheaper than 3D meshes)
- Simpler collision detection and physics
- Faster content creation (pixel art sprites vs. 3D models + textures + rigging)
- The entire Phaser ecosystem of tools and tutorials
- A proven, reliable rendering pipeline on mobile Safari

**The visual workaround:** If the blocky 3D look matters, you can model characters and enemies in MagicaVoxel (free voxel editor), render them from an isometric angle, and export as sprite sheets. This gives the visual flavor of 3D voxels with the performance and simplicity of 2D sprites. Many successful indie games use this technique.

---

## Gamepad Input Details

### How It Works

iPadOS supports multiple simultaneous Bluetooth controllers. The Web Gamepad API (`navigator.getGamepads()`) returns an array where each connected controller gets its own index.

```
Player 1: navigator.getGamepads()[0]
Player 2: navigator.getGamepads()[1]
```

Each gamepad object exposes buttons and axes (joysticks) that you poll each frame.

### Supported Controllers

- Xbox Wireless Controller
- PlayStation DualSense (PS5) and DualShock 4 (PS4)
- MFi-compatible controllers
- Various third-party Bluetooth controllers

### Caveats

- Safari's Gamepad API implementation can lag behind Chrome's. Button mapping may vary by controller brand. Test early with your actual controllers.
- Use gamepad-tester.com from your iPad to verify all inputs register correctly before building input handling code.
- Some controllers may need a "press any button" prompt to activate the Gamepad API, as browsers require user interaction before surfacing gamepad data.

---

## Architecture: No Backend Required

The entire v1 is a static frontend application. All game logic runs client-side in the browser.

### What Runs in the Browser

- Game loop and rendering (Phaser 3)
- Both players' input processing (Gamepad API)
- Enemy AI and pathfinding
- Collision detection and physics
- Loot generation and drop logic
- Procedural level assembly
- Inventory and equipment management
- Save/load via localStorage

### Deployment

The build output is just static files: one `index.html`, bundled JavaScript, and asset files (images, audio, JSON tilemaps). These can be served from anywhere:

- **During development:** `vite dev` on your MacBook, iPad points to your local IP
- **For sharing/playing:** Cloudflare Pages, GitHub Pages, Netlify, or any static host
- **Offline play:** Service worker could cache everything for offline use if desired

### When a Backend Would Become Necessary

- **Online multiplayer:** WebSocket server for real-time game state sync. Colyseus (Node.js) would be the recommendation here. Would require a small server on fly.io, Railway, or similar.
- **Cloud saves:** If you want progress to sync across devices. A simple REST API with a database, or even a service like Firebase.
- **Leaderboards or shared data:** Any feature where players need to read/write to a shared data store.

None of these are needed for v1. The game works fully offline as a static site.

---

## Project Structure

A clean repo structure that Claude Code can navigate:

```
dungeon-game/
  src/
    main.ts                  # Entry point, Phaser config
    scenes/
      BootScene.ts           # Asset loading
      MenuScene.ts           # Title screen, game setup
      GameScene.ts           # Main gameplay
      InventoryScene.ts      # Equipment management overlay
      HubScene.ts            # Mission select, shop
    entities/
      Player.ts              # Player character class
      Enemy.ts               # Base enemy class
      enemies/
        MeleeEnemy.ts
        RangedEnemy.ts
        Boss.ts
    systems/
      InputManager.ts        # Gamepad polling, input mapping
      LootSystem.ts          # Drop tables, rarity rolls
      EnchantmentSystem.ts   # Enchantment definitions, application
      CombatSystem.ts        # Damage calculation, hit detection
      CameraManager.ts       # Co-op camera that keeps both players in frame
      LevelGenerator.ts      # Procedural room stitching
      SaveSystem.ts          # localStorage persistence
    data/
      weapons.ts             # Weapon definitions
      armor.ts               # Armor definitions
      enchantments.ts        # Enchantment definitions
      artifacts.ts           # Artifact definitions
      enemies.ts             # Enemy stat tables
      lootTables.ts          # Drop probability tables
    ui/
      HUD.ts                 # Health bars, cooldowns, minimap
      InventoryUI.ts         # Gear management interface
      LootPopup.ts           # Item pickup display
    utils/
      math.ts
      random.ts
  public/
    assets/
      sprites/               # Character and enemy sprite sheets
      tiles/                  # Tilemap images
      audio/                  # Sound effects and music
      ui/                     # UI element images
    tilemaps/                 # Tiled JSON exports for room templates
  index.html
  package.json
  tsconfig.json
  vite.config.ts
```

---

## Development Workflow

1. **Claude Code** writes and modifies all `.ts` source files
2. **Vite** hot-reloads changes instantly in the browser during dev
3. **Tiled** (manual) creates room template tilemaps exported as JSON
4. **Aseprite or MagicaVoxel** (manual) creates art assets
5. **Test on iPad** by pointing Safari at your Mac's local dev server IP
6. **Build and deploy** with `npm run build`, push `dist/` to Cloudflare Pages

The split is clean: Claude Code owns the code, you own the art and level design, playtesting happens on the actual target device.

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Safari Gamepad API quirks | Controllers don't map correctly | Test on iPad with actual controllers in week 1 before building anything else |
| Sprite count performance on iPad | Too many enemies causes frame drops | Benchmark early with 50+ animated sprites. Phaser's object pooling helps. Reduce enemy count if needed. |
| Isometric depth sorting bugs | Sprites render in wrong order | Phaser's built-in depth sorting works for most cases. Use y-position sorting. |
| localStorage limits (~5MB) | Save data gets too large | Keep saves lean. Store item IDs and enchantment indices, not full objects. 5MB is plenty for game saves. |
| Tiled JSON import edge cases | Tilemap rendering issues | Use Phaser's well-documented Tiled integration. Stick to simple orthogonal or isometric maps. |
| Audio autoplay on Safari | Sound doesn't play on first load | Howler.js handles this. Add a "tap to start" screen that satisfies Safari's user interaction requirement. |
