<template>
  <div class="crash-controls">
    <div class="controls-mode">
      <button
        @click="crashSetMode('manual')"
        class="button-mode"
        :class="{ 'button-selected': crashMode === 'manual' }"
      >
        Manual
      </button>
      <button
        @click="crashSetMode('auto')"
        class="button-mode"
        :class="{ 'button-selected': crashMode === 'auto' }"
      >
        Auto
      </button>
    </div>
    <div class="controls-main">
      <BetAmount
        :change="
          (value) => {
            this.crashAmount = value;
            this.crashOriginalAmount = value;
          }
        "
        :updateInput="this.crashAmount"
        :disabled="crashAutoRunning === true"
        :max-bet="maxBet"
      ></BetAmount>

      <div v-if="crashMode === 'auto'" class="controls-row-container">
        <div class="controls-cashout-container">
          <div class="controls-cashout-title">Cashout At</div>
          <div class="controls-cashout">
            <input
              v-model="crashAutoCashout"
              @input="crashValidateInputCashout"
              @change="crashFormatInputCashout"
              type="text"
              placeholder="Multiplier"
              :disabled="crashAutoRunning === true"
            />
            <div class="cashout-buttons">
              <button
                @click="crashSetInput('crashAutoCashout', 'increase')"
                :disabled="crashAutoRunning === true"
              >
                <img src="../../../assets/images/iconup.png" alt="up" />
              </button>
              <button
                @click="crashSetInput('crashAutoCashout', 'decrease')"
                :disabled="crashAutoRunning === true"
              >
                <img src="../../../assets/images/icondown.png" alt="down" />
              </button>
            </div>
          </div>
        </div>
        <div class="controls-count-container">
          <div class="controls-repeat-title">Number of bets</div>
          <div class="controls-repeat">
            <input
              v-model="crashAutoBetCount"
              @input="crashValidateAutoBetCount"
              @change="crashFormatInputAutoBet"
              type="text"
              placeholder="Count"
              :disabled="crashAutoRunning === true"
            />
          </div>
        </div>
      </div>
      
      <div v-else>
        <div class="controls-cashout-title">Cashout At</div>
        <div class="controls-cashout">
          <input
            v-model="crashAutoCashout"
            @input="crashValidateInputCashout"
            @change="crashFormatInputCashout"
            type="text"
            placeholder="Multiplier"
            :disabled="crashAutoRunning === true"
          />
          <div class="cashout-buttons">
            <button
              @click="crashSetInput('crashAutoCashout', 'increase')"
              :disabled="crashAutoRunning === true"
            >
              <img src="../../../assets/images/iconup.png" alt="up" />
            </button>
            <button
              @click="crashSetInput('crashAutoCashout', 'decrease')"
              :disabled="crashAutoRunning === true"
            >
              <img src="../../../assets/images/icondown.png" alt="down" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="crashMode === 'manual'" class="controls-manual">
        <button
          v-if="hasActiveBet"
          @click="crashBetCashout"
          class="betting-btn"
          :disabled="!crashGame || crashGame.state !== 'rolling'"
        >
          {{ !crashGame || crashGame.state !== 'rolling' ? "Starting..." : "Cashout" }}
        </button>
        <button v-else @click="crashBetButton" class="betting-btn">
          Play
        </button>
      </div>
      
      <div v-else class="controls-auto">
        <div class="controls-cashout-title">On win</div>
        <div class="auto-bet-controls">
          <button
            :class="!crashAutoPercentageWin ? 'active' : ''"
            @click="crashAutoPercentageWin = null"
          >
            Reset
          </button>
          <button
            :class="crashAutoPercentageWin ? 'active' : ''"
            @click="crashAutoPercentageWin = 100"
          >
            Increase
          </button>
          <span class="input-append-percent">
            <input
              type="text"
              v-model="crashAutoPercentageWin"
              @input="crashValidateAutoPercentageWin"
              @change="crashFormatInputAutoPercentageWin"
              :disabled="crashAutoRunning === true" 
            />
            <img src="../../../assets/images/percentage.svg" alt="%" />
          </span>
        </div>
        
        <div class="controls-cashout-title">On loss</div>
        <div class="auto-bet-controls">
          <button
            :class="!crashAutoPercentageLoss ? 'active' : ''"
            @click="crashAutoPercentageLoss = null"
          >
            Reset
          </button>
          <button
            :class="crashAutoPercentageLoss ? 'active' : ''"
            @click="crashAutoPercentageLoss = 100"
          >
            Increase
          </button>
          <span class="input-append-percent">
            <input
              type="text"
              v-model="crashAutoPercentageLoss"
              @input="crashValidateAutoPercentageLoss"
              @change="crashFormatInputAutoPercentageLoss"
              :disabled="crashAutoRunning === true" 
            />
            <img src="../../../assets/images/percentage.svg" alt="%" />
          </span>
        </div>
        
        <div class="controls-cashout-title">Stop on profit</div>
        <div class="stop-profit input-wrapper">
          <input
            v-model="crashAutoStopProfit"
            type="text"
            placeholder="Stop on profit"
            :disabled="crashAutoRunning === true"
          />
          <Currency />
        </div>
        
        <div class="controls-cashout-title">Stop on loss</div>
        <div class="stop-lose input-wrapper">
          <input
            v-model="crashAutoStopLoss"
            type="text"
            placeholder="Stop on loss"
            :disabled="crashAutoRunning === true"
          />
          <Currency />
        </div>

        <div class="btn-wrapper">
          <button
            v-if="crashAutoRunning === true"
            @click="crashAutoStopButton"
            class="betting-btn button-stop"
          >
            Stop Autobetting
          </button>
          <button v-else @click="crashAutoStartButton" class="betting-btn">
            Start Autobetting
          </button>
        </div>
      </div>

      <div v-if="crashMode === 'manual'" class="bets-content">
        <div class="content-list">
          <CrashBetElement
            v-for="bet of crashBets"
            :key="bet._id"
            :bet="bet"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import CrashBetElement from "@/components/games/crash/CrashBetElement.vue";
