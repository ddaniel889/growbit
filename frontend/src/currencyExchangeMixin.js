import { mapGetters } from "vuex";

export const currencyExchangeRatesMixin = {
  computed: {
    ...mapGetters(["fiatRates", "selectedCurrency", "authUser", "gameConfig"]),
  },
  methods: {
    getDlsAmountForBetting(amount) {
      // 1. Obtener la tasa de conversión (si aplica, si no cae en 1)
      const rate = this.fiatRates?.data?.[this.selectedCurrency] || 1;
      const dlsAmount = amount / rate;

      // 2. NUEVO: Identificar la moneda activa para buscar en el objeto wallet
      const currentCurrency = this.selectedCurrency ? this.selectedCurrency.toLowerCase() : "sc";
      
      // 3. NUEVO: Leer el saldo real desde wallet.sc o wallet.gc
      const walletBalance = this.authUser?.user?.wallet?.[currentCurrency] || 0;

      // Retorna el mínimo entre el monto calculado y lo que realmente tiene en esa billetera
      return Math.min(dlsAmount, walletBalance);
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