/**
 * EconomySystem.js
 * ----------------
 * المرحلة 4 — Architecture Foundation / Economy Boundary.
 *
 * مسؤول عن:
 * - امتلاك الرصيد أثناء تشغيل اللعبة.
 * - التحقق من القدرة على الدفع.
 * - تنفيذ معاملات العملة.
 * - إضافة مكافآت العملة.
 *
 * لا يعتمد مباشرة على حالة اللعبة المركزية (Central Game State).
 *
 * الحدود:
 *
 * Game
 *   ↓
 * EconomySystem.init(initialBalance)
 *
 * EconomySystem
 *   ↓
 * EventBus
 *   ↓
 * Game
 *
 * عند تغير الرصيد يتم إصدار:
 * CurrencyChanged
 */

const EconomySystem = {
  initialized: false,

  balance: 0,

  init(initialBalance = 0) {
    this.balance = Math.max(
      0,
      Number(initialBalance) || 0
    );

    this.initialized = true;

    this._emitCurrencyChanged();

    return this.balance;
  },

  canAfford(amount) {
    const cost = Math.max(
      0,
      Number(amount) || 0
    );

    return this.balance >= cost;
  },

  spend(amount) {
    const cost = Math.max(
      0,
      Number(amount) || 0
    );

    if (!this.canAfford(cost)) {
      return false;
    }

    this.balance -= cost;

    this._emitCurrencyChanged();

    return true;
  },

  add(amount) {
    const value = Math.max(
      0,
      Number(amount) || 0
    );

    this.balance += value;

    this._emitCurrencyChanged();

    return {
      amount: value,
      total: this.balance,
    };
  },

  rewardEnemyKill(reward) {
    const value = Math.max(
      0,
      Number(reward) || 0
    );

    return this.add(value);
  },

  getBalance() {
    return Math.max(
      0,
      Number(this.balance) || 0
    );
  },

  _emitCurrencyChanged() {
    if (
      typeof EventBus === "undefined"
    ) {
      return;
    }

    EventBus.emit(
      "CurrencyChanged",
      {
        balance: this.balance,
      }
    );
  },
};
