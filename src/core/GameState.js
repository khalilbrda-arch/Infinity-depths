/**
 * GameState.js
 * ------------
 * المصدر المركزي لحالة اللعبة.
 *
 * المرحلة 6:
 *  - Base HP
 *  - Enemy rewards
 *
 * لاحقًا سيكون هذا الكائن أساس Save System.
 */

const GameState = {
  version: 1,

  player: {
    level: 1,
    xp: 0,
    currency: 0,
    rank: "Novice",
  },

  unlocked: {
    areas: ["bay_start"],
    defenses: [],
  },

  interactions: {
    openedIds: [],
  },

  base: {
    hp: CONFIG.DEFENSE_MAP.BASE.hp,
    maxHp: CONFIG.DEFENSE_MAP.BASE.maxHp,
  },

  hasInteracted(id) {
    return this.interactions.openedIds.includes(id);
  },

  /**
   * تسجيل أن اللاعب تفاعل مع عنصر قابل للتفاعل.
   *
   * ملكية المكافآت المالية أصبحت لدى EconomySystem.
   * هذا المسار مسؤول فقط عن حالة التفاعل القابلة للحفظ.
   */
  registerInteraction(id) {
    if (this.hasInteracted(id)) {
      return false;
    }

    this.interactions.openedIds.push(id);

    return true;
  },

  /**
   * إلحاق الضرر بالقاعدة.
   */
  damageBase(amount) {
    const damage =
      Math.max(
        0,
        Number(amount) || 0
      );

    this.base.hp =
      Math.max(
        0,
        this.base.hp - damage
      );

    return {
      damage,
      hp: this.base.hp,
      maxHp: this.base.maxHp,
      destroyed:
        this.base.hp <= 0,
    };
  },

  /**
   * استعادة صحة القاعدة.
   * ستفيدنا لاحقًا في أنظمة العلاج/الإصلاح.
   */
  healBase(amount) {
    const value =
      Math.max(
        0,
        Number(amount) || 0
      );

    this.base.hp =
      Math.min(
        this.base.maxHp,
        this.base.hp + value
      );

    return this.base.hp;
  },

  /**
   * هل يملك اللاعب ذهبًا كافيًا؟
   *
   * سيبقى هذا الأسلوب مؤقتًا داخل GameState
   * إلى أن يتم نقل ملكية الرصيد بالكامل إلى EconomySystem.
   */
  canAfford(cost) {
    return (
      this.player.currency >=
      Math.max(0, Number(cost) || 0)
    );
  },

  /**
   * خصم ذهب.
   *
   * سيبقى هذا الأسلوب مؤقتًا داخل GameState
   * كطبقة تخزين منخفضة المستوى للرصيد.
   */
  spendCurrency(amount) {
    const cost =
      Math.max(
        0,
        Number(amount) || 0
      );

    if (this.player.currency < cost) {
      return false;
    }

    this.player.currency -= cost;

    return true;
  },

  /**
   * مكافأة قتل عدو.
   *
   * XP الحقيقي يمكن توسيعه لاحقًا.
   *
   * ملاحظة:
   * EconomySystem يستدعي هذه العملية حاليًا،
   * إلى أن يتم نقل ملكية الرصيد بالكامل.
   */
  rewardEnemyKill(reward) {
    const gold =
      Math.max(
        0,
        Number(reward) || 0
      );

    this.player.currency +=
      gold;

    return {
      gold,
      totalGold:
        this.player.currency,
    };
  },

  /**
   * هل القاعدة مدمرة؟
   */
  isBaseDestroyed() {
    return this.base.hp <= 0;
  },

  summary() {
    return (
      `Lvl ${this.player.level}` +
      ` | XP ${this.player.xp}` +
      ` | Gold ${this.player.currency}` +
      ` | Base ${Math.ceil(this.base.hp)}/${this.base.maxHp}`
    );
  },
};
