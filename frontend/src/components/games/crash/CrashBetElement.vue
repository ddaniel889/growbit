<template>
  <div class="crash-bet-element">
    <div class="element-user">
      <span v-html="bet.user.username"></span>
    </div>
    <div class="element-info">
      <div v-if="bet.multiplier !== undefined" class="info-multiplier">
        <span class="gradient-green">{{ parseFloat(bet.multiplier).toFixed(2) }}x</span>
      </div>
      <div class="info-amount">
        <Currency />
        <div class="amount-value">
          {{ crashGetAmount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { currencyExchangeRatesMixin } from "@/currencyExchangeMixin";
import Currency from "@/components/Currency.vue";

export default {
  name: "CrashBetElement",
  components: { Currency },
  props: ["bet"],
  mixins: [currencyExchangeRatesMixin],
  computed: {
    crashGetAmount() {
      if (!this.bet) return "0.00";
      let amount = this.getDisplayCurrencyAmount(this.bet.amount);

      if (this.bet.multiplier !== undefined) {
        return "+" + parseFloat(Number(amount) * this.bet.multiplier).toFixed(2);
      }

      return Number(amount).toFixed(2);
    },
  },
};
</script>

<style scoped>
.crash-bet-element {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 9px;
}

.crash-bet-element:first-of-type {
  margin-top: 0;
}

.crash-bet-element .element-user {
  display: flex;
  align-items: center;
  color: #fff;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.26px;
}
</style>
