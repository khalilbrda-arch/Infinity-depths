# Infinity Depths — Project State

> Purpose:
> This file records the current implementation reality of the project.
> It is not the game design specification and must not describe future features
> as if they already exist.

Last Updated: 2026-09-05 (Phase 5 — Vertical Slice, wave orchestration wired;
Save/Reload boundary implemented; boot-order regression test added;
manual browser verification found and fixed 2 real bugs (wave hangs
if an enemy reaches the base; collected treasures reappear after
reload) — 99/99 automated tests passing; Base HP never regenerating
between waves confirmed as by-design, not a bug; real device
verification of the two fixes still pending)

Project: Infinity Depths
Repository: khalilbrda-arch/Infinity_depths
Branch: main

---

# 1. Current Development Protocol

Every development cycle follows this exact order:

READ
→ INSPECT
→ UNDERSTAND
→ PLAN
→ IMPLEMENT
→ TEST
→ REGRESSION
→ DOCUMENT
→ REPORT
→ STOP

Rules:

- Never claim a feature works without testing it.
- Never silently perform a large refactor.
- Never replace a working system merely for aesthetics.
- Never create duplicate systems.
- Never introduce architecture without inspecting the existing implementation.
- Never delete existing code without verifying that it is unused or intentionally replaced.
- Never advance automatically to the next phase.
- Never expand scope during implementation.
- Every phase has a gate.
- A gate must be passed before the next phase begins.
- Existing working systems must be preserved unless a justified architectural change is required.
- All important architectural changes must be reflected in project documentation.
- Automated tests are part of the development process.
- Mobile verification must eventually include real-device testing.

---

# 2. Current Project Phase

Current Phase:

Phase 5 — Vertical Slice

Current Gate:

Architecture Gate — PASSED

Phase 5 Status:

NOT YET COMPLETED

Next Required Gate:

Vertical Slice Gate

Important:

Phase 5 must prove the representative end-to-end gameplay loop.

Do not begin large Economy, Progression, Collection, Merge, Boss,
Quest, Online, or other future expansion work before the Vertical Slice
has been implemented and its gate has passed.

---

# 3. Phase History

Phase 0 — Full Repository Audit

Status: PASSED

Result:

- Repository inspected.
- Existing systems identified.
- Current implementation reality documented.
- Existing architecture risks identified.
- Existing gameplay preserved.

---

Phase 1 — Project Memory

Status: PASSED

Result:

Project documentation structure established.

Primary project documentation includes:

- PROJECT_STATE.md
- GAME_SPEC.md
- ARCHITECTURE.md
- ARCHITECTURE_DEBT.md
- ROADMAP.md
- TECHNICAL_RULES.md
- DECISIONS.md
- CHANGELOG.md
- TESTING.md
- SAVE_SCHEMA.md
- CONTENT_PIPELINE.md
- AI_DEVELOPMENT_PROTOCOL.md

---

Phase 2 — Source of Truth

Status: PASSED

Current documentation hierarchy:

GAME_SPEC
↓
Design Truth

PROJECT_STATE
↓
Current Implementation Reality

ARCHITECTURE
↓
Technical Structure

DECISIONS
↓
Decision Rationale

ROADMAP
↓
Future Development

CODE
↓
Actual Implementation

TESTING
↓
Verification / Proof

When contradictions appear:

1. Inspect implementation.
2. Determine intended behavior.
3. Determine authoritative source.
4. Record the decision.
5. Update affected documentation.
6. Continue only after the contradiction is understood.

---

Phase 3 — System Ownership

Status: PASSED

Major system ownership boundaries were established.

Important ownership principles:

- Game.js is the application-level coordinator.
- GameState owns current global/session gameplay state that has not yet been separated.
- EconomySystem owns runtime currency balance.
- EnemyManager owns active enemy instances and lifecycle.
- WaveManager owns wave state and progression.
- DefenseManager owns placed defenses and placement.
- CombatSystem owns combat resolution boundary.
- Projectile system owns projectile runtime behavior.
- UI remains presentation-only.
- EventBus remains infrastructure-only.
- DataContracts validates data entering runtime systems.

---

# 4. Architecture Foundation

Phase 4 — Architecture Foundation

Status:

PASSED

The foundation was implemented and verified.

Current architecture foundation includes:

- EventBus
- DataContracts
- EconomySystem boundary
- CombatSystem boundary
- Game integration boundary
- WaveManager/GameState decoupling
- EnemyManager event communication
- UI/GameState separation
- Automated foundation tests
- Automated integration tests
- Automated regression tests
- Static architecture audit
- Architecture Gate test

---

# 5. Architecture Gate

Status:

PASSED

Gate verification exists at:

tests/phase4-architecture-gate.test.js

The gate verifies, among other things:

- Required foundation files exist.
- EconomySystem owns runtime currency.
- EconomySystem does not depend directly on GameState.
- Game synchronizes EconomySystem with GameState.
- DataContracts exists for current core data.
- EventBus remains infrastructure-only.
- Save ownership is documented.
- UI does not directly depend on GameState.
- Static architecture audit exists.
- Regression testing remains part of the foundation.

The repository also contains the Phase 4 automated test suite.

Latest verified Phase 4 workflow:

Workflow:
Phase 4 Tests

Run:
#22

Commit:
2c4dc4b2162097258e9fc4c9be9f94c185eb95eb

Result:

SUCCESS

Verified jobs:

1. Phase 4 Foundation Tests
2. Phase 4 Integration Tests
3. Phase 4 Regression Tests
4. Phase 4 Static Architecture Audit

All four jobs passed.

---

# 6. Current Technology

Rendering:

- Three.js
- Version currently loaded: r128
- Loaded through CDN in index.html

Application architecture:

- Browser-based JavaScript application.
- Script files are loaded manually through index.html.
- Current code does not use ES module imports as its primary runtime architecture.

