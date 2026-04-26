<template>
  <div class="stats-card-v2">
    <div class="card-glow" :class="color"></div>
    <div class="card-inner">
      <div class="icon-section" :class="color">
        <component :is="icon" :size="20" />
      </div>
      <div class="info-section">
        <div class="label-row">
          <span class="label">{{ label }}</span>
          <div
            class="trend-badge"
            v-if="trend"
            :class="trend > 0 ? 'positive' : 'negative'"
          >
            <component
              :is="trend > 0 ? 'TrendingUp' : 'TrendingDown'"
              :size="12"
            />
            <span>{{ Math.abs(trend) }}%</span>
          </div>
        </div>
        <div class="value">
          <span class="currency-symbol" v-if="isCurrency">$</span>
          <span class="number">{{ value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TrendingUp, TrendingDown } from "lucide-vue";

export default {
  name: "AdminStatsCard",
  components: { TrendingUp, TrendingDown },
  props: {
    label: String,
    value: [String, Number],
    icon: Object, // Lucide icon component
    color: {
      type: String,
      default: "blue", // blue, green, purple, orange
    },
    isCurrency: Boolean,
    trend: Number,
  },
};
</script>

<style lang="scss" scoped>
.stats-card-v2 {
  position: relative;
  background: rgba(25, 28, 38, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 20px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

    .card-glow {
      opacity: 0.15;
    }
  }

  .card-glow {
    position: absolute;
    top: -50px;
    right: -50px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.05;
    transition: opacity 0.3s;
    pointer-events: none;

    &.blue {
      background: #00c6ff;
    }
    &.green {
      background: #00ffaa;
    }
    &.purple {
      background: #9d00ff;
    }
    &.orange {
      background: #ffaa00;
    }
  }

  .card-inner {
    display: flex;
    align-items: center;
    gap: 16px;
    position: relative;
    z-index: 1;
  }

  .icon-section {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.3s;

    &.blue {
      color: #00c6ff;
      background: rgba(0, 198, 255, 0.1);
      border-color: rgba(0, 198, 255, 0.2);
    }
    &.green {
      color: #00ffaa;
      background: rgba(0, 255, 170, 0.1);
      border-color: rgba(0, 255, 170, 0.2);
    }
    &.purple {
      color: #9d00ff;
      background: rgba(157, 0, 255, 0.1);
      border-color: rgba(157, 0, 255, 0.2);
    }
    &.orange {
      color: #ffaa00;
      background: rgba(255, 170, 0, 0.1);
      border-color: rgba(255, 170, 0, 0.2);
    }
  }

  .info-section {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;

    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #7c83ff;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .value {
      display: flex;
      align-items: baseline;
      gap: 2px;

      .currency-symbol {
        font-size: 1.1rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.5);
      }

      .number {
        font-size: 1.5rem;
        font-weight: 800;
        color: white;
        letter-spacing: -0.5px;
      }
    }

    .trend-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.7rem;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 6px;

      &.positive {
        color: #00ffaa;
        background: rgba(0, 255, 170, 0.1);
      }
      &.negative {
        color: #ff4d4d;
        background: rgba(255, 77, 77, 0.1);
      }
    }
  }
}
</style>
