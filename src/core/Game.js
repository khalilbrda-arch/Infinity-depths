/**
 * Game.js
 * ---
 * نقطة الدخول الرئيسية للمحرك.
 * 
 * المرحلة الحالية:
 * v0.9 — Defenses + Combat
 * 
 * المسؤول عن:
 * - Scene
 * - Camera
 * - Renderer
 * - Lighting
 * - Sky
 * - World
 * - Input
 * - Interaction
 * - Base HUD
 * - Wave HUD
 * - Game Over UI
 * - Economy initialization
 * - Enemy Manager
 * - Wave Manager
 * - Wave Orchestrator (يربط CONFIG.WAVES بالتوليد الفعلي للأعداء)
 * - Projectile Manager
 * - Defense Manager
 * - Event subscriptions بين الأنظمة
 * - Game Loop
 * 
 * لا يوجد Player.
 * الكاميرا ثابتة الزاوية وتُدار عبر CameraController.
 */
const Game = {
scene: null,
camera: null,
renderer: null,
container: null,

init() {
this.container =
document.getElementById("game-container");

if (!this.container) {
  console.error(
    "Game: #game-container غير موجود."
  );
  return;
}

this._setupScene();
this._setupCamera();
this._setupRenderer();
this._setupLighting();
this._setupSky();
this._setupResize();

// Phase 5 — Save/Reload boundary (PROJECT_STATE.md §44/54).
// يجب تطبيق جزء GameState (currency/base/interactions) هنا، قبل
// Interactables.create() أدناه، وإلا فإن الكنوز المفتوحة مسبقًا
// (GameState.interactions.openedIds) لن تكون معروفة بعد عند إنشاء
// الجزيرة، فتظهر كل الكنوز من جديد كقابلة للجمع رغم أنها جُمعت
// فعليًا في جلسة سابقة (راجع Interactables.js).
let _pendingSave = null;

if (typeof SaveManager !== "undefined") {
  SaveManager.init();

  _pendingSave = SaveManager.load();

  if (_pendingSave) {
    SaveManager.applyToGameState(
      _pendingSave,
      GameState
    );
  }
} else {
  console.error(
    "Game: SaveManager is not available."
  );
}

Ocean.create(this.scene);
Island.create(this.scene);
Interactables.create(
  this.scene,
  GameState.interactions.openedIds
);
DefenseMap.create(this.scene);

TouchControls.init();

CameraController.init(
  this.camera
);

InteractionController.init(
  this.camera
);

BaseHUD.init();

WaveUI.init();

if (
typeof EconomySystem !== "undefined"
) {
  EconomySystem.init(
    GameState.player.currency
  );
}

this._setupEventSubscriptions();

EnemyManager.init(
  this.scene
);

WaveManager.init();

if (_pendingSave && typeof SaveManager !== "undefined") {
  SaveManager.applyToWaveManager(
    _pendingSave,
    WaveManager
  );
}

WaveOrchestrator.init();

ProjectileManager.init(
  this.scene
);

DefenseManager.init(
  this.scene
);

if (_pendingSave && typeof SaveManager !== "undefined") {
  SaveManager.applyToDefenseManager(
    _pendingSave,
    DefenseManager
  );
}

GameTime.init();

this._hideBootScreen();

this._loop();

},

_setupEventSubscriptions() {
if (
typeof EventBus === "undefined"
) {
console.error(
"Game: EventBus is not available."
);

  return;
}

/*
 * Game هو الحد الفاصل بين:
 *
 * GameState
 *     ↓
 * Game
 *     ↓
 * EventBus
 *     ↓
 * الأنظمة
 *
 * الأنظمة المنخفضة لا تعتمد مباشرة على GameState.
 */

EventBus.on(
  "CurrencyChanged",
  (payload) => {
    if (!payload) {
      return;
    }

    const balance = Math.max(
      0,
      Number(payload.balance) || 0
    );

    GameState.player.currency =
      balance;
  }
);

// Phase 5 — Save/Reload boundary (PROJECT_STATE.md §44/54).
// بدون هذا، GameState.interactions.openedIds يبقى فارغًا للأبد مهما
// جُمعت كنوز فعليًا، فلا يُحفظ شيء يمنع إعادة جمعها بعد إعادة
// تحميل الصفحة (Interactables.js نفسه لا يلمس GameState مباشرة).
EventBus.on(
  "InteractableConsumed",
  (payload) => {
    if (!payload || !payload.id) {
      return;
    }

    GameState.registerInteraction(
      payload.id
    );
  }
);

EventBus.on(
  "EnemyReachedBase",
  (payload) => {
    if (!payload) {
      return;
    }

    const wasDestroyed =
      GameState.isBaseDestroyed();

    const result =
      GameState.damageBase(
        payload.damage
      );

    // عدو وصل للقاعدة يجب أن يُحتسب ضمن اكتمال الموجة أيضًا،
    // وإلا تعلَّق الموجة للأبد إن نجا أي عدو من الدفاعات
    // (راجع تعليق handleEnemyReachedBase في WaveOrchestrator.js).
    if (
      typeof WaveOrchestrator !== "undefined"
    ) {
      WaveOrchestrator.handleEnemyReachedBase();
    }

    if (
      !wasDestroyed &&
      result.destroyed
    ) {
      EventBus.emit(
        "BaseDestroyed",
        {
          hp:
            result.hp,

          maxHp:
            result.maxHp,

          damage:
            result.damage,
        }
      );
    }
  }
);

EventBus.on(
  "BaseDestroyed",
  () => {
    if (
      typeof GameOverUI === "undefined"
    ) {
      console.error(
        "Game: GameOverUI is not available."
      );

      return;
    }

    GameOverUI.show(
      WaveManager.currentWave
    );

    // Phase 5 — Save/Reload boundary.
    // لا يتم حفظ حالة "خسارة" — عمدًا نمسح الحفظ كي تعمل "إعادة
    // المحاولة" (والتي تعتمد على window.location.reload()) كبداية
    // جديدة فعلية. انظر SaveManager.js وDECISIONS.md.
    if (typeof SaveManager !== "undefined") {
      SaveManager.clear();
    }
  }
);

EventBus.on(
  "EnemyDied",
  (payload) => {
    if (!payload) {
      return;
    }

    if (
      typeof EconomySystem === "undefined"
    ) {
      console.error(
        "Game: EconomySystem is not available."
      );

      return;
    }

    EconomySystem.rewardEnemyKill(
      payload.reward
    );

    if (
      typeof WaveOrchestrator !== "undefined"
    ) {
      WaveOrchestrator.handleEnemyDied();
    }
  }
);

// Phase 5 — Save/Reload boundary.
// نهاية الموجة هي نقطة الحفظ الطبيعية (SAVE_SCHEMA.md §19: "عند
// نهاية المستوى"). لا حفظ أثناء المعركة نفسها (لا Enemy/Projectile
// runtime state — SAVE_SCHEMA.md §18).
EventBus.on(
  "WaveCompleted",
  () => {
    if (typeof SaveManager === "undefined") {
      return;
    }

    SaveManager.save({
      gameState: GameState,
      waveManager: WaveManager,
      defenseManager: DefenseManager,
    });
  }
);

},

_setupScene() {
this.scene =
new THREE.Scene();

this.scene.fog =
  new THREE.FogExp2(
    0x9fd7e8,
    0.015
  );

},

_setupCamera() {
const c =
CONFIG.CAMERA;

this.camera =
  new THREE.PerspectiveCamera(
    c.FOV,
    window.innerWidth /
      window.innerHeight,
    c.NEAR,
    c.FAR
  );

},

_setupRenderer() {
this.renderer =
new THREE.WebGLRenderer({
antialias: true,
});

this.renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

this.renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio,
    CONFIG.PERFORMANCE.MAX_PIXEL_RATIO
  )
);

