<template>
  <img
    class="currency"
    :src="`/img/currencies/${displayCurrency}_icon.png`"
    alt="icon"
  />
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Currency",
  props: {
    currency: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters(["generalSettings", "authUser", "selectedCurrency"]),
    displayCurrency() {
      // 1. Tomamos el prop o la moneda global seleccionada
      const currencyValue = this.currency || this.selectedCurrency;
      
      // 2. Si por alguna razón es null/undefined, aseguramos un fallback (ej: 'sc')
      // 3. Aplicamos toLowerCase() para evitar problemas con Linux/Render
      return currencyValue ? currencyValue.toLowerCase() : 'sc';
    }
  }
};
</script>

<style scoped lang="scss">
img.currency {
  height: 20px;
  width: 20px;
  vertical-align: middle; /* Pequeño ajuste por si se desalinea en los inputs */
}
</style>