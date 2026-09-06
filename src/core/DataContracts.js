/**
 * DataContracts.js
 * ----------------
 * عقود بيانات المحتوى الثابت وبيانات الإنشاء.
 *
 * هذا الملف لا يملك حالة تشغيلية ولا يغيّر سلوك أنظمة اللعبة.
 * وظيفته التحقق من شكل البيانات قبل أن تستخدمها الأنظمة.
 *
 * Phase 4 — Architecture Foundation / AD-003
 *
 * ملاحظة معمارية:
 * - Enemy Definition = بيانات ثابتة قادمة من CONFIG.
 * - Enemy Spawn Data = البيانات النهائية التي تُمرر إلى Enemy عند إنشائه.
 * - لا نفرض id على Enemy Definition لأن EnemyManager ينشئ هوية
 *   instance مستقلة لكل عدو عند التشغيل.
 */

const DataContracts = {
  // =========================================================
  // HELPERS
  // =========================================================

  _isFiniteNonNegativeNumber(value) {
    return (
      typeof value === "number" &&
      Number.isFinite(value) &&
      value >= 0
    );
  },

  _isNonEmptyString(value) {
    return (
      typeof value === "string" &&
      value.trim().length > 0
    );
  },

  // =========================================================
  // ENEMY DEFINITION
  // =========================================================

  /**
   * التحقق من تعريف عدو ثابت.
   *
   * هذا التعريف يمثل بيانات المحتوى فقط.
   * لا يحتوي:
   * - hp الحالي
   * - target
   * - model
   * - pathDistance
   * - alive
   * - reachedBase
   * - instance id
   */
  validateEnemyDefinition(definition) {
    if (
      !definition ||
      typeof definition !== "object"
    ) {
      return false;
    }

    const requiredNumbers = [
      "maxHp",
      "speed",
      "armor",
      "resistance",
      "damage",
      "reward",
    ];

    for (const key of requiredNumbers) {
      if (
        !this._isFiniteNonNegativeNumber(
          definition[key]
        )
      ) {
        return false;
      }
    }

    return true;
  },

  // =========================================================
  // ENEMY SPAWN DATA
  // =========================================================

  /**
   * التحقق من البيانات النهائية التي ستُستخدم لإنشاء Enemy instance.
   *
   * هنا يصبح id مطلوبًا لأن هذه لم تعد Definition ثابتة،
   * بل بيانات إنشاء instance محدد.
   */
  validateEnemySpawnData(data) {
    if (
      !data ||
      typeof data !== "object"
    ) {
      return false;
    }

    if (
      !this._isNonEmptyString(
        data.id
      )
    ) {
      return false;
    }

    if (
      !this._isNonEmptyString(
        data.type
      )
    ) {
      return false;
    }

    const requiredNumbers = [
      "maxHp",
      "speed",
      "armor",
      "resistance",
      "damage",
      "reward",
    ];

    for (const key of requiredNumbers) {
      if (
        !this._isFiniteNonNegativeNumber(
          data[key]
        )
      ) {
        return false;
      }
    }

    return true;
  },

  // =========================================================
  // DEFENSE DEFINITION
  // =========================================================

  /**
   * التحقق من تعريف دفاع ثابت.
   *
   * لا يحتوي instance state مثل:
   * - cooldown
   * - target
   * - model
   * - position
   */
  validateDefenseDefinition(definition) {
    if (
      !definition ||
      typeof definition !== "object"
    ) {
      return false;
    }

    if (
      !this._isNonEmptyString(
        definition.id
      )
    ) {
      return false;
    }

    const requiredNumbers = [
      "cost",
      "damage",
      "critChance",
      "critMultiplier",
      "range",
      "fireRate",
      "projectileSpeed",
    ];

    for (const key of requiredNumbers) {
      if (
        !this._isFiniteNonNegativeNumber(
          definition[key]
        )
      ) {
        return false;
      }
    }

    if (
      !this._isNonEmptyString(
        definition.targeting
      )
    ) {
      return false;
    }

    return true;
  },

  // =========================================================
  // STARTUP VALIDATION
  // =========================================================

  /**
   * تحقق مبكر من المحتوى الثابت الموجود حاليًا.
   *
   * إذا كان هناك تعريف غير صالح، نبلغ بوضوح في Console
   * بدل تجاهل نتيجة validator.
   *
   * لا يتم إنشاء أي حالة تشغيلية هنا.
   */
  validateConfig() {
    let valid = true;

    if (
      typeof CONFIG === "undefined"
    ) {
      console.error(
        "DataContracts: CONFIG is not available."
      );

      return false;
    }

    if (
      !CONFIG.WAVES ||
      !CONFIG.WAVES.BASE_ENEMY
    ) {
      console.error(
        "DataContracts: CONFIG.WAVES.BASE_ENEMY is missing."
      );

      valid = false;
    } else if (
      !this.validateEnemyDefinition(
        CONFIG.WAVES.BASE_ENEMY
      )
    ) {
      console.error(
        "DataContracts: invalid CONFIG.WAVES.BASE_ENEMY.",
        CONFIG.WAVES.BASE_ENEMY
      );

      valid = false;
    }

    if (
      !CONFIG.DEFENSES ||
      !CONFIG.DEFENSES.TYPES
    ) {
      console.error(
        "DataContracts: CONFIG.DEFENSES.TYPES is missing."
      );

      valid = false;
    } else {
      for (
        const defenseId in CONFIG.DEFENSES.TYPES
      ) {
        const definition =
          CONFIG.DEFENSES.TYPES[
            defenseId
          ];

        if (
          !this.validateDefenseDefinition(
            definition
          )
        ) {
          console.error(
            `DataContracts: invalid defense definition "${defenseId}".`,
            definition
          );

          valid = false;
        }
      }
    }

    return valid;
  },
};

DataContracts.validateConfig();
