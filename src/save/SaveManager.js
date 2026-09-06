/**
 * SaveManager.js
 * --------------
 * Phase 5 — Vertical Slice: حدود الحفظ/الاستعادة (Section 44 بـ
 * PROJECT_STATE.md، ومطابق لـ SAVE_SCHEMA.md).
 *
 * هذا ليس نظام الحفظ النهائي الموصوف بالكامل في SAVE_SCHEMA.md
 * (لا Backup، لا Migration بين إصدارات متعددة) — هذا هو الحد الأدنى
 * المطلوب لإثبات حلقة اللعب الكاملة عبر Save/Reload كما تنص عليه
 * بوابة الـ Vertical Slice (ROADMAP.md, Phase 5 Gate):
 *
 *   Death / Completion -> Save -> Reload
 *
 * المسؤوليات:
 * - تسلسل (serialize) الحالة القابلة للحفظ فقط (لا Runtime objects،
 *   لا Three.js — انظر SAVE_SCHEMA.md §5).
 * - التحقق من صحة البيانات قبل قبولها (SAVE_SCHEMA.md §20).
 * - عدم تحميل حفظ تالف/غير صالح (SAVE_SCHEMA.md §21-22) — بدل ذلك
 *   إرجاع null والاستمرار بحالة جديدة، دون رمي استثناء يوقف الإقلاع.
 * - عدم حفظ حالة معركة مؤقتة (Enemy runtime, Projectiles, Timers)
 *   (SAVE_SCHEMA.md §18) — فقط نقاط تحقق (Save Points, §19):
 *     - نهاية موجة (WaveCompleted).
 *   وعند تدمير القاعدة (BaseDestroyed) يتم مسح الحفظ عمدًا بدل حفظ
 *   حالة "خسارة"، بحيث تعمل "إعادة المحاولة" الحالية في GameOverUI
 *   (والتي تعتمد على window.location.reload()) كبداية جديدة فعلية —
 *   هذا قرار مسجَّل، انظر DECISIONS.md.
 *
 * الملكية:
 * SaveManager هو الوحيد المخوَّل بالقراءة/الكتابة إلى التخزين
 * (localStorage افتراضيًا، قابل للاستبدال لأغراض الاختبار عبر
 * setStorage()). لا نظام آخر يجب أن يتعامل مع localStorage مباشرة.
 *
 * لا يعتمد مباشرة على DOM/Three.js — فقط على الكائنات المصدر
 * (GameState, WaveManager, DefenseManager) التي يُمرَّرها Game.js.
 */