Current dependency/build state:

- package-lock.json exists.
- package.json is not currently present.
- packages object in package-lock.json is empty.
- No Vite pipeline.
- No Webpack pipeline.
- No TypeScript pipeline.
- No native Android/Gradle project.
- No production build pipeline.

Testing:

- Node.js test runner.
- GitHub Actions.
- Phase 4 automated test workflow.

The current manually loaded script architecture is intentionally retained until
a controlled build-system migration is justified.

Do not introduce build tooling merely for appearance.

---

# 7. Current Repository Structure

Current repository contains:

/
├── .github/
│   └── workflows/
│       └── phase4-tests.yml
│
├── index.html
├── package-lock.json
│
├── AI_DEVELOPMENT_PROTOCOL.md
├── ARCHITECTURE.md
├── ARCHITECTURE_DEBT.md
├── CHANGELOG.md
├── CONTENT_PIPELINE.md
├── DECISIONS.md
├── GAME_SPEC.md
├── PROJECT_STATE.md
├── README.md
├── ROADMAP.md
├── SAVE_SCHEMA.md
├── TECHNICAL_RULES.md
└── TESTING.md
│
├── src/
│   ├── camera/
│   │   └── CameraController.js
│   │
│   ├── combat/
│   │   ├── CombatSystem.js
│   │   ├── Projectile.js
│   │   └── ProjectileManager.js
│   │
│   ├── core/
│   │   ├── Config.js
│   │   ├── DataContracts.js
│   │   ├── EventBus.js
│   │   ├── Game.js
│   │   ├── GameState.js
│   │   └── Time.js
│   │
│   ├── defenses/
│   │   ├── Defense.js
│   │   └── DefenseManager.js
│   │
│   ├── economy/
│   │   └── EconomySystem.js
│   │
│   ├── enemies/
│   │   ├── Enemy.js
│   │   ├── EnemyManager.js
│   │   └── EnemyPath.js
│   │
│   ├── input/
│   │   └── TouchControls.js
│   │
│   ├── interaction/
│   │   └── InteractionController.js
│   │
│   ├── ui/
│   │   ├── BaseHUD.js
│   │   ├── DefenseUI.js
│   │   ├── GameOverUI.js
│   │   ├── Toast.js
│   │   └── WaveUI.js
│   │
│   ├── waves/
│   │   ├── WaveManager.js
│   │   └── WaveOrchestrator.js
│   │
│   └── world/
│       ├── DefenseMap.js
│       ├── Interactables.js
│       ├── Island.js
│       └── Ocean.js
│
└── tests/
    ├── phase4-architecture-audit.test.js
    ├── phase4-architecture-gate.test.js
    ├── phase4-foundation.test.js
    ├── phase4-integration.test.js
    ├── phase4-regression.test.js
    └── phase5-vertical-slice.test.js

---

# 8. Game Design Reality

Infinity Depths is currently:

- 3D
- Mobile-first
- Strategy
- Tower Defense
- Base Building
- Combat
- Offline PvE first
- Future Online PvP / Co-op
- Browser-based Three.js project

The current prototype is not yet a production-ready game.

The architecture is being stabilized before large-scale content expansion.

---

# 9. Camera

Current implementation:

- Fixed-angle top-down camera.
- Approximately 58° intended viewing angle.
- Camera pan.
- Camera zoom.
- Camera bounds.
- Touch-oriented interaction.

The player does not control a character body.

Not part of the intended core control model:

- WASD movement.
- First-person camera.
- Third-person character movement.
- Joystick-controlled avatar.
- Exploration controlled by a character.

The camera is the primary player/world interaction viewpoint.

---

# 10. World

Current world systems:

- Ocean.
- Island/base.
- Defense map.
- World interactables.
- Basic environment objects.

Current visual implementation is prototype-level.

Current rendering relies heavily on:

- Three.js primitive geometry.
- Prototype materials.
- Procedural/basic scene construction.

Not yet implemented as production systems:

- Final asset pipeline.
- Advanced environment simulation.
- Weather.
- Day/night.
- Advanced environmental events.
- Production VFX environment layer.
- Production audio environment.

Important design rule:

The core game does not use exploration/fog-of-war as a mandatory gameplay system.

The visible battlefield is intended to remain available to the player.

Progression unlocks maps/levels/content rather than hiding the current battlefield
behind exploration.

---

# 11. Core Game Coordinator

File:

src/core/Game.js

Game.js currently owns application-level coordination.

Responsibilities currently include:

- Scene creation.
- Camera creation.
- Renderer creation.
- Lighting.
- Sky.
- World initialization.
- Input initialization.
- Interaction initialization.
- Base HUD initialization.
- Economy initialization.
- Event subscriptions.
- EnemyManager initialization.
- WaveManager initialization.
- ProjectileManager initialization.
- DefenseManager initialization.
- Main game loop.
- Resize handling.
- Debug HUD.

Game.js must remain a coordinator.

It must not gradually become the owner of:

- Combat rules.
- Economy rules.
- Enemy rules.
- Defense rules.
- Wave rules.
- Progression rules.
- Quest rules.
- Save rules.

Cross-system coordination may remain in Game.js when it represents an
application boundary rather than domain ownership.

---

# 12. Game State

File:

src/core/GameState.js

GameState currently contains runtime state including:

- Player level.
- Player XP.
- Player currency.
- Player rank.
- Unlocked areas.
- Unlocked defenses.
- Interaction state.
- Base HP.
- Base maximum HP.

Current state operations include:

- Currency-related compatibility state.
- Interaction registration.
- Base damage.
- Base destruction detection.
- State summary.

Current architecture status:

PARTIAL

GameState remains a broad state container.

This is still a long-term architecture risk.

However:

GameState is no longer allowed to become the direct dependency of every gameplay
system.

Current architecture intentionally separates important domains gradually.

