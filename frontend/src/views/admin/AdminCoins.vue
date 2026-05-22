<template>
  <div class="admin-currencies">
    <div class="card">
      <div class="card-header">
        <h3>Currencies</h3>
      </div>
      
      <div class="currency-list">
    
        <div v-for="currency in availableCurrencies" :key="currency.id" class="currency-row">
          <div class="currency-info">
            <img :src="`/img/currencies/${currency.id.toLowerCase()}_icon.png`" class="currency-icon" />
            <span class="currency-name">{{ currency.name }} ({{ currency.id.toUpperCase() }})</span>
          </div>
          
          <div class="currency-actions">
        
            <span class="status-badge active">Active</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Definimos las monedas actuales basadas en tu modelo User
      availableCurrencies: [
        { id: 'gc', name: 'Gold Coins' },
        { id: 'sc', name: 'Sweeps Coins' }
      ]
    }
  }
}
</script>

<style scoped>
.currency-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  margin-bottom: 10px;
  border-radius: 8px;
  transition: 0.3s;
}

.currency-row:hover {
  background: rgba(255, 255, 255, 0.1);
}

.currency-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.currency-icon {
  width: 32px;
  height: 32px;
}

.status-badge.active {
  color: #4caf50;
  background: rgba(76, 175, 80, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
}
</style>