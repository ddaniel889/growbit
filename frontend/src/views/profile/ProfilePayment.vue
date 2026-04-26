<template>
  <div class="payment-container">
    <div class="main-title">Create Payment</div>
    
    <div class="form-content">
     <div class="input-profile-group">
        <div class="label">Currency</div>
     <select v-model="currency" :disabled="loadingCurrencies" class="custom-select">
  <option value="" disabled>
    {{ loadingCurrencies ? 'Loading currencies...' : 'Select a currency' }}
  </option>
  <option v-for="coin in availableCurrencies" :key="coin" :value="coin">
    {{ coin.toUpperCase() }}
  </option>
</select>
      </div>

      <div class="input-profile-group">
        <div class="label">Amount</div>
        <input type="number" v-model="amount" placeholder="100">
      </div>

  
      <div class="button-container">
        <app-button :fullwidth="true" @click.native="generatePayment" >
          {{ loading ? 'Procesando...' : 'Confirm' }}
        </app-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import AppButton from "@/components/AppButton.vue";

import { mapActions } from "vuex";

export default {
  name: "ProfilePayments",
   components: {
    AppButton
  },
  data() {
    return {
      amount: 100,
      currency:'',
      orderId: '',
      loading: false,
      availableCurrencies: [],
      loadingCurrencies: false
    };
  },
  mounted() {
    // Cargamos las monedas al montar el componente
    this.fetchCurrencies();
  },
  methods: {
      ...mapActions([
      "notificationShow",
      "modalsSetData",
      "modalsSetShow",
      "authSendCredentialsRequest",
    ]),
    async fetchCurrencies() {
      this.loadingCurrencies = true;
   try {
    const response = await axios.get('http://localhost:4444/api/full-currencies');
    
    // Si la imagen muestra exactamente [ "usdttrc20", ... ], 
    // entonces response.data es el array.
    if (Array.isArray(response.data)) {
      this.availableCurrencies = response.data;
    } else if (response.data.currencies) {
      this.availableCurrencies = response.data.currencies;
    }
    
    console.log("Monedas cargadas:", this.availableCurrencies);
  } catch (error) {
        console.error("Error fetching currencies:", error);
        this.notificationShow({
          text: "No se pudieron cargar las monedas",
          type: "error"
        });
      } finally {
        this.loadingCurrencies = false;
      }
    },
    async generatePayment() {
      this.loading = true;
      try {
        const response = await axios.post('http://localhost:4444/api/create-payment', {
          amount: this.amount,
          currency: this.currency,
          order_id: this.orderId
        });

        // Redirigir al usuario a la página de pago de NOWPayments
        if (response.data.invoice_url) {
          window.location.href = response.data.invoice_url;
        }
      } catch (error) {
        alert("Error al crear el pago");
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.payment-container {
  padding: 30px;
  width: 100%;
  max-width: 600px; // Ajusta según necesites
  background: #1a1b3a; // El color oscuro de fondo de tu segunda imagen
  border-radius: 10px;
  border: 1px solid #22224a;

  .main-title {
    font-weight: 700;
    font-size: 1.714rem;
    color: #ffffff;
    margin-bottom: 25px;
  }

  .form-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .input-profile-group {
    display: flex;
    flex-direction: column;

    .label {
      font-weight: 500;
      font-size: 1.1rem;
      color: #ffffff;
      margin-bottom: 10px;
    }

    input {
      width: 100%;
      padding: 13px 15px;
      height: 50px;
      background: #25264b; // Fondo oscuro del input
      border: 2px solid #2d2e5a;
      border-radius: 10px;
      color: #eeeeee;
      outline: none;
      transition: border-color 0.3s;

      &:focus {
        border-color: #6c5ce7; // Color morado al hacer focus
      }

      &::placeholder {
        color: #616498;
      }
    }
  }

  .button-container {
    margin-top: 10px;
    
    // Si tu app-button no tiene el estilo morado por defecto:
    ::v-deep button {
       height: 50px;
       font-weight: 700;
       font-size: 1.2rem;
       border-radius: 8px;
    }
  }
}

// Media queries para móvil
@media only screen and (max-width: 991px) {
  .payment-container {
    padding: 20px;
    background: transparent;
    border: none;
  }
}
</style>