Do not perform a blind complete GameState rewrite.

---

# 13. EventBus

File:

src/core/EventBus.js

Status:

IMPLEMENTED

EventBus is infrastructure-only.

It does not own gameplay state.

Current API:

- on(eventName, listener)
- off(eventName, listener)
- offAll(eventName)
- emit(eventName, payload)
- hasListeners(eventName)
- clear()

EventBus does not directly depend on:

- GameState
- WaveManager
- EnemyManager
- DefenseManager
- EconomySystem
- CombatSystem

Current implementation:

- Synchronous dispatch.
- No event queue.
- No async dispatch.
- No gameplay logic inside EventBus.
- Listener exceptions are isolated.
- Listener snapshots are used during dispatch.

EventBus is intentionally small.

Do not turn it into a gameplay manager.

---

# 14. Current Event Boundaries

Current important events include:

EnemySpawned
EnemyDamaged
EnemyReachedBase
EnemyDied

WaveStarted
WaveCompleted
EnemyDefeated

BaseDestroyed

CurrencyChanged

These events are currently used selectively.

Events must not be introduced indiscriminately.

The owning system must emit the event.

The receiving system must not gain hidden ownership of the sender's state.

---

# 15. Base Damage Boundary

Current architecture:

EnemyManager
↓
EnemyReachedBase
↓
Game
↓
GameState.damageBase()
↓
BaseDestroyed
↓
EventBus
↓
WaveManager

EnemyManager does not directly modify GameState.

Game.js is the application integration boundary.

GameState remains the current owner of base HP state.

WaveManager reacts to BaseDestroyed rather than reading GameState directly.

This is an important completed Architecture Foundation boundary.

---

# 16. Economy

File:

src/economy/EconomySystem.js

Status:

FOUNDATION IMPLEMENTED

EconomySystem owns the runtime currency balance.

Current API:

- init(initialBalance)
- canAfford(amount)
- spend(amount)
- add(amount)
- rewardEnemyKill(reward)
- getBalance()

EconomySystem does not directly depend on GameState.

Current synchronization:

Game
↓
EconomySystem.init(GameState.player.currency)

EconomySystem
↓
CurrencyChanged
↓
Game
↓
GameState.player.currency

Current economy functionality:

- Currency balance.
- Affordability validation.
- Spending.
- Adding currency.
- Enemy kill rewards.
- CurrencyChanged event.

Current limitations:

The full production Economy system does not yet exist.

Missing future economy features include:

- Multiple resource types.
- Production/generation.
- Complete transaction model.
- Economy persistence.
- Upgrade economy.
- Full balancing framework.
- Complete economy UI.
- Save integration.
- Advanced resource systems.

Do not treat the current EconomySystem as the final economy implementation.

Do not expand Economy into Phase 6 before the Vertical Slice Gate.

---

# 17. Defense System

Files:

src/defenses/Defense.js
src/defenses/DefenseManager.js

UI:

src/ui/DefenseUI.js

Current status:

IMPLEMENTED CORE GAMEPLAY

Current functionality:

- Defense instances.
- Defense configuration.
- Defense placement.
- Tap-to-place interaction.
- Free placement.
- Placement validation.
- Overlap prevention.
- Economy affordability check.
- Economy spending through EconomySystem.
- Defense update loop.
- Defense cleanup.

Current placement model:

FREE PLACEMENT

Not fixed slots.

Deferred:

- Moving already placed defenses.

DefenseManager currently validates defense definitions through DataContracts.

DefenseManager does not directly access GameState.

Economy interaction goes through EconomySystem.

The existing defense gameplay should be integrated into the Vertical Slice,
not unnecessarily rebuilt.

---

# 18. Combat

Directory:

src/combat/

Current files:

- CombatSystem.js
- Projectile.js
- ProjectileManager.js

Current status:

IMPLEMENTED CORE COMBAT

Current functionality includes:

- Defense attacks.
- Projectile creation.
- Projectile movement.
- Projectile targeting.
- Projectile hit handling.
- Enemy damage.
- Combat resolution boundary.
- Enemy damage/death flow.
- Status-effect structure.

Current architecture:

Projectile
↓
CombatSystem
↓
EnemyManager
↓
Enemy

Projectile no longer directly performs:

EnemyManager.damageEnemy()

CombatSystem provides the combat resolution boundary.

Current combat architecture is sufficient for integration into the Vertical Slice.

Do not rebuild Combat merely for architectural aesthetics.

---

# 19. Enemies

Directory:

src/enemies/

Files:

- Enemy.js
- EnemyManager.js
- EnemyPath.js

Current status:

CORE SYSTEM IMPLEMENTED

Enemy owns:

- Enemy instance state.
- Health.
- Movement state.
- Path state.
- Status-effect runtime state.
- Alive/dead state.
- Base arrival state.
- Enemy lifecycle.

EnemyManager owns:

- Active enemy collection.
- Enemy spawning.
- Enemy updating.
- Enemy cleanup.
- Alive-enemy queries.
- Enemy damage entry point.
- Enemy death handling.
- Base-arrival detection.
- Event emission.

Current events emitted by EnemyManager include:

- EnemySpawned
- EnemyDamaged
- EnemyReachedBase
- EnemyDied

EnemyManager does not directly modify:

- GameState.
- Economy.
- UI.

Enemy death rewards are emitted through EnemyDied and processed at the
application/economy boundary.

---

# 20. Waves

File:

src/waves/WaveManager.js

src/waves/WaveOrchestrator.js

Current status:

CORE SYSTEM PRESENT AND WIRED END-TO-END

WaveManager owns:

- Current wave.
- Wave active state.
- Wave completion state.
- Spawned enemy count.
- Defeated enemy count.
- Wave configuration.
- Base-destroyed local state.

WaveManager reacts to:

BaseDestroyed

through EventBus.

WaveManager does not directly depend on GameState.

Current methods include:

- init()
- startWave()
- update()
- registerEnemySpawn()
- registerEnemyDefeat()
- isGameOver()
- summary()

WaveOrchestrator (new — closes the previous integration gap):

Before this phase, nothing in the project ever called
WaveManager.startWave(). CONFIG.WAVES already contained full
data-driven scaling (BASE_ENEMY + SCALING per wave), but it was
never read by anything. WaveOrchestrator is the system that reads
CONFIG.WAVES, computes each wave's enemy template/quantity, drives
the pre-wave and between-wave countdowns, spawns enemies over time
through EnemyManager.spawnEnemy(), and forwards EnemyDied into
WaveManager.registerEnemyDefeat(). It exposes getUIData() for
WaveUI.

WaveOrchestrator does not own wave state — WaveManager remains the
single owner. WaveOrchestrator only orchestrates timing and calls
into WaveManager/EnemyManager.

Important:

The end-to-end loop (countdown -> wave start -> spawn -> combat ->
defeat -> WaveCompleted -> next countdown -> base destroyed ->
game over) is now covered by automated tests
(tests/phase5-vertical-slice.test.js) and runs without throwing.
Real mobile/browser verification and persistence/reload have not
been performed — see Section 44 and Section 51.

---

# 21. Interaction

File:

src/interaction/InteractionController.js

Current status:

CORE SYSTEM PRESENT

Current functionality:

- Tap interaction.
- World interaction.
- Defense placement interaction.
- Interaction with visible world objects.

Interaction is an input/application boundary.

It should not become the owner of gameplay state.

---

# 22. Input

File:

src/input/TouchControls.js

Current status:

CORE SYSTEM PRESENT

Current functionality:

- Touch input.
- Camera pan.
- Zoom.
- Mobile-oriented gestures.

The project is Mobile-First.

Input should translate device actions into gameplay/application requests rather
than own gameplay rules.

---

# 23. UI

Directory:

src/ui/

Files:

- BaseHUD.js
- DefenseUI.js
- GameOverUI.js
- Toast.js
- WaveUI.js

Current status:

FUNCTIONAL PROTOTYPE UI

Current UI functionality includes:

- Base HP display.
- Wave information (WaveUI — now initialized and fed data by
  Game.js/WaveOrchestrator each frame; previously created but never
  wired to anything).
- Defense selection/placement UI.
- Toast notifications.
- Game-over UI (GameOverUI — now triggered by the BaseDestroyed
  event through Game.js; previously existed but nothing ever called
  .show() on it).
- Defense placement state handling.

Architecture rule:

UI does not own authoritative gameplay state.

UI must not:

- Directly modify GameState.
- Perform authoritative economy transactions.
- Calculate combat damage.
- Spawn enemies directly.
- Complete quests directly.
- Write save data directly.

UI should display gameplay state and request actions.

---

# 24. Time

File:

src/core/Time.js

Current status:

WORKING

Responsibilities:

- Central game clock.
- Delta time.
- Elapsed time.
- Three.js clock integration.

Gameplay systems that depend on time should use the central time source
where practical.

Do not introduce independent clocks without a justified reason.

---

# 25. Data Contracts

File:

src/core/DataContracts.js

Current status:

FOUNDATION IMPLEMENTED

Current validation includes:

- Enemy Definition.
- Enemy Spawn Data.
- Defense Definition.
- Configuration.

Current validators include:

- validateEnemyDefinition()
- validateEnemySpawnData()
- validateDefenseDefinition()
- validateConfig()

The architecture distinguishes:

Definition
vs
Runtime Instance

Example:

EnemyDefinition
↓
Enemy Runtime Instance

DefenseDefinition
↓
Defense Runtime Instance

DataContracts should remain architecture-neutral.

It should validate data rather than own gameplay state.

Future contracts may include:

- BossDefinition.
- RewardDefinition.
- UpgradeDefinition.
- QuestDefinition.
- MapDefinition.
- MergeDefinition.

These are future expansions and are not currently implemented as full runtime
systems.

---

# 26. Configuration

File:

src/core/Config.js

Current status:

IMPLEMENTED PROTOTYPE CONFIGURATION

Configuration currently contains runtime configuration for existing systems,
including:

- Camera.
- Lighting.
- Sky.
- Performance.
- Defense configuration.
- Base configuration.
- World/gameplay configuration.

Configuration should remain structured.

Do not allow Config.js to become an unstructured global data dump.

As the project grows, configuration may be separated where ownership requires it.

---

# 27. Save System

Current status:

PARTIAL — MINIMUM VIABLE SAVE/RELOAD BOUNDARY IMPLEMENTED
(Vertical Slice scope only, not the full future contract below)

Important distinction:

The SAVE CONTRACT IS DOCUMENTED (SAVE_SCHEMA.md).

A real, tested SaveManager now exists (src/save/SaveManager.js) and is
wired into Game.js, but it implements only the subset required by the
Vertical Slice Gate (ROADMAP.md Phase 5) — not the full future contract
described below.

What is actually implemented and covered by automated tests
(tests/phase5-save-reload.test.js, 24/24 passing):

- SaveManager.serialize() — builds plain, versioned save data from
  GameState + WaveManager + DefenseManager. No Three.js/DOM/runtime
  object is ever serialized (SAVE_SCHEMA.md §5).
- SaveManager.validate() — structure/type/range checks before any save
  is accepted or applied (SAVE_SCHEMA.md §20). Never throws.
- SaveManager.save() / load() — persist to an injected storage backend
  (localStorage in the browser, a fake in-memory backend in tests).
  A missing/corrupted/structurally-invalid save is ignored (returns
  null) rather than applied or crashing boot (SAVE_SCHEMA.md §21-22).
- SaveManager.applyToGameState() / applyToWaveManager() /
  applyToDefenseManager() — restore currency, level/xp/rank, base HP
  (clamped to the current CONFIG max), interactions.openedIds, the
  current wave number, and placed defenses (via the new
  DefenseManager.restoreDefense()).