import BetAmount from "@/components/BetAmount.vue";
import Currency from "@/components/Currency.vue";
import { currencyExchangeRatesMixin } from "@/currencyExchangeMixin";

export default {
  name: "CrashControls",
  mixins: [currencyExchangeRatesMixin],
  components: {
    Currency,
    BetAmount,
    CrashBetElement,
  },
  data() {
    return {
      crashMode: "manual",
      crashAutoRunning: false,
      crashAutoInfinite: false,
      crashOriginalAmount: null,
      crashAmount: null,
      crashAutoCashout: "2.00",
      crashAutoPercentageWin: null,
      crashAutoPercentageLoss: null,
      crashAutoStopProfit: null,
      crashAutoStopLoss: null,
      crashAutoBetCount: null,
      crashAutoTotalBet: 0,
      crashAutoTotalWon: 0,
    };
  },
  computed: {
    ...mapGetters([
      "socketSendLoading",
      "authUser",
      "crashGame",
      "crashBets",
      "gameConfig",
      "fiatRates",
      "selectedCurrency",
    ]),
    maxBet() {
      return this.gameConfig?.crashMaxBet || 0;
    },
    hasActiveBet() {
      return (
        this.authUser?.user !== null &&
        this.crashGame !== null &&
        this.crashGame.state !== 'completed' &&
        this.crashBets &&
        this.crashBets.some(
          (element) => element.user?._id === this.authUser.user._id && element.multiplier === undefined
        )
      );
    }
  },
  methods: {
    ...mapActions([
      "notificationShow",
      "crashSendBetSocket",
      "crashSendCashoutSocket",
    ]),
    getBalanceInSelectedCurrency(balance) {
      if(!this.fiatRates?.data || !this.selectedCurrency) return balance;
      return this.fiatRates.data[this.selectedCurrency] * balance;
    },
    crashSetMode(mode) {
      if (mode === "manual") {
        this.crashAutoStopButton();
      }
      this.crashMode = mode;
    },
    sanitizeInput(val, allowDecimal = true) {
      let cleaned = val.replace(",", ".").replace(/[^\d.]/g, "");
      if (allowDecimal) {
        const parts = cleaned.split(".");
        if (parts.length > 2) cleaned = parts[0] + "." + parts.slice(1).join("").replace(/\./g, "");
        if (parts.length > 1) cleaned = parts[0] + "." + parts[1].substring(0, 2);
      } else {
        cleaned = cleaned.replace(/\./g, "");
      }
      return cleaned;
    },
    crashValidateInputCashout() {
      this.crashAutoCashout = this.sanitizeInput(this.crashAutoCashout, true);
    },
    crashValidateAutoBetCount() {
      this.crashAutoBetCount = this.sanitizeInput(this.crashAutoBetCount, false);
    },
    crashValidateAutoPercentageWin() {
      this.crashAutoPercentageWin = this.sanitizeInput(this.crashAutoPercentageWin, false);
    },
    crashValidateAutoPercentageLoss() {
      this.crashAutoPercentageLoss = this.sanitizeInput(this.crashAutoPercentageLoss, false);
    },
    crashFormatInputCashout() {
      this.crashAutoCashout = this.crashAutoCashout ? Number(this.crashAutoCashout).toFixed(2) : "2.00";
    },
    crashFormatInputAutoBet() {
      this.crashAutoBetCount = this.crashAutoBetCount ? Math.floor(Number(this.crashAutoBetCount)) : null;
    },
    crashFormatInputAutoPercentageWin() {
      this.crashAutoPercentageWin = this.crashAutoPercentageWin ? Number(this.crashAutoPercentageWin) : null;
    },
    crashFormatInputAutoPercentageLoss() {
      this.crashAutoPercentageLoss = this.crashAutoPercentageLoss ? Number(this.crashAutoPercentageLoss) : null;
    },
    crashSetInput(value, action) {
      let amount = parseFloat(this[value]) || 0;
      amount = action === "increase" ? amount + 1 : amount - 1;
      if (amount <= 1) amount = 1.01;
      this[value] = parseFloat(amount).toFixed(2);
    },
    crashAutoStartButton() {
      const percentageWin = Number(this.crashAutoPercentageWin);
      const percentageLoss = Number(this.crashAutoPercentageLoss);

      if (this.crashAutoPercentageWin !== null && (isNaN(percentageWin) || percentageWin < 0)) {
        this.showError("Your entered auto bet win percentage is invalid.");
        return;
      }
      if (this.crashAutoPercentageLoss !== null && (isNaN(percentageLoss) || percentageLoss < 0)) {
        this.showError("Your entered auto bet loss percentage is invalid.");
        return;
      }
      if (this.crashAutoStopProfit && isNaN(Number(this.crashAutoStopProfit))) {
        this.showError("Your entered auto bet profit stop is invalid.");
        return;
      }
      if (this.crashAutoStopLoss && isNaN(Number(this.crashAutoStopLoss))) {
        this.showError("Your entered auto bet loss stop is invalid.");
        return;
      }

      const count = Math.floor(Number(this.crashAutoBetCount));
      if (this.crashAutoBetCount !== null && isNaN(count)) {
        this.showError("Your entered auto bet count is invalid.");
        return;
      }

      this.crashAutoInfinite = !this.crashAutoBetCount || count === 0;
      this.crashAutoRunning = true;

      if (this.crashGame?.state === "created") {
        this.crashBetButton();
      }
    },
    crashAutoStopButton() {
      this.crashAutoTotalBet = 0;
      this.crashAutoTotalWon = 0;
      this.crashAutoInfinite = false;
      this.crashAutoRunning = false;
    },
    showError(msg) {
      this.notificationShow({ type: "error", message: msg });
      this.crashAutoStopButton();
    },
   crashBetButton() {
  // 1. Evitar peticiones concurrentes si el socket está cargando
  if (this.socketSendLoading !== null) return;

  // 2. Verificar que el usuario esté autenticado y su wallet exista
  if (!this.authUser?.user || !this.authUser.user.wallet) {
    this.showError("Please sign in to perform this action.");
    return;
  }

  // 3. Limpiar y parsear valores de entrada del componente
  const amount = Number(this.crashAmount);
  const autoCashout = !this.crashAutoCashout || this.crashAutoCashout.toString().trim() === "" 
    ? 0 
    : Number(this.crashAutoCashout);

  // 4. Validaciones matemáticas estándar de los inputs
  if (isNaN(amount) || amount <= 0) {
    this.showError("Your entered bet amount is invalid.");
    return;
  }

  if (isNaN(autoCashout) || ((autoCashout !== 0 || this.crashMode === "auto") && autoCashout <= 1)) {
    this.showError("Your entered bet auto cashout is invalid.");
    return;
  }

  // ============================================================
  // ADAPTACIÓN DUAL WALLET: DETECTAR Y VALIDAR GC / SC
  // ============================================================

  // Identificamos de forma segura la moneda activa ("gc" o "sc") en minúsculas
  const currencyKey = this.selectedCurrency ? this.selectedCurrency.toLowerCase() : "gc";
  
  // Obtenemos los fondos disponibles directamente de la billetera correspondiente
  const currentWalletBalance = Number(this.authUser.user.wallet[currencyKey]) || 0;

  // Validar si el monto que se ingresó en el BetAmount supera lo que hay en esa billetera específica
  if (amount > currentWalletBalance) {
    this.showError(`Insufficient funds. Your ${currencyKey.toUpperCase()} balance is ${currentWalletBalance.toFixed(2)}`);
    return;
  }

  // Validar el límite máximo permitido (asumiendo que maxBet ya viene en la unidad correcta para el juego)
  const maxBetAllowed = Number(this.maxBet);
  if (amount > maxBetAllowed) {
    this.showError(`Maximum allowed bet is ${maxBetAllowed} ${currencyKey.toUpperCase()}`);
    return;
  }

  // ============================================================
  // ENVÍO DE DATA ESTRUCTURADA AL BACKEND
  // ============================================================

  // Empaquetamos la carga incluyendo explícitamente el tipo de billetera 
  // para que el controlador del backend sepa de dónde debitar el balance.
  const payload = { 
    amount: amount,              // El monto directo ingresado para GC/SC
    currency: currencyKey,       // 'gc' o 'sc'
    autoCashout: autoCashout 
  };

  this.crashSendBetSocket(payload);
},
    crashBetCashout() {
      if (this.socketSendLoading !== null || !this.authUser?.user) return;
      this.crashSendCashoutSocket({});
    },
  },
  watch: {
    crashGame: {
      handler(data) {
        if (data?.state === "created" && this.crashAutoRunning) {
          const profit = this.crashAutoTotalWon - this.crashAutoTotalBet;
          const count = Number(this.crashAutoBetCount);
          const stopProfit = Number(this.crashAutoStopProfit) || 0;
          const stopLoss = Number(this.crashAutoStopLoss) || 0;

          const hasBetsLeft = this.crashAutoInfinite || count > 0;
          const checkProfit = stopProfit === 0 || profit <= 0 || profit < stopProfit;
          const checkLoss = stopLoss === 0 || profit >= 0 || profit > -stopLoss;

          if (hasBetsLeft && checkProfit && checkLoss) {
            this.crashBetButton();
          } else {
            this.crashAutoStopButton();
          }
        }
      },
      deep: true,
    },
    crashBets: {
      deep: true,
      handler(data) {
        if (!data || !this.authUser?.user || this.crashMode !== "auto") return;

        const bet = data.find((element) => element.user?._id === this.authUser.user._id);
        if (!bet) return;

        if (bet.payout !== undefined) {
          this.crashAutoTotalWon += bet.payout;
          if (bet.payout > 0) {
            if (this.crashAutoPercentageWin) {
              this.crashAmount = Number(this.crashAmount) * (1 + Number(this.crashAutoPercentageWin) / 100);
              this.crashAmount = Number(this.crashAmount).toFixed(2);
            } else {
              this.crashAmount = this.crashOriginalAmount;
            }
          } else {
            if (this.crashAutoPercentageLoss) {
              this.crashAmount = Number(this.crashAmount) * (1 + Number(this.crashAutoPercentageLoss) / 100);
              this.crashAmount = Number(this.crashAmount).toFixed(2);
            } else {
              this.crashAmount = this.crashOriginalAmount;
            }
          }
        } else {
          if (!this.crashAutoInfinite && this.crashAutoBetCount > 0) {
            this.crashAutoBetCount -= 1;
          }
          this.crashAutoTotalBet += bet.amount;
        }
      },
    },
  },
  beforeDestroy() {
    this.crashAutoRunning = false;
  },
};
</script>