const SaveManager = {
  SCHEMA_VERSION: 1,

  STORAGE_KEY: "infinity_depths_save",

  _storage: null,

  initialized: false,

  /**
   * يجب استدعاؤها مرة واحدة عند الإقلاع. تحدد أي Storage backend
   * يُستخدم (localStorage الحقيقي في المتصفح، أو storage مُحقَن
   * للاختبارات الآلية).
   */
  init(storage) {
    this._storage =
      storage ||
      (typeof localStorage !== "undefined"
        ? localStorage
        : null);

    this.initialized = true;

    return this;
  },

  /**
   * يسمح باستبدال الـ storage backend صراحة (اختبارات، أو بيئة لا
   * تملك localStorage).
   */
  setStorage(storage) {
    this._storage = storage || null;
  },

  isAvailable() {
    return Boolean(this._storage);
  },

  // =========================================================
  // SERIALIZE
  // =========================================================

  /**
   * يبني كائن Save Data من مصادر الحقيقة الفعلية فقط.
   *
   * لا يقرأ أي كائن Three.js/DOM — فقط بيانات رقمية/نصية بسيطة،
   * تمامًا كما يفرض SAVE_SCHEMA.md §5.
   */
  serialize({ gameState, waveManager, defenseManager }) {
    const player = (gameState && gameState.player) || {};
    const base = (gameState && gameState.base) || {};

    const interactions =
      (gameState &&
        gameState.interactions &&
        Array.isArray(gameState.interactions.openedIds) &&
        gameState.interactions.openedIds.slice()) ||
      [];

    const defenses =
      (defenseManager &&
        Array.isArray(defenseManager.defenses) &&
        defenseManager.defenses.map((d) => ({
          id: String(d.id),
          typeId: String(d.typeId),
          x: Number(d.x) || 0,
          z: Number(d.z) || 0,
        }))) ||
      [];

    return {
      schemaVersion: this.SCHEMA_VERSION,
      updatedAt: Date.now(),

      wave: Math.max(
        0,
        Math.floor(
          Number((waveManager && waveManager.currentWave) || 0)
        )
      ),

      player: {
        level: Math.max(1, Math.floor(Number(player.level) || 1)),
        xp: Math.max(0, Math.floor(Number(player.xp) || 0)),
        currency: Math.max(0, Math.floor(Number(player.currency) || 0)),
        rank: typeof player.rank === "string" ? player.rank : "Novice",
      },

      base: {
        hp: Math.max(0, Number(base.hp) || 0),
        maxHp: Math.max(0, Number(base.maxHp) || 0),
      },

      interactions: {
        openedIds: interactions.filter((id) => typeof id === "string"),
      },

      defenses,
    };
  },

  // =========================================================
  // VALIDATE  (SAVE_SCHEMA.md §20)
  // =========================================================

  /**
   * يتحقق من البنية/الأنواع/الحدود قبل قبول أي حفظ.
   * يرجع true/false فقط — لا يرمي استثناءات أبدًا (حفظ تالف يجب أن
   * يُعامَل كـ "لا يوجد حفظ صالح"، وليس كخطأ يوقف الإقلاع).
   */
  validate(data) {
    try {
      if (!data || typeof data !== "object") {
        return false;
      }

      if (data.schemaVersion !== this.SCHEMA_VERSION) {
        // إصدار غير مدعوم بعد (لا Migration منفَّذة بعد — SAVE_SCHEMA.md §24).
        return false;
      }

      if (
        !Number.isFinite(data.wave) ||
        data.wave < 0
      ) {
        return false;
      }

      const p = data.player;

      if (
        !p ||
        !Number.isFinite(p.level) ||
        p.level < 1 ||
        !Number.isFinite(p.xp) ||
        p.xp < 0 ||
        !Number.isFinite(p.currency) ||
        p.currency < 0 ||
        typeof p.rank !== "string"
      ) {
        return false;
      }

      const b = data.base;

      if (
        !b ||
        !Number.isFinite(b.hp) ||
        b.hp < 0 ||
        !Number.isFinite(b.maxHp) ||
        b.maxHp < 0 ||
        b.hp > b.maxHp
      ) {
        return false;
      }

      if (
        !data.interactions ||
        !Array.isArray(data.interactions.openedIds) ||
        !data.interactions.openedIds.every(
          (id) => typeof id === "string"
        )
      ) {
        return false;
      }

      if (
        !Array.isArray(data.defenses) ||
        !data.defenses.every(
          (d) =>
            d &&
            typeof d.id === "string" &&
            typeof d.typeId === "string" &&
            Number.isFinite(d.x) &&
            Number.isFinite(d.z)
        )
      ) {
        return false;
      }

      return true;
    } catch (error) {
      console.error(
        "SaveManager: validation threw unexpectedly.",
        error
      );

      return false;
    }
  },

  // =========================================================
  // PERSIST
  // =========================================================

  /**
   * يحفظ الحالة الحالية. لا يرمي أبدًا — فشل الحفظ (تخزين ممتلئ،
   * وضع خاص/incognito بدون localStorage...) لا يجب أن يوقف اللعبة
   * (SAVE_SCHEMA.md §22: التعامل مع فشل الحفظ).
   */
  save(sources) {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const data = this.serialize(sources);

      if (!this.validate(data)) {
        console.error(
          "SaveManager: refusing to persist self-generated invalid save data."
        );

        return false;
      }

      this._storage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(data)
      );

      return true;
    } catch (error) {
      console.error("SaveManager: save() failed.", error);

      return false;
    }
  },

  /**
   * يقرأ ويتحقق من الحفظ الموجود. يرجع بيانات صالحة أو null.
   * لا يطبّق أي شيء على الحالة الحية — هذه مسؤولية applyTo().
   */
  load() {
    if (!this.isAvailable()) {
      return null;
    }

    let raw;

    try {
      raw = this._storage.getItem(this.STORAGE_KEY);
    } catch (error) {
      console.error("SaveManager: load() could not read storage.", error);

      return null;
    }

    if (!raw) {
      return null;
    }

    let data;

    try {
      data = JSON.parse(raw);
    } catch (error) {
      console.error(
        "SaveManager: stored save is corrupted JSON — ignoring it.",
        error
      );

      return null;
    }

    if (!this.validate(data)) {
      console.error(
        "SaveManager: stored save failed validation — ignoring it."
      );

      return null;
    }

    return data;
  },

  hasSave() {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      return Boolean(this._storage.getItem(this.STORAGE_KEY));
    } catch (error) {
      return false;
    }
  },

  clear() {
    if (!this.isAvailable()) {
      return;
    }

    try {
      this._storage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error("SaveManager: clear() failed.", error);
    }
  },

  // =========================================================
  // APPLY  (Save Data -> Runtime)
  // =========================================================

  /**
   * يطبّق بيانات حفظ مُتحقَّق منها مسبقًا على المصادر الحية.
   *
   * ترتيب الاستدعاء من Game.js مهم:
   * - جزء GameState.player/base/interactions يجب أن يُطبَّق قبل
   *   EconomySystem.init(GameState.player.currency)، لأن Economy
   *   يقرأ الرصيد الابتدائي من GameState مرة واحدة فقط عند الإقلاع.
   * - جزء wave/defenses يُطبَّق بعد WaveManager.init() و
   *   DefenseManager.init() لأن كليهما يُصفَّران (reset) أثناء init().
   */
  applyToGameState(data, gameState) {
    if (!data || !gameState) {
      return;
    }

    gameState.player.level = data.player.level;
    gameState.player.xp = data.player.xp;
    gameState.player.currency = data.player.currency;
    gameState.player.rank = data.player.rank;

    // maxHp يبقى من CONFIG الحالي (مصدر الحقيقة للتوازن)، فقط hp يُستعاد.
    gameState.base.hp = Math.min(
      data.base.hp,
      gameState.base.maxHp
    );

    gameState.interactions.openedIds =
      data.interactions.openedIds.slice();
  },

  applyToWaveManager(data, waveManager) {
    if (!data || !waveManager) {
      return;
    }

    waveManager.currentWave = data.wave;
  },

  /**
   * يعيد بناء الدفاعات المحفوظة عبر DefenseManager.restoreDefense()
   * (إضافة API جديدة على DefenseManager دون إعادة بناء منطق الوضع/
   * الاقتصاد الحالي — انظر DefenseManager.js).
   */
  applyToDefenseManager(data, defenseManager) {
    if (!data || !defenseManager) {
      return;
    }

    if (typeof defenseManager.restoreDefense !== "function") {
      console.error(
        "SaveManager: DefenseManager.restoreDefense is not available."
      );

      return;
    }

    data.defenses.forEach((d) => {
      defenseManager.restoreDefense(d);
    });
  },
};