this.renderer.shadowMap.enabled =
  true;

this.renderer.shadowMap.type =
  THREE.PCFSoftShadowMap;

this.container.appendChild(
  this.renderer.domElement
);

},

_setupLighting() {
const L =
CONFIG.LIGHTING;

const hemi =
  new THREE.HemisphereLight(
    L.HEMISPHERE_SKY_COLOR,
    L.HEMISPHERE_GROUND_COLOR,
    L.HEMISPHERE_INTENSITY
  );

this.scene.add(
  hemi
);

const sun =
  new THREE.DirectionalLight(
    L.SUN_COLOR,
    L.SUN_INTENSITY
  );

sun.position.set(
  40,
  60,
  20
);

sun.castShadow =
  true;

sun.shadow.mapSize.set(
  1024,
  1024
);

this.scene.add(
  sun
);

},

_setupSky() {
const S =
CONFIG.SKY;

const skyGeo =
  new THREE.SphereGeometry(
    400,
    32,
    32
  );

const skyMat =
  new THREE.ShaderMaterial({
    side: THREE.BackSide,

    uniforms: {
      topColor: {
        value:
          new THREE.Color(
            S.TOP_COLOR
          ),
      },

      bottomColor: {
        value:
          new THREE.Color(
            S.BOTTOM_COLOR
          ),
      },
    },

    vertexShader: `
      varying vec3 vWorldPosition;

      void main() {
        vec4 worldPosition =
          modelMatrix *
          vec4(position, 1.0);

        vWorldPosition =
          worldPosition.xyz;

        gl_Position =
          projectionMatrix *
          modelViewMatrix *
          vec4(position, 1.0);
      }
    `,

    fragmentShader: `
      varying vec3 vWorldPosition;

      uniform vec3 topColor;
      uniform vec3 bottomColor;

      void main() {
        float h =
          normalize(
            vWorldPosition
          ).y;

        float factor =
          max(
            pow(
              max(h, 0.0),
              0.5
            ),
            0.0
          );

        gl_FragColor =
          vec4(
            mix(
              bottomColor,
              topColor,
              factor
            ),
            1.0
          );
      }
    `,
  });

this.scene.add(
  new THREE.Mesh(
    skyGeo,
    skyMat
  )
);

},

