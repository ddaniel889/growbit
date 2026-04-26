<template>
  <div class="tip-container">

   <div class="field-group">
  <label>Currency</label>
  <div class="custom-dropdown" @click="showOptions = !showOptions">
    <div class="selected-item" v-if="selectedCoin">
     <img :src="selectedCoin.logo_url" width="24" height="24" class="coin-icon" alt="logo" />
      <span>{{ selectedCoin.name }} ({{ selectedCoin.code.toUpperCase() }})</span>
    </div>
    <div v-else class="placeholder">Select Currency</div>
    
    <div class="options-list" v-if="showOptions">
      <div 
        v-for="coin in currenciesList" 
        :key="coin.id" 
        class="option-item"
        @click.stop="selectCurrency(coin)"
      >
        <img :src="coin.logo_url" class="coin-icon" />
        <span>{{ coin.name }} ({{ coin.code.toUpperCase() }})</span>
      </div>
    </div>
  </div>
</div>

    <div class="field-group">
      <label>Amount (USD)</label>
      <div class="amount-input-wrapper">
        <input v-model.number="amount" placeholder="0" min="0" type="number" />
        <Currency></Currency>
      </div>
    </div>

    <div class="conversion-display">
      <div class="coin-result">
        <span class="label">SC</span>
        <span class="value">{{ calculatedSC }}</span>
      </div>
      <div class="coin-result">
        <span class="label">GC</span>
        <span class="value">{{ calculatedGC }}</span>
      </div>
    </div>

  <!--div v-if="paymentData" class="payment-widget-container">

  <div class="payment-header">
        <h3>Complete your Deposit</h3>
        <p>Follow the instructions in the secure window below</p>
  </div>
  <div class="qr-wrapper">
    <iframe 
      :src="paymentData.invoice_url" 
      width="100%" 
      height="450px" 
      frameborder="0" 
      style="border-radius: 10px; background: white;"
    ></iframe>
    
  </div>

  <p v-if="paymentData" style="color: #888; font-size: 12px; text-align: center; margin-top: 10px;">
  <i class="fas fa-info-circle"></i> 
  The balance will be credited automatically after network confirmation.
</p>
  
  <div class="payment-instructions">
    <p class="warning">
      <i class="fas fa-exclamation-triangle"></i>
      Only send <strong class="detailed">{{ selectedCoin.code.toUpperCase() }}</strong> over the <strong class="detailed">{{ selectedCoin?.network.toUpperCase() }}</strong> network.
    </p>
  </div>
</div-->



<div class="qr-wrapper custom-dark-style" v-if="paymentData?.network">
  <div class="network-info" >
    <label>NETWORK</label>
    <div class="network-badge">
      <img :src="`/img/cashier/${paymentData?.network.toLowerCase()}.png`" alt="">
      {{ paymentData?.network }} Network
    </div>
  </div>

  <div class="qr-container">
    <qrcode-vue :value="paymentData?.pay_address" :size="200" level="H" render-as="svg" />
  </div>

  <div class="address-field">
    <p>Your {{ paymentData?.pay_currency.toUpperCase() }} deposit address</p>
    <div class="input-copy-group">
      <input type="text" :value="paymentData?.pay_address" readonly>
      <button @click="copyAddress"><i class="fas fa-copy"></i></button>
    </div>
  </div>

  <div class="deposit-notes">
    <p>Fixed fee: {{ paymentData?.fee }} | Min confirmations: 10</p>
    <p class="warning">⚠️ Only send {{ paymentData?.pay_currency }} over the {{ paymentData?.network }} Network</p>
  </div>
</div>




<app-button 
  :fullwidth="true" 
  :click="handleAction" 
  :height="'50px'"
  :color="paymentData ? 'success' : 'primary'"
>
  <span v-if="loading">Processing...</span>
  <span v-else-if="paymentData">I have sent the payment</span>
  <span v-else>Confirm Deposit</span>
</app-button>

  </div>
</template>

<script>
import axios from 'axios';
import AppButton from "@/components/AppButton.vue";
import Currency from "@/components/Currency.vue";
import { mapActions } from "vuex";
import QrcodeVue from 'qrcode.vue';