- Save points (SAVE_SCHEMA.md §19): a checkpoint is saved on
  WaveCompleted. On BaseDestroyed the save is deliberately CLEARED
  instead of persisted, so the existing "إعادة المحاولة" button
  (window.location.reload()) starts a genuinely fresh game — see
  DECISIONS.md DEC-019.
- Game.js load-and-apply ordering: the GameState portion of a save is
  applied before Interactables.create() and EconomySystem.init() (the
  latter reads the initial balance from GameState once at boot); the
  wave/defenses portion is applied after WaveManager.init() and
  DefenseManager.init() (both reset their own state during init()).
  This ordering was itself corrected this update — GameState used to
  be restored after Interactables.create(), which was the second root
  cause of the treasure-recollection bug fixed below.

Real-device verification performed so far:

- Reloading mid-run (after at least one WaveCompleted) was manually
  confirmed to restore currency, base HP, current wave, and placed
  defenses correctly.
- The same manual session also surfaced that collected treasures
  reappeared as collectible after reload — this was a real bug (not a
  limitation of scope), now fixed and covered by
  tests/phase5-interactables-persistence.test.js (4/4). The fix itself
  has NOT yet been re-verified on a real device — see Section 54.

Current limitations (still NOT implemented — do not claim otherwise):

- No schema migration engine (only schemaVersion 1 exists so far; an
  unsupported version is currently just rejected, not migrated).
- No backup/secondary save slot (SAVE_SCHEMA.md §23) — a single primary
  save key only.
- Progression/Collection/Inventory/Quests are not saved because those
  systems do not exist yet (see §28-29, §32) — nothing to serialize.

Do not claim the FULL SAVE_SCHEMA.md contract (migration, backup,
quest/progression/collection persistence) works until those systems
exist and are implemented against this same boundary.

---

# 28. Progression

Current status:

PARTIAL STATE ONLY

GameState currently contains:

- Player level.
- XP.
- Rank.
- Unlocked areas.
- Unlocked defenses.

A dedicated ProgressionSystem does not yet exist.

Missing:

- Dedicated progression ownership.
- Formal XP rules.
- Level-up rules.
- Unlock contracts.
- Map progression runtime.
- Persistence.
- Complete progression UI.

Progression must be implemented through a controlled future phase.

---

# 29. Collection / Inventory

Current status:

NOT IMPLEMENTED

No complete CollectionSystem exists.

Future responsibilities:

- Ownership.
- Quantities.
- Content metadata.
- Rarity.
- Unlocks.
- Persistent ownership.
- Collection queries.
- Integration with rewards and merge.

No collection architecture should be duplicated elsewhere.

---

# 30. Merge System

Current status:

NOT IMPLEMENTED

No runtime MergeSystem exists.

Future requirements include:

- Merge definitions.
- Recipe validation.
- Input requirements.
- Costs.
- Result generation.
- Collection integration.
- Progression integration.
- Save integration.
- Deterministic/testable execution.

Do not implement before the appropriate phase/gate.

---

# 31. Boss System

Current status:

NOT IMPLEMENTED

Bosses must eventually extend the existing enemy/combat architecture.

A separate parallel enemy engine must not be created.

Future boss functionality may include:

- Boss definitions.
- Phases.
- Special abilities.
- Enrage.
- Boss-specific behavior.
- Boss UI.
- Boss rewards.
- Boss VFX/audio hooks.

---

# 32. Quests

Current status:

NOT IMPLEMENTED

Future QuestSystem should primarily consume gameplay events.

Example:

EnemyDied
↓
QuestSystem
↓
Objective progress

The Enemy system must not know individual quest rules.

---

# 33. Weather / Day & Night

Current status:

NOT IMPLEMENTED

Future world systems.

Potential responsibilities:

- Weather.
- Day/night.
- Environmental modifiers.
- World events.

These must communicate through controlled world contracts/events.

---

# 34. Audio

Current status:

NOT IMPLEMENTED AS A PRODUCTION SYSTEM

No production audio architecture currently exists.

Future system may include:

- Music.
- Ambient audio.
- UI sounds.
- Combat sounds.
- Defense sounds.
- Enemy sounds.
- Boss sounds.
- Event sounds.

---

# 35. VFX

Current status:

NOT IMPLEMENTED AS A PRODUCTION SYSTEM

No production VFX architecture currently exists.

Future system may include:

- Projectile effects.
- Hit effects.
- Status effects.
- Defense effects.
- Enemy death effects.
- Boss effects.
- Environment effects.
- UI feedback.

---

# 36. Asset Pipeline

Current status:

NOT IMPLEMENTED AS A COMPLETE PRODUCTION PIPELINE

Current visual assets are primarily:

- Three.js primitives.
- Prototype geometry.
- Prototype materials.

Intended architecture:

Gameplay Definition
↓
Visual ID
↓
Asset Registry
↓
Model / Texture / Animation / VFX

Raw asset references should not become scattered throughout gameplay code.

---

# 37. Performance

Current status:

NO FORMAL PERFORMANCE BASELINE

No verified production measurements currently exist for:

- FPS targets.
- Frame time.
- CPU usage.
- GPU usage.
- Memory.
- Draw calls.
- Active entity counts.
- Projectile counts.
- VFX counts.
- Loading time.
- Thermal behavior.

Performance optimization must be measurement-driven.

Future performance verification must include real mobile devices.

Do not claim production performance is acceptable without measurements.

---

# 38. Mobile

The project is designed Mobile-First.

Current mobile-oriented features:

- Touch controls.
- Touch camera pan.
- Touch zoom.
- Tap interaction.
- Mobile viewport configuration.

Final mobile verification is NOT complete.

Future real-device testing must include:

- Touch reliability.
- Different screen sizes.
- Different aspect ratios.
- FPS/performance.
- Memory.
- Browser compatibility.
- Orientation.
- Long sessions.
- Background/resume behavior.

Rule:

No mobile system is considered fully verified without real-device testing.

---

# 39. Android

Current status:

NOT IMPLEMENTED

There is no native Android/Gradle project in the repository.

Do not introduce Android packaging before the web gameplay architecture and
Vertical Slice are sufficiently stable.

The browser game remains the current runtime target.

---

# 40. Automated Testing

Current status:

IMPLEMENTED FOUNDATION

Testing uses:

Node.js built-in test runner.

Current test files:

- tests/phase4-foundation.test.js
- tests/phase4-integration.test.js
- tests/phase4-regression.test.js
- tests/phase4-architecture-audit.test.js
- tests/phase4-architecture-gate.test.js
- tests/phase5-vertical-slice.test.js
- tests/phase5-save-reload.test.js
- tests/phase5-boot-order.test.js (loads every src/ file in the
  exact literal order declared in index.html inside one shared vm
  context, without calling Game.init(); guards specifically against
  the Risk 7 class of bug — a top-level class identifier silently
  shadowing a same-named singleton export — which prior tests did not
  cover because they either use isolated per-system contexts or
  static text checks rather than shared-scope runtime resolution)
- tests/phase5-interactables-persistence.test.js (new — guards
  against treasures reappearing as collectible after a page reload;
  see Section 27 and CHANGELOG.md 2026-09-05)

Current automated coverage includes:

- EventBus behavior.
- DataContracts validation.
- GameState interaction behavior.
- Economy behavior.
- Combat boundary.
- Architecture boundaries.
- Game coordination.
- Wave/GameState separation.
- UI/GameState separation.
- Syntax validation.
- Regression checks.

GitHub Actions currently runs:

- Foundation tests.
- Integration tests.
- Regression tests.
- Static architecture audit.

Latest Phase 4 workflow:

Run #22

Result:

PASS

---

# 41. Static Architecture Rules Currently Enforced

Automated architecture audit currently verifies, among other things:

- GameState is not directly referenced throughout gameplay systems.
- WaveManager does not depend on GameState.
- WaveManager uses EventBus for BaseDestroyed.
- Game owns EnemyReachedBase coordination.
- Game applies base damage through GameState.
- Game emits BaseDestroyed after the state transition.
- EventBus exposes its required API.
- GameState does not depend directly on EventBus.
- EventBus remains independent from gameplay systems.
- No obvious self-dependencies through imports/requires.
- All source JavaScript files remain syntactically valid.

These checks are intended to prevent architectural regression.

---

# 42. Current Dependency Boundaries

Current important boundaries:

Game
↓
EconomySystem

EconomySystem
↓
CurrencyChanged
↓
Game
↓
GameState

EnemyManager
↓
EnemyReachedBase
↓
Game
↓
GameState
↓
BaseDestroyed
↓
EventBus
↓
WaveManager

Projectile
↓
CombatSystem
↓
EnemyManager
↓
Enemy

DefenseManager
↓
EconomySystem

DefenseManager
↓
Defense

WaveManager
↓
Enemy spawning/registration boundary

UI
↓
Gameplay/Application commands

UI does not directly own GameState.

---

# 43. Current Gameplay Loop

Current systems collectively provide portions of the following loop:

Game Start
↓
Initial State
↓
Defense Placement
↓
Wave State
↓
Enemy Spawn
↓
Enemy Movement
↓
Defense Targeting
↓
Projectile
↓
Combat Resolution
↓
Enemy Damage
↓
Enemy Death
↓
Currency Reward
↓
Wave Progression
↓
Enemy Reaches Base
↓
Base Damage
↓
Base Destruction
↓
Game Over

Important:

The systems exist, but the complete representative loop has NOT yet passed
the Phase 5 Vertical Slice Gate.

Phase 5 exists specifically to prove this loop end-to-end rather than assuming
that individually working systems automatically form a complete game loop.

---

# 44. Vertical Slice Target

Phase 5 must prove a representative playable loop.

Target:

Game Start
↓
Initial State
↓
Defense Placement
↓
Wave Start
↓
Enemy Spawn
↓
Enemy Movement
↓
Combat
↓
Enemy Damage
↓
Enemy Death
↓
Currency Reward
↓
Wave Completion
↓
Next Wave
↓
Enemy Reaches Base
↓
Base Damage
↓
Base Destruction
↓
Game Over

The Vertical Slice must eventually also prove the appropriate persistence/reload
boundary required by the gate.

Do not mark Phase 5 complete until the complete acceptance criteria are tested.

---

# 45. Current Known Architecture Risks

Risk 1:

GameState remains a broad state container.

Status:

KNOWN / CONTROLLED

Action:

Gradually separate ownership where justified.

Do not perform blind rewrites.

---

Risk 2:

The current project still uses manually loaded JavaScript files.

Status:

KNOWN

Action:

Evaluate build/dependency migration only when justified by project needs.

---

Risk 3:

Save System is not implemented.

Status:

KNOWN

Action:

Implement through the appropriate phase and gate.

---

Risk 4:

Performance baseline is not formally measured.

Status:

KNOWN

Action:

Introduce measurement-based performance testing at the appropriate phase.

---

Risk 5:

Final production assets are not implemented.

Status:

KNOWN

Action:

Use the planned asset contract and later visual-production phases.

---

Risk 6:

Full Vertical Slice integration has not yet been proven.

Status:

PARTIALLY RESOLVED

The core gameplay loop (start -> wave -> spawn -> combat -> defeat
-> completion -> next wave -> base destruction -> game over) now
runs end-to-end and is covered by automated tests
(tests/phase5-vertical-slice.test.js). Still outstanding before the
Vertical Slice Gate can be marked passed:

- Real browser/mobile verification (has not been run at all yet;
  the boot-crash bugs fixed this phase mean it is unknown whether
  prior manual testing ever actually reached a running game).
- Persistence/reload behavior (Save System remains NOT IMPLEMENTED
  — see Section 27).
- Balance/difficulty tuning (current scaling numbers are the
  original CONFIG.WAVES values, unverified by playtesting).

Action:

Perform real browser verification, then evaluate the Vertical Slice
Gate against Section 44's acceptance criteria.

---

Risk 7:

A top-level `class Foo` declaration in any file loaded as a classic
`<script>` creates a global lexical binding for "Foo" that silently
shadows a same-named `globalThis.Foo`/`window.Foo` property for
every later `<script>` tag on the page — this caused a full boot
crash (WaveManager.js) that automated text-based architecture
checks did not catch, because they check file contents, not actual
runtime resolution.

Status:

KNOWN / FIXED FOR WaveManager.js / NOW REGRESSION-TESTED

Action:

No other file in the project currently uses the `class` keyword at
the top level (verified this phase). If a future system is written
as a class, either do not give the class the same identifier as its
exported singleton (as WaveOrchestrator's sibling `WaveManagerClass`
now does), or export it via a module system rather than relying on
identifier shadowing with `globalThis`.

tests/phase5-boot-order.test.js (new this update) loads every src/
file in the real index.html order inside one shared vm scope and
asserts every expected singleton resolves to "object", not
"function". This was verified to actually fail when the exact Risk 7
pattern was temporarily reintroduced (renaming `WaveManagerClass`
back to `WaveManager`), then reverted — so a recurrence of this
specific bug class is now caught automatically by `node --test`
instead of only by manual boot testing.

---

# 46. Explicitly Deferred Features

The following are intentionally NOT current priorities:

- Player character body.
- WASD movement.
- Joystick character movement.
- Exploration system.
- Fog of war.
- Defense movement.
- Full online multiplayer.
- PvP.
- Co-op.
- Native Android packaging.
- Large-scale economy expansion.
- Large-scale progression expansion.
- Collection.
- Merge.
- Bosses.
- Quests.
- Weather.
- Day/night.
- Production audio.
- Production VFX.
- Final art pipeline.

Deferred does not mean cancelled.

It means they must be implemented through the appropriate architecture and
development phase.

---

# 47. Architecture Principles That Must Not Be Violated

Single Ownership:

Every important gameplay state must have one authoritative owner.

UI:

UI must remain presentation-oriented.

Economy:

EconomySystem owns runtime economy balance.

Combat:

Combat resolution belongs to CombatSystem.

Enemies:

EnemyManager/Enemy own enemy runtime state.

Waves:

WaveManager owns wave state.

Persistence:

Save System will own persistence.

Events:

EventBus remains infrastructure-only.

Definitions:

Definitions describe content.

Instances:

Instances contain runtime state.

Game:

Game.js coordinates systems but must not become a God Object.

Dependencies:

Avoid unnecessary circular dependencies.

Content:

Content should become increasingly data-driven.

Testing:

Every architectural change must be tested and regression-checked.

---

# 48. Definition vs Runtime Instance Rule

Definitions describe permanent/static content.

Runtime instances represent active objects.

Example:

EnemyDefinition
↓
Enemy Instance

DefenseDefinition
↓
Defense Instance

Definitions may contain:

- IDs.
- Base statistics.
- Costs.
- Configuration.
- Visual IDs.

Instances may contain:

- Position.
- Runtime health.
- Cooldowns.
- Targets.
- Runtime modifiers.
- Lifecycle state.

Do not mix static content definitions with temporary runtime state.

---

# 49. Offline Rule

The core game must remain playable offline.

Offline PvE must not require:

- Authentication.
- Server connection.
- Remote configuration.
- Online services.

Future online services must sit outside the offline gameplay core.

---

# 50. Future Online Boundary

Future architecture:

Client
↓
Game Application
↓
Gameplay Domain
↓
Online Adapter
↓
Server

Gameplay systems should not all become network-aware.

Future competitive systems should use server-authoritative validation for:

- Currency.
- Damage results.
- Inventory ownership.
- Progression.
- Match results.

This is future architecture only.

It is NOT currently implemented.

---

# 51. Current Verification Status

Repository structure:

VERIFIED

Core architecture:

VERIFIED

EventBus:

VERIFIED

DataContracts:

VERIFIED

Economy boundary:

VERIFIED

Combat boundary:

VERIFIED

Wave/GameState separation:

VERIFIED

UI/GameState separation:

VERIFIED

Automated Phase 4 tests:

PASSED

Static architecture audit:

PASSED

Architecture Gate:

PASSED

Vertical Slice:

CORE LOOP WIRED AND TESTED — real-device verification and gate evaluation still pending

Save/reload:

NOT IMPLEMENTED

Real-device mobile verification:

NOT COMPLETED

Formal performance baseline:

NOT COMPLETED

Production asset pipeline:

NOT IMPLEMENTED

Production audio:

NOT IMPLEMENTED

Production VFX:

NOT IMPLEMENTED

---

# 52. Current Source-of-Truth Snapshot

The following implementation files are currently important to the architecture:

src/core/Game.js

src/core/GameState.js

src/core/EventBus.js

src/core/DataContracts.js

src/core/Config.js

src/core/Time.js

src/economy/EconomySystem.js

src/enemies/Enemy.js

src/enemies/EnemyManager.js

src/enemies/EnemyPath.js

src/waves/WaveManager.js

src/defenses/Defense.js

src/defenses/DefenseManager.js

src/combat/CombatSystem.js

src/combat/Projectile.js

src/combat/ProjectileManager.js

src/interaction/InteractionController.js

src/input/TouchControls.js

src/ui/BaseHUD.js

src/ui/DefenseUI.js

src/ui/GameOverUI.js