_setupResize() {
window.addEventListener(
"resize",
() => {
if (
!this.camera ||
!this.renderer
) {
return;
}

    this.camera.aspect =
      window.innerWidth /
      window.innerHeight;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
  }
);

},

_hideBootScreen() {
const boot =
document.getElementById(
"boot-screen"
);

if (boot) {
  boot.style.display =
    "none";
}

},

_updateDebugHud() {
const hud =
document.getElementById(
"debug-hud"
);

if (!hud) {
  return;
}

const fps =
  GameTime.delta > 0
    ? Math.round(
        1 / GameTime.delta
      )
    : 0;

const enemyCount =
  EnemyManager.initialized
    ? EnemyManager.getAliveEnemies().length
    : 0;

const defenseCount =
  DefenseManager.initialized
    ? DefenseManager.getDefenses().length
    : 0;

hud.textContent =
  `FPS: ${fps}` +
  ` | ${GameState.summary()}` +
  ` | Wave: ${WaveManager.currentWave}` +
  ` | Enemies: ${enemyCount}` +
  ` | Defenses: ${defenseCount}`;

},

_loop() {
requestAnimationFrame(
() => this._loop()
);

GameTime.tick();

const delta =
  GameTime.delta;

const elapsed =
  GameTime.elapsed;

CameraController.update();

InteractionController.update();

Ocean.update(
  elapsed
);

Interactables.update(
  elapsed
);

DefenseMap.update(
  elapsed
);

if (!WaveManager.isGameOver()) {
  EnemyManager.update(
    delta
  );

  DefenseManager.update(
    delta
  );

  ProjectileManager.update(
    delta
  );

  WaveOrchestrator.update(
    delta
  );
}

WaveManager.update(
  delta
);

BaseHUD.update();

WaveUI.update(
  WaveOrchestrator.getUIData()
);

this._updateDebugHud();

this.renderer.render(
  this.scene,
  this.camera
);

},
};

window.addEventListener(
"load",
() => {
Game.init();
}
);