<style scoped lang="scss">
.btn-wrapper {
  padding: 4px;
  display: flex;
  flex-direction: column;
  border-radius: 13px;
  background: #090c1d;
  margin-top: 10px;
  width: 100%;
  > button {
    width: 100%;
  }
}

.crash-controls {
  display: grid;
  height: fit-content;
  grid-template-columns: 1fr;

  @media only screen and (min-width: 991px) {
    height: 100%;
    max-width: 300px;
    width: 100%;

    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
}

.controls-main {
  background: var(--dark-blue);
  border: 4px solid #090c1d;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 20px;
  flex-grow: 1;
  min-height: 490px;

  @media screen and (max-width: 991px) {
    padding: 10px;
    display: grid;
    width: 100%;
    min-height: unset;
    grid-template-columns: 1fr;
  }
}

.controls-row-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-grow: 1;
  gap: 10px;
}

.controls-cashout-container {
  width: 51%;
  display: flex;
  flex-direction: column;
}

.controls-count-container {
  width: 49%;
  display: flex;
  flex-direction: column;

  .controls-repeat-title {
    margin-top: 10px;
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;
    line-height: 20px;
    color: #eeeeee;
  }

  .controls-repeat {
    width: 100%;
    height: 42px;
    margin-top: 5px;
    border-radius: 5px;
    overflow: hidden;
    border: 2px solid #22224a;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 15px;

    > img {
      margin-left: auto;
      margin-right: 10px;
    }

    input {
      color: #616498;
      max-width: 100px;
      &::placeholder {
        color: #616498;
      }
    }
  }
}

.controls-mode {
  width: 100%;
  display: flex;
  margin-bottom: 15px;

  background: var(--dark-blue);
  border: 4px solid #090c1d;
  border-radius: 10px;
  padding: 10px;

  @media screen and (max-width: 991px) {
    grid-row-start: 10;
    margin-bottom: 0;
    margin-top: 20px;
  }

  button.button-mode {
    width: 100%;
    height: 39px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    font-weight: 700;
    color: #ffffff;
    background: #22224a;

    &:first-of-type {
      margin-right: 0;
      border-radius: 5px 0px 0px 5px;
    }

    &:last-of-type {
      margin-right: 0;
      border-radius: 0 5px 5px 0;
    }

    &.button-selected {
      background: var(--purple);
    }
  }
}

.crash-controls .controls-amount-title {
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 20px;
  color: #eeeeee;
}

.crash-controls .controls-cashout-title {
  margin-top: 10px;
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
}
</style>
