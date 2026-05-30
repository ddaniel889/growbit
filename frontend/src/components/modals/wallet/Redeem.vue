<template>
  <div class="tip-container">

  <div class="field-group">
  <label>Select network</label>
  <select v-model="selectedNetwork" class="custom-select">
    <option value="trc20">Tron (TRC20)</option>
    <option value="erc20">Ethereum (ERC20)</option>
    <option value="bep20">Binance Smart Chain (BEP20)</option>
  </select>
</div>

    <div class="field-group">
      <label>Wallet Address (Crypto)</label>
      <div class="address-input-container">
        <div class="amount-input-wrapper">
          <input v-model="walletAddress" placeholder="Paste your address here" type="text" />
          <button 
            class="save-address-btn" 
            @click="saveCurrentAddress" 
            :disabled="!walletAddress"
            title="Save this address"
          >
            <i class="fas fa-save"></i> Save
          </button>
        </div>
      </div>
      
      <select v-if="savedAddresses.length" v-model="walletAddress" class="saved-addresses-select">
        <option value="" disabled>Or select a saved address...</option>
        <option v-for="addr in savedAddresses" :key="addr" :value="addr">
          {{ addr.substring(0, 8) }}...{{ addr.substring(addr.length - 8) }}
        </option>
      </select>
    </div>
   
    <div class="field-group">
      <label>Amount (SC)</label>
      <div class="amount-input-wrapper">
        <input v-model.number="amount" placeholder="0" type="number" />
        <Currency></Currency>
      </div>
    </div>

    <div class="conversion-display">
      <div class="coin-result">
        <!--span class="label">SC</span>
        <span class="value">150</span-->
        <div class="info-row">
      <span>Estimated Network Fee: </span>
      <span class="fee-value">${{ currentNetworkFee.toFixed(2) }}</span>
    </div>  
        <span class="label">ESTIMATED RECEIVE (USD)</span>
        <span class="value">${{estimatedReceived }}</span>
      </div>
    </div>

  <app-button 
      :fullwidth="true" 
      :click="handleWithdraw" 
      :disabled="amount < 10 || !walletAddress  || !canWithdraw"
      :height="'50px'"
    >
        {{ loading ? 'Processing...' : 'Withdraw SC' }}
  </app-button>
    <p v-if="amount > 0 && amount < 10" class="min-warning">Minimum withdrawal is 100 SC</p>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import AppButton from "@/components/AppButton.vue";