src/ui/Toast.js

src/ui/WaveUI.js

src/world/DefenseMap.js

src/world/Interactables.js

src/world/Island.js

src/world/Ocean.js

---

# 53. Phase 5 Rules

Phase 5 must follow:

READ
→ INSPECT
→ UNDERSTAND
→ PLAN
→ IMPLEMENT
→ TEST
→ REGRESSION
→ DOCUMENT
→ REPORT
→ STOP

Before implementation:

- Inspect all systems participating in the Vertical Slice.
- Identify missing integration boundaries.
- Do not rebuild working Defense systems.
- Do not rebuild working Combat systems.
- Do not duplicate Economy.
- Do not bypass EventBus boundaries unnecessarily.
- Do not introduce large future systems.
- Do not mark untested functionality complete.

After implementation:

- Run static validation.
- Run unit tests.
- Run integration tests.
- Run regression tests.
- Run gameplay verification.
- Perform mobile verification where required.
- Document the result.
- Evaluate the Vertical Slice Gate.
- STOP.

---

# 54. Immediate Next Development Objective

The core Vertical Slice loop is wired and passes automated tests
(tests/phase5-vertical-slice.test.js, 11/11 — grew from 9 after this
update). A minimum-viable Save/Reload boundary exists and passes
automated tests (tests/phase5-save-reload.test.js, 24/24) — see
Section 27 for exactly what it does and does not cover. A boot-order
regression test (tests/phase5-boot-order.test.js, 4/4) was also added
— see Section 45 Risk 7. 99/99 automated tests pass across the whole
suite as of this update.

Manual browser/mobile verification of this vertical slice (the
objective this section previously described) was performed and found
two real bugs, both now fixed and covered by new automated tests:

- A wave never advanced past waiting-clear if any enemy reached the
  base instead of dying (WaveOrchestrator never counted it toward
  wave completion). Fixed via
  `WaveOrchestrator.handleEnemyReachedBase()`.
  tests/phase5-vertical-slice.test.js, 2 new tests.
- Collected treasures reappeared as collectible after every page
  reload, because Interactables.js never wrote into
  `GameState.interactions.openedIds` (the only thing SaveManager
  persists) and ran before the save was applied to GameState anyway.
  Fixed by passing the already-opened id list into
  `Interactables.create()` and adding a Game.js listener for the
  pre-existing (previously unlistened) `InteractableConsumed` event.
  New file tests/phase5-interactables-persistence.test.js, 4 tests.

A third symptom reported during the same manual test — Base HP
reaching a very low number after several waves — was investigated and
is not a bug: `healBase()` exists but is never called anywhere, so
Base HP is one persistent pool for the whole run with no
regeneration between waves, by design.

The next authorized objective:

RE-VERIFY THE TWO FIXES ABOVE ON A REAL BROWSER/DEVICE

Specifically, confirm on an actual device (this could not be done in
the sandboxed development environment — no network access to fetch a
browser binary, no display):

- Deliberately let at least one enemy reach the base during a wave
  (without letting the base reach 0 HP) and confirm the next wave's
  countdown now starts automatically instead of the game hanging.
- Collect at least one treasure, reload the page mid-run (after at
  least one WaveCompleted, so Save/Reload applies), and confirm that
  treasure does NOT reappear as collectible, while un-collected
  treasures still are.
- Re-confirm the full original checklist from before this update
  still holds (boot, defense placement, wave 1/2 auto-start, currency
  on kill, Game Over on base destruction with correct wave reached,
  save/reload restoring currency/base HP/wave/defenses, fresh game
  after Game Over) — none of it should have regressed, but it has not
  been re-verified on a real device since these two fixes landed.

This manual verification has NOT been performed yet. Do not mark the
Vertical Slice Gate passed until it has actually been performed and
any issues found are fixed and covered by a test where practical.

No Phase 6 Economy expansion begins before the Vertical Slice Gate passes.

---

# 55. Stop Condition

At the end of every development task:

REPORT
↓
STOP

Do not automatically continue into another phase.

A successful test does not automatically authorize new feature work.

A passed gate authorizes evaluation of the next phase, but the next phase must
still be explicitly started.

---

# 56. Current Project State Summary

Project:

Infinity Depths

Current Phase:

Phase 5 — Vertical Slice

Architecture Foundation:

PASSED

Architecture Gate:

PASSED

Core prototype:

WORKING

Defense system:

WORKING CORE

Combat system:

WORKING CORE

Enemy system:

WORKING CORE

Wave system:

CORE LOOP WIRED — WaveOrchestrator now drives startWave() from
CONFIG.WAVES; real-device verification pending

Economy:

FOUNDATION PRESENT / FULL ECONOMY NOT IMPLEMENTED

Progression:

PARTIAL STATE ONLY

Collection:

NOT IMPLEMENTED

Merge:

NOT IMPLEMENTED

Boss:

NOT IMPLEMENTED

Quests:

NOT IMPLEMENTED

Weather:

NOT IMPLEMENTED

Day/Night:

NOT IMPLEMENTED

Save System:

PARTIAL — Vertical Slice save/reload boundary implemented and unit
tested (99/99 tests passing); real browser reload of the two Phase 5
bug fixes (wave-hang-on-base-reach, treasure re-collection) not yet
re-verified on an actual device

Production Asset Pipeline:

NOT IMPLEMENTED

Audio:

NOT IMPLEMENTED

VFX:

NOT IMPLEMENTED

Performance Baseline:

NOT FORMALLY ESTABLISHED

Real Device Verification:

NOT COMPLETED

Native Android:

NOT IMPLEMENTED

Online:

FUTURE

Multiplayer:

FUTURE

Current primary objective:

PROVE THE VERTICAL SLICE IN A REAL BROWSER (core loop already wired and unit-tested).

Current next gate:

VERTICAL SLICE GATE.

END OF PROJECT STATE
