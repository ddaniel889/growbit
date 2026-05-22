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
    // Agregamos este prop
    currency: {
      type: String,
      default: null
    }
  },
  components: {},
  data() {
    return {};
  },
  methods: {},
  computed: {
    ...mapGetters(["generalSettings", "authUser", "selectedCurrency"]),
    displayCurrency() {
      // Prioridad: 1. Prop pasado al componente, 2. Selección global
      return this.currency || this.selectedCurrency;
    }
  },
  created() {},
};
</script>

<style scoped lang="scss">
img.currency {
  height: 20px;
  width: 20px;
}
</style>