import Currency from "@/components/Currency.vue";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      currentNetworkFee:0.00,
      amount: 0,
      walletAddress: '',
      loading: false,
      selectedNetwork: 'trc20', // Por defecto Tron por bajas comisiones
      savedAddresses: this.$store.state.auth.user?.cryptoAddresses || []
    };
  },
  computed: {
    estimatedReceived() {
      // Nota que usamos "this" para acceder a la data
      const result = this.amount - this.currentNetworkFee;
      return result > 0 ? result.toFixed(2) : "0.00";
    },
    
    userBalanceSc() {
      return this.$store.state.auth.user?.wallet?.sc || 0;
    },

    // Validación para el botón
    canWithdraw() {
      // 1. El monto debe superar la comisión de red
      // 2. El monto ingresado NO debe superar el saldo disponible en la wallet
      return this.amount > this.currentNetworkFee && this.amount <= this.userBalanceSc;
    }
  },
  components: { AppButton, Currency },
  mounted() {
    this.updateFee();
  },
     watch: {
  selectedNetwork() {
    this.updateFee();
  },
  // Vigilamos el monto (opcional, pero recomendado para precisión)
    amount() {
      if (this.amount >= 10) { // Solo consultar si cumple el mínimo
         this.updateFee();
      }
    }
}
,
  methods: {
    ...mapActions(["notificationShow","modalsSetShow"]),

    isValidAddress(address, network) {
      const regexMap = {
        trc20: /^T[a-zA-Z0-9]{33,34}$/,
        erc20: /^0x[a-fA-F0-9]{40}$/,
        bep20: /^0x[a-fA-F0-9]{40}$/
      };
      return regexMap[network]?.test(address) || false;
    },

    // Función para traer el fee real de la API
 async updateFee () {
    try {

        // Mapeamos la red seleccionada al ticker de NOWPayments
    const tickerMap = {
      trc20: 'usdttrc20',
      erc20: 'usdterc20',
      bep20: 'usdtbep20'
    };
    const currency = tickerMap[this.selectedNetwork];
        // Enviamos el ticker como parámetro de consulta (?currency=...)
    // Enviamos AMBOS parámetros requeridos
        const { data } = await axios.get(`${process.env.VUE_APP_BACKEND_URL}/payout_fee`, {
          params: { 
            currency: currency,
            amount: this.amount || 15 // Enviamos 15 como fallback si amount es 0
          }
        });
    
    if (data.success) {
            this.currentNetworkFee = data.fee;
          
        }
    } catch (err) {
        console.error("Error actualizando fee");
    }
  },

  async handleWithdraw() {
      // 1. Validaciones de UI iniciales
      if (this.amount < 10) return;

      

      if (this.amount > this.userBalanceSc) {
        this.notificationShow({
          type: "error",
          message: "You do not have enough available balance in SC to make this withdrawal."
        });
        return;
      }

      if (!this.isValidAddress(this.walletAddress, this.selectedNetwork)) {
        this.notificationShow({
          type: "error",
          message: `Invalid address for the network ${this.selectedNetwork.toUpperCase()}.`
        });
        return;
      }

      this.loading = true;

      try {
        // 2. Consulta de Custodia antes de procesar
        const balanceRes = await axios.get(`${process.env.VUE_APP_BACKEND_URL}/custody_balance`);
        const balances = balanceRes.data;

        // Mapeo de tu select al ticker de la API de NOWPayments
       const tickerMap = {
             trc20: 'usdttrc20', // Cambiado de 'trx' a 'usdttrc20'
             erc20: 'usdterc20', // Probable nombre para la red Ethereum
             bep20: 'usdtbep20'  // Probable nombre para la red Binance
       };
      const selectedTicker = tickerMap[this.selectedNetwork];
      const availableInCustody = balances[selectedTicker]?.amount || 0;

      console.log("Ticker seleccionado:", selectedTicker);
      console.log("Saldo encontrado:", availableInCustody);

        // 3. Validación de fondos reales en NowPayments
        // Comparamos el monto solicitado (SC) vs Saldo real en la red
        if (availableInCustody <= 0 || availableInCustody < (this.amount)) {
          this.notificationShow({
            type: "error",
            message: `There are not enough funds in the network ${this.selectedNetwork.toUpperCase()} para procesar este retiro.`
          });
          this.loading = false;
          return;
        }

        // 4. Si hay balance, ejecutamos el payout
        const response = await axios.post(`${process.env.VUE_APP_BACKEND_URL}/payout`, {
          amount: this.amount,
          address: this.walletAddress,
          network: this.selectedNetwork // Enviamos la red dinámicamente
        });
        
        if(response){
           this.notificationShow({
           type: "success",
          message: "Withdrawal request sent successfully, in a few minutes the payment will be credited to your wallet"
        });

        this.amount = 0;
        this.walletAddress = '';
        this.modalsSetShow(null);
        }
       

      } catch (error) {
        console.log('error',error)
     if (error && error.status === 400) {
         console.log('error')
       }
        this.notificationShow({
          type: "error",
          message: error.response?.data?.error || "Error processing withdrawal"
        });
      } finally {
        this.loading = false;
      }
    },

    async saveCurrentAddress() {
      console.log('saveCurrentAddress')
    },
    

 
  }
}
</script>
<style lang="scss" scoped>
.tip-container {

 .min-warning {
  color: #ff4d4d;
  font-size: 0.8rem;
  text-align: center;
  margin-top: -10px;
 }

 .address-input-container {
  display: flex;
  gap: 10px;
  width: 100%;
}

.save-address-btn {
  background: #5d59ff;
  border: none;
  color: white;
  padding: 0 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: opacity 0.2s;

  &:disabled {
    background: #22224a;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    opacity: 0.8;
  }
}

.saved-addresses-select {
  margin-top: 8px;
  background: #161533;
  border: 1px solid #22224a;
  color: #616498;
  border-radius: 8px;
  padding: 5px;
  font-size: 0.85rem;
  outline: none;
  cursor: pointer;
}

  @media screen and (max-width: 991px) {
    padding: 15px;
  }

  display: flex;
  flex-direction: column;
  padding: 30px;
  gap: 20px; // Espacio entre grupos
  background: #0f0e26; // Color oscuro del fondo del casino
  width: 100%;



  .field-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
    font-weight: 700;
    font-size: 1.29rem;
    margin-bottom: 10px;
    color: #eeeeee;
  }

  }

  .custom-select, .amount-input-wrapper {
    width: 100%;
    height: 56px;
    background: #161533;
    border: 2px solid #22224a;
    border-radius: 10px;
    color: white;
    padding: 0 15px;
    font-size: 1.1rem;
    display: flex;
    align-items: center;

    &:focus-within {
      border-color: #5d59ff;
    }
  }

  .custom-select {
    appearance: none; // Quita el estilo por defecto del sistema
    cursor: pointer;
  }

  .username {
    padding-inline: 10px;
    height: 56px;
    border: 2px solid #22224a;
    border-radius: 10px;
    margin-bottom: 15px;

    &::placeholder {
      color: #616498;
    }
    @media screen and (max-width: 991px) {
      background: #161533;
      height: 50px;
    }
  }

  .amount-input-wrapper {
    input {
      background: transparent;
      border: none;
      color: white;
      flex-grow: 1;
      outline: none;
      font-size: 1.2rem;
      
      &::placeholder { color: #616498; }
    }
  }

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