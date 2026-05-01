<template>
  <div class="withdraw-element">
  <div class="element-info date">{{ formatDate(transaction.createdAt) }}</div>
    <div class="element-info user">{{ transaction.user || 'N/A' }}</div>
    <div class="element-info address" v-bind:title="transaction.address">
        {{ transaction.address }}
    </div>
    <div class="element-info currency">{{ transaction.currency }}</div>
    <div class="element-info amount">{{ transaction.amount }} SC</div>
    <div class="element-info batch">{{ transaction.batch_id }}</div>
    
    <div class="element-info action">
      <div v-if="!transaction.verified" class="verify-container">
        <input 
          v-model="verificationCode" 
          type="text" 
          placeholder="6-digit code" 
          maxlength="6"
        />
        <button @click="verifyPayout" :disabled="loading || verificationCode.length < 6">
          {{ loading ? '...' : 'Verify' }}
        </button>
      </div>
      <span v-else class="status-verified">COMPLETED</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapActions } from "vuex";

export default {
  name: "AdminWithdrawsElement2",
  props: ["transaction"],
  data() {
    return {
      verificationCode: "",
      loading: false
    };
  },
  methods: {
    ...mapActions(["notificationShow"]),
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    async verifyPayout() {
      this.loading = true;
      try {
        const response = await axios.post(`${process.env.VUE_APP_BACKEND_URL}/payout/verify-payout`, {
          batch_id: this.transaction.batch_id,
          verification_code: this.verificationCode
        });
        
        if (response.data.success) {
          // Opcional: Emitir evento para recargar la lista o marcar como verificado localmente
         // this.$toast.success("Payout released successfully!");
            this.notificationShow({ 
            type: "success", 
            message: "Payout released successfully!" 
      })
          this.transaction.verified = true; 
        }
      } catch (error) {
        const msg = error.response?.data?.error || "Verification failed";
         this.notificationShow({ 
            type: "error", 
            message: "Verification failed." 
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.withdraw-element {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

/* Definición de anchos fijos para evitar que se encimen */
.date     { width: 10%; padding-left: 10px; }
.user     { width: 12%; font-weight: bold; color: #a5a5ff; }
.address  { 
    width: 18%; 
    white-space: nowrap; 
    overflow: hidden; 
    text-overflow: ellipsis; /* Esto pone los puntos suspensivos (...) */
}
.currency { width: 10%; text-align: center; }
.amount   { width: 10%; text-align: center; color: #00ffcc; }
.batch    { width: 15%; text-align: center; font-family: monospace; }
.action   { width: 25%; display: flex; justify-content: center; gap: 5px; }

/* Ajuste para el input de verificación */
.action input {
    width: 100px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid #444;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    text-align: center;
}

.verify-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.verify-container input {
  width: 100px;
  background: #1a242d;
  border: 1px solid #313e49;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  text-align: center;
}

.verify-container button {
  background: linear-gradient(180deg, #00ffc2 0%, #00b38a 100%);
  border: none;
  color: #031422;
  padding: 5px 15px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.verify-container button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status-verified {
  color: #00ffc2;
  font-weight: bold;
  text-transform: uppercase;
}
</style>