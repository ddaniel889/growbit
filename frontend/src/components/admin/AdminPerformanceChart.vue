<template>
  <div class="performance-chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  name: "AdminPerformanceChart",
  props: {
    chartData: {
      type: Object,
      default: () => ({ labels: [], data: [] }),
    },
    period: {
      type: String,
      default: "week",
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    period() {
      this.updateChart();
    },
    chartData: {
      deep: true,
      handler() {
        this.updateChart();
      },
    },
  },
  mounted() {
    this.renderChart();
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  },
  methods: {
    renderChart() {
      if (!this.$refs.chartCanvas) return;
      if (
        !this.chartData ||
        !this.chartData.labels ||
        !this.chartData.data ||
        this.chartData.labels.length === 0
      ) {
        return;
      }

      const ctx = this.$refs.chartCanvas.getContext("2d");

      // Gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "rgba(0, 198, 255, 0.4)");
      gradient.addColorStop(1, "rgba(0, 198, 255, 0.0)");

      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.chartData.labels,
          datasets: [
            {
              label: "Wager Volume",
              data: this.chartData.data,
              borderColor: "#00c6ff",
              backgroundColor: gradient,
              borderWidth: 3,
              pointBackgroundColor: "#191c26",
              pointBorderColor: "#00c6ff",
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
              fill: true,
              tension: 0.4, // Smooth curves
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: "#22244a",
              titleColor: "#fff",
              bodyColor: "#9ba0b4",
              borderColor: "#00c6ff",
              borderWidth: 1,
              padding: 10,
              displayColors: false,
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || "";
                  if (label) {
                    label += ": ";
                  }
                  if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(context.parsed.y);
                  }
                  return label;
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                color: "#616498",
                maxTicksLimit: 12,
                font: {
                  family: "'Inter', sans-serif",
                  size: 11,
                },
              },
            },
            y: {
              grid: {
                color: "#2e3259",
                borderDash: [5, 5],
                drawBorder: false,
              },
              ticks: {
                color: "#616498",
                callback: function (value) {
                  return "$" + value.toLocaleString();
                },
                font: {
                  family: "'Inter', sans-serif",
                  size: 11,
                },
              },
            },
          },
          interaction: {
            intersect: false,
            mode: "index",
          },
        },
      });
    },
    updateChart() {
      if (!this.chart) {
        this.renderChart(); // Attempt to render if chart doesn't exist yet
        return;
      }
      if (
        !this.chartData ||
        !this.chartData.labels ||
        !this.chartData.data ||
        this.chartData.labels.length === 0
      ) {
        // If chartData is invalid, destroy the chart to clear it
        this.chart.destroy();
        this.chart = null;
        return;
      }

      this.chart.data.labels = this.chartData.labels;
      this.chart.data.datasets[0].data = this.chartData.data;
      this.chart.update();
    },
  },
};
</script>

<style scoped>
.performance-chart-container {
  position: relative;
  width: 100%;
  height: 350px;
}
</style>
