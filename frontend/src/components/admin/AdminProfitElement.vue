<template>
  <div
    class="admin-profit-element-v2"
    :class="{ 'is-transparent': transparent }"
  >
    <transition name="fade" mode="out-in">
      <div
        v-if="adminStatsData.data === null || adminStatsData.loading === true"
        class="element-loading-state"
        key="loading"
      >
        <div class="shimmer"></div>
      </div>
      <div v-else class="element-content" key="content">
        <div class="stats-overview">
          <div class="overview-group">
            <div class="group-label">Gaming activity</div>
            <div class="stat-item">
              <span class="label">Total Wager</span>
              <div class="value">
                <span>{{
                  Math.round(getDisplayCurrencyAmount(stats.wager))
                }}</span>
                <Currency currency="sc" />
              </div>
            </div>
            <div class="stat-item">
              <span class="label">Total Won</span>
              <div class="value">
                <span>{{
                  Math.round(getDisplayCurrencyAmount(stats.won))
                }}</span>
                <Currency currency="sc"/>
              </div>
            </div>
            <div
              class="stat-item result"
              :class="{ negative: stats.won > stats.wager }"
            >
              <span class="label">GGR (Net)</span>
              <div class="value">
                <span>{{
                  Math.round(getDisplayCurrencyAmount(stats.wager - stats.won))
                }}</span>
                <Currency currency="sc"/>
              </div>
            </div>
          </div>

          <div class="overview-group">
            <div class="group-label">Cash Flow</div>
            <div class="stat-item">
              <span class="label">Deposits</span>
              <div class="value">
                <span>{{
                  Math.round(getDisplayCurrencyAmount(stats.deposit))
                }}</span>
                <Currency currency="sc"/>
              </div>
            </div>
            <div class="stat-item">
              <span class="label">Withdrawals</span>
              <div class="value">
                <span>{{
                  Math.round(getDisplayCurrencyAmount(stats.withdraw))
                }}</span>
                <Currency currency="sc"/>
              </div>
            </div>
            <div
              class="stat-item result"
              :class="{ negative: stats.deposit < stats.withdraw }"
            >
              <span class="label">Net Cash</span>
              <div class="value">
                <span>{{
                  Math.round(
                    getDisplayCurrencyAmount(stats.deposit - stats.withdraw),
                  )
                }}</span>
                <Currency currency="sc"/>
              </div>
            </div>
          </div>
        </div>

        <div class="games-table-wrapper">
          <div class="group-label">Performance by Game</div>
          <table class="games-table">
            <thead>
              <tr>
                <th>Game Type</th>
                <th>Bet Amount</th>
                <th>Win Amount</th>
                <th class="text-right">RTP</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(stats, game) in stats.games" :key="game">
                <td class="game-name">{{ game }}</td>
                <td>{{ Math.round(getDisplayCurrencyAmount(stats.wager)) }}</td>
                <td>{{ Math.round(getDisplayCurrencyAmount(stats.won)) }}</td>
                <td class="text-right">
                  <span
                    class="rtp-badge"
                    :class="{ high: calculateRTP(stats.wager, stats.won) > 95 }"
                  >
                    {{ calculateRTP(stats.wager, stats.won) }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { currencyExchangeRatesMixin } from "@/currencyExchangeMixin";//
import Currency from "@/components/Currency.vue";

export default {
  name: "AdminProfitElement",
  components: { Currency },
  props: {
    type: String,
    stats: Object,
    transparent: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [currencyExchangeRatesMixin],
  methods: {
    calculateRTP(bet, won) {
      return bet > 0 ? ((won / bet) * 100).toFixed(2) : 0.0;
    },
  },
  computed: {
    ...mapGetters(["adminStatsData"]),
  },
};
</script>

<style scoped lang="scss">
.admin-profit-element-v2 {
  width: 100%;

  &.is-transparent {
    background: transparent;
  }
}

.overview-group {
  margin-bottom: 24px;

  .group-label {
    font-size: 0.7rem;
    font-weight: 800;
    color: #616498;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 12px;
  }
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);

  .label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #9ba0b4;
  }

  .value {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 700;
    color: white;
  }

  &.result {
    margin-top: 4px;
    padding: 12px;
    background: rgba(0, 255, 170, 0.05);
    border-radius: 8px;
    border: none;

    .label {
      color: #00ffaa;
    }
    .value {
      color: #00ffaa;
    }

    &.negative {
      background: rgba(255, 77, 77, 0.05);
      .label {
        color: #ff4d4d;
      }
      .value {
        color: #ff4d4d;
      }
    }
  }
}

.games-table-wrapper {
  margin-top: 30px;

  .group-label {
    font-size: 0.7rem;
    font-weight: 800;
    color: #616498;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 15px;
  }
}

.games-table {
  width: 100%;
  border-collapse: collapse;

  th {
    padding: 12px 8px;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 700;
    color: #616498;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  td {
    padding: 14px 8px;
    font-size: 0.9rem;
    color: #9ba0b4;
    border-bottom: 1px solid rgba(255, 255, 255, 0.02);
  }

  .game-name {
    color: white;
    font-weight: 700;
    text-transform: capitalize;
  }

  .text-right {
    text-align: right;
  }

  .rtp-badge {
    font-size: 0.75rem;
    font-weight: 700;
    color: #ff4d4d;

    &.high {
      color: #00ffaa;
    }
  }
}

.element-loading-state {
  width: 100%;
  height: 300px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  position: relative;
  overflow: hidden;

  .shimmer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.05),
      transparent
    );
    animation: shimmer 1.5s infinite;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.text-right {
  text-align: right;
}
</style>