export default {
  data() {
    return {
      showOptions: false,
      selectedCoin: null, // Guardamos el objeto completo aquí
      currency: null,     // Tu v-model original para el ticke
      amount: 0,
      loading: false,
      currenciesList: [], // Para almacenar las monedas de la API
      paymentData: null,
    };
  },
  components: { AppButton, Currency,QrcodeVue },
  computed: {
  // SC es amount * 1
  calculatedSC() {
    return this.amount > 0 ? this.amount : 0;
  },
  // GC es amount * 100 (según tu lógica de 1 unidad : 100 unidades)
  calculatedGC() {
    return this.amount > 0 ? this.amount * 100 : 0;
  }
},


  mounted() {
    this.fetchCurrencies();
  // 1. Obtenemos el socket del namespace 'cashier' desde Vuex
  const cashierSocket = this.$store.getters["socketCashier"];

 if (cashierSocket) {
    cashierSocket.on("PAYMENT_SUCCESS", (data) => {
      // 1. Actualizar balance
      if (data.user) {
        this.$store.commit("auth_update_user", data.user);
      }
      console.log('Socket PAYMENT_SUCCESS');
      // 2. Limpiar datos para evitar que se use el mismo ID de factura
      this.paymentData = null; 
      this.isGenerating = false;

      // 3. Notificación estilo casino
      const addedAmount = data.added || 0;
      this.$store.dispatch("notificationShow", {
        type: "success",
        message: `¡Depósito acreditado! +${addedAmount.toFixed(2)} USD.`
      });

      // 4. Cerrar el modal usando el sistema de tu store
      this.$store.dispatch("modalsSetShow", null);
    });
  }
  },
  beforeDestroy() {
 // MUY IMPORTANTE: Usar el getter para hacer el .off() y evitar fugas de memoria
  const cashierSocket = this.$store.getters["socketCashier"];
  if (cashierSocket) {
    cashierSocket.off("PAYMENT_SUCCESS");
  }

   document.removeEventListener("click", this.closeOnOutsideClick);
  },
  created() {
    // Escuchamos clics globales cuando el componente se crea
    document.addEventListener("click", this.closeOnOutsideClick);
  },
 
  methods: {
    ...mapActions(["notificationShow","modalsSetShow"]),
    selectCurrency(coin) {
    this.selectedCoin = coin;
    this.currency = coin.code; // Para que tu método de pago siga funcionando
    this.showOptions = false;
  },
  // --- Esta es la función mágica que cierra el menú ---
    closeOnOutsideClick(event) {
      // Verificamos si el clic ocurrió dentro de nuestro elemento dropdown
      const dropdown = this.$el.querySelector(".custom-dropdown");
      
      // Si el elemento clickeado NO es parte del dropdown, lo cerramos
      if (dropdown && !dropdown.contains(event.target)) {
        this.showOptions = false;
      }
    },
    copyAddress() { //copia EXCHANGE NETWOK
    if (!this.paymentData?.pay_address) return;
    
    navigator.clipboard.writeText(this.paymentData?.pay_address);
    this.notificationShow({
      type: "success",
      message: "Address copied to clipboard!"
    });
  },
    async fetchCurrencies() {
      try {
        // Consumimos tu endpoint de Node
        const response = await axios.get('http://localhost:4444/api/full-currencies');
        // Filtramos para asegurar que tenemos tickers válidos
        console.log('response',response)
        this.currenciesList = response.data.sort((a, b) => a.name.localeCompare(b.name));
      } catch (error) {
        console.error("Error cargando monedas", error);
      }
    },
  async handleAction() {
  if (!this.paymentData) {
    // ESTADO 1: No hay factura, la generamos
    await this.generateInvoice();
    //this.closeModal();
  } else {
    // ESTADO 2: El QR ya existe, el usuario dice que ya pagó
    this.notificationShow({ 
      type: "success", 
      message: "Checking your payment... This may take a few minutes." 
    });
    
    // Cambiamos el texto del botón o el estado para dar feedback visual
    this.loading = true; // Activa el "Processing..."
    // Opcional: Cerramos el modal después de unos segundos
   /* setTimeout(() => {
      this.$emit('close');
    }, 2000);*/
  }
},
  async generateInvoice() {
    if (!this.currency || this.amount <= 0) {
      this.notificationShow({ type: "error", message: "Please select currency and amount" });
      return;
    }

    this.loading = true;
    try {
      const response = await axios.post('http://localhost:4444/api/payment/create', {
        amount: this.amount,
        currency: this.currency,
      });

      // Guardamos la respuesta completa (incluye invoice_url)
      this.paymentData = response.data;
      console.log(' Guardamos la respuesta completa (incluye invoice_url)')
      this.loading = false;
      this.notificationShow({ 
      type: "success", 
      message: "Your deposit request has been completed successfully!" 
      })
      //this.modalsSetShow(null);
      
    } catch (error) {
    // Si la API responde con un error de disponibilidad
    const errorMsg = error.response?.data?.message || "Failed to generate payment QR";
    
    if (errorMsg.includes("unavailable")) {
        this.notificationShow({ 
            type: "error", 
            message: "This currency is temporarily unavailable. Please try another one." 
        });
    } else {
        this.notificationShow({ type: "error", message: errorMsg });
    }
}
  },


  }
};
</script>
<style lang="scss" scoped>
.tip-container {
  display: flex;
  flex-direction: column;
  padding: 30px;
  gap: 20px;
  background: #0f0e26; // Fondo oscuro tipo casino
  width: 100%;


  .qr-wrapper.custom-dark-style {
  background: #1a1d23; /* Color oscuro de tu casino */
  padding: 20px;
  border: 1px solid #2d323e;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-container {
  background: #fff; /* El QR suele necesitar fondo blanco para escanearse bien */
  padding: 10px;
  border-radius: 8px;
  margin: 20px 0;
}

.input-copy-group {
  display: flex;
  background: #0f1216;
  border-radius: 5px;
  width: 100%;
  padding: 5px;
}

.input-copy-group input {
  background: transparent;
  border: none;
  color: #8a92b2;
  flex-grow: 1;
  padding: 10px;
  font-size: 14px;
}

.deposit-notes {
  font-size: 12px;
  color: #4f5b70;
  text-align: center;
  margin-top: 15px;
}

.deposit-notes .warning {
  color: #ff4d4d;
  font-weight: bold;
}








.payment-widget-container {
  margin-top: 20px;
    background: #ffffff; // Fondo blanco para que el widget se integre perfectamente
    border-radius: 12px;
    overflow: hidden;
    padding: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    animation: fadeIn 0.5s ease;

    .payment-header {
        padding: 10px;
        text-align: center;
        border-bottom: 1px solid #eee;
        
        h3 { color: #1a1a1a; margin: 0; font-size: 1.2rem; }
        p { color: #666; font-size: 0.9rem; margin-top: 5px; }
    }

  .qr-wrapper {
    margin-bottom: 15px;
    overflow: hidden;
    border-radius: 8px;
  }

  .payment-instructions {
    .warning {
      background: rgba(255, 193, 7, 0.1);
      border-left: 4px solid #f7be2c;
      padding: 10px;
      color: #f7be2c;
      font-size: 0.9rem;
      line-height: 1.4;
      
      strong.detailed { color: black; }
    }
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

  // --- Estilos del Dropdown Personalizado ---
  .custom-dropdown {
    position: relative;
    width: 100%;
   height: 56px;
    background: #161533;
    border: 2px solid #22224a;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 15px;
    transition: border-color 0.3s ease;

    &:hover {
      border-color: #3b3a7a;
    }

    .placeholder {
      color: #616498;
      font-size: 1.1rem;
    }

    .selected-item {
      display: flex;
      align-items: center;
      gap: 12px;
      color: white;
      font-size: 1.1rem;

      .coin-icon {
        width: 24px;
        height: 24px;
        object-fit: contain;
      }
    }

    box-sizing: border-box; 

    .options-list {
      position: absolute;
      top: 60px; // Un poco de separación del input
      left: 0;
      width: 100%;
      max-height: 250px;
      overflow-y: auto;
      background: #161533;
      border: 2px solid #22224a;
      border-radius: 10px;
     z-index: 9999;      // Para que pase por encima del input de "Amount"
    box-shadow: 0px 10px 20px rgba(0,0,0,0.6); // Sombra para dar profundidad

      /* Scrollbar personalizada para que no rompa la estética */
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-thumb {
        background: #22224a;
        border-radius: 10px;
      }

      .option-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 15px;
        color: #eeeeee;
        transition: background 0.2s;

        &:hover {
          background: #22224a;
          color: white;
        }

        .coin-icon {
          width: 20px;
          height: 20px;
          object-fit: contain;
        }

        span {
          font-size: 1rem;
        }
      }
    }
  }

  // --- Estilos de los campos de entrada y etiquetas ---
  .field-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
      font-weight: 700;
      font-size: 1.29rem;
      margin-bottom: 5px;
      color: #eeeeee;
    }
  }

  .amount-input-wrapper {
    width: 100%;
    height: 56px;
    background: #161533;
    border: 2px solid #22224a;
    border-radius: 10px;
    color: white;
    padding: 0 15px;
    display: flex;
    align-items: center;

    &:focus-within {
      border-color: #5d59ff;
    }

    input {
      background: transparent;
      border: none;
      color: white;
      flex-grow: 1;
      outline: none;
      font-size: 1.2rem;
      width: 100%;
      
      &::placeholder { 
        color: #616498; 
      }

      /* Quitar flechas del input number */
      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
  }

  // --- Display de conversión ---
  .conversion-display {
    display: flex;
    justify-content: space-around;
    background: rgba(81, 71, 255, 0.1);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #22224a;

    .coin-result {
      display: flex;
      flex-direction: column;
      align-items: center;

      .label {
        color: #f7be2c;
        font-weight: bold;
        font-size: 0.8rem;
        text-transform: uppercase;
      }
      .value {
        font-size: 1.3rem;
        font-weight: 800;
        color: white;
      }
    }
  }
}
</style>