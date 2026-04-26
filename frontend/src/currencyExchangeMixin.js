import { mapGetters } from "vuex";

export const currencyExchangeRatesMixin = {
  computed: {
    ...mapGetters(["fiatRates", "selectedCurrency", "authUser", "gameConfig"]),
  },
  methods: {
    getDlsAmountForBetting(amount) {
      // Guard against null/undefined fiatRates.data
      const rate = this.fiatRates?.data?.[this.selectedCurrency] || 1;
      const dlsAmount = amount / rate;
      // Guard against null/undefined authUser.user.balance
      return Math.min(dlsAmount, this.authUser?.user?.balance || 0);
    },
    getDisplayCurrencyAmount(amount) {
      const rate = this.fiatRates?.data?.[this.selectedCurrency || "DLS"] || 1;
      return amount * rate;
    },
    getDisplayCurrencyAmountFormatted(amount) {
      return this.getDisplayCurrencyAmount(amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  },
};
