<template>
  <div class="admin-dashboard-v3">
    <!-- Admin Hero (Styled like User Profile Header) -->
    <div class="user-overview-header">
      <div class="header-inner">
        <div class="user-info">
          <div class="avatar-wrapper">
            <LayoutDashboard :size="40" color="#5b46bc" />
          </div>
          <div class="text-info">
            <h1 class="user-name">
              Admin <span class="highlight">Overview</span>
            </h1>
            <p class="user-status">Management & Platform Integration</p>
          </div>
        </div>

        <div class="header-stats">
          <div class="stat-box">
            <span class="label">Users Online</span>
            <span class="value">{{
              adminStatsData.data?.onlineCount?.en || 0
            }}</span>
          </div>
          <div class="stat-box accent">
            <span class="label">24h Wager</span>
            <span class="value"
              >${{
                formatCurrency(adminStatsData.data?.stats?.daily?.wager || 0)
              }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid (Structured like Profile sections) -->
    <div class="dashboard-grid">
      <!-- Performance Section -->
      <div class="content-block performance-section">
        <div class="block-header">
          <div class="title-group">
            <BarChart2 :size="20" class="icon" />
            <span class="title">Performance Analysis</span>
          </div>
          <div class="tabs-container">
            <button
              v-for="period in periods"
              :key="period.id"
              class="tab-item"
              :class="{ active: selectedPeriod === period.id }"
              @click="selectedPeriod = period.id"
            >
              {{ period.label }}
            </button>
          </div>
        </div>

        <div class="block-body">
          <transition name="fade" mode="out-in">
            <LoadingAnimation v-if="adminStatsData.loading" key="loading" />
            <div v-else class="chart-wrapper">
              <AdminPerformanceChart
                :period="selectedPeriod"
                :chartData="getChartData"
              />
            </div>
          </transition>
        </div>
      </div>

      <!-- Quick Stats Sidebar -->
      <div class="stats-sidebar">
        <div class="sidebar-card">
          <div class="card-icon"><Activity :size="24" /></div>
          <div class="card-content">
            <span class="card-label">24h Wager</span>
            <span class="card-value"
              >${{
                formatCurrency(adminStatsData.data?.stats?.daily?.wager || 0)
              }}</span
            >
          </div>
        </div>

        <div class="sidebar-card">
          <div class="card-icon"><DollarSign :size="24" /></div>
          <div class="card-content">
            <span class="card-label">24h Net Profit</span>
            <span
              class="card-value"
              :class="getProfitColor(adminStatsData.data?.stats?.daily)"
            >
              {{ formatProfitSign(adminStatsData.data?.stats?.daily) }}${{
                formatProfit(adminStatsData.data?.stats?.daily)
              }}
            </span>
          </div>
        </div>

        <div class="sidebar-card">
          <div class="card-icon"><Wallet :size="24" /></div>
          <div class="card-content">
            <span class="card-label">24h Deposits</span>
            <span class="card-value"
              >${{
                formatCurrency(adminStatsData.data?.stats?.daily?.deposit || 0)
              }}</span
            >
          </div>
        </div>
      </div>

      <!-- Detailed Metrics Block -->
      <div class="content-block metrics-section">
        <div class="block-header">
          <div class="title-group">
            <Activity :size="20" class="icon" />
            <span class="title"
              >Detailed Metrics ({{ selectedPeriodLabel }})</span
            >
          </div>
        </div>
        <div class="block-body table-container">
          <transition name="fade" mode="out-in">
            <AdminProfitElement
              v-if="getCurrentStats"
              :type="selectedPeriod"
              :stats="getCurrentStats"
              transparent
            />
            <div v-else-if="!adminStatsData.loading" class="no-data-msg">
              No detailed data available for this period
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AdminProfitElement from "@/components/admin/AdminProfitElement";
import AdminPerformanceChart from "@/components/admin/AdminPerformanceChart";
import LoadingAnimation from "@/components/LoadingAnimation.vue";
import {
  LayoutDashboard,
  Activity,
  DollarSign,
  Wallet,
  BarChart2,
} from "lucide-vue";

export default {
  name: "AdminDashboardV3",
  components: {
    LoadingAnimation,
    AdminProfitElement,
    AdminPerformanceChart,
    LayoutDashboard,
    BarChart2,
    Activity,
    DollarSign,
    Wallet,
  },
  data() {
    return {
      selectedPeriod: "day",
      periods: [
        { id: "day", label: "24h" },
        { id: "week", label: "7d" },
        { id: "month", label: "30d" },
        { id: "overall", label: "all" },
      ],
    };
  },
  methods: {
    ...mapActions(["adminGetStatsDataSocket", "adminGetStatsListSocket"]),
    formatCurrency(val) {
      return Math.round(val || 0).toLocaleString();
    },
    formatProfit(stats) {
      if (!stats) return "0";
      return this.formatCurrency(Math.abs(stats.wager - stats.won));
    },
    formatProfitSign(stats) {
      if (!stats) return "";
      return stats.wager - stats.won >= 0 ? "+" : "-";
    },
    getProfitColor(stats) {
      if (!stats) return "neutral";
      return stats.wager - stats.won >= 0 ? "positive" : "negative";
    },
    getMockChartData(period) {
      const points = period === "day" ? 24 : period === "week" ? 7 : 30;
      const labels = [];
      const data = [];
      const now = new Date();

      for (let i = 0; i < points; i++) {
        const d = new Date();
        if (period === "day") {
          d.setHours(now.getHours() - (points - 1 - i));
          labels.push(d.getHours() + ":00");
        } else {
          d.setDate(now.getDate() - (points - 1 - i));
          labels.push(
            d.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
          );
        }
        let val = Math.random() * 5000 + 1000;
        if (i > 0) val = data[i - 1] + (Math.random() - 0.5) * 2000;
        if (val < 0) val = 100;
        data.push(val);
      }
      return { labels, data };
    },
  },
  computed: {
    ...mapGetters(["adminStatsData", "adminStatsList"]),
    selectedPeriodLabel() {
      const p = this.periods.find((x) => x.id === this.selectedPeriod);
      return p ? p.label : "";
    },
    getCurrentStats() {
      if (!this.adminStatsData.data?.stats) return null;
      const map = {
        day: "daily",
        week: "weekly",
        month: "monthly",
        overall: "total",
      };
      return this.adminStatsData.data.stats[map[this.selectedPeriod]];
    },
    getChartData() {
      if (this.selectedPeriod === "day") return this.getMockChartData("day");
      if (this.adminStatsList?.data?.length > 0) {
        const sortedReports = [...this.adminStatsList.data].reverse();
        const labels = [];
        const data = [];
        const pointsToTake = this.selectedPeriod === "week" ? 7 : 30;
        const reportsToUse = sortedReports.slice(-pointsToTake);

        reportsToUse.forEach((report) => {
          const date = new Date(report.createdAt);
          labels.push(
            date.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            }),
          );
          data.push(report.stats?.total?.bet || 0);
        });
        if (labels.length > 0) return { labels, data };
      }
      return this.getMockChartData(this.selectedPeriod);
    },
  },
  created() {
    if (this.adminStatsData.loading === false) {
      this.adminGetStatsDataSocket({});
    }
    this.adminGetStatsListSocket({ page: 1 });
  },
};
</script>

<style scoped lang="scss">
.admin-dashboard-v3 {
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;

  @media (max-width: 768px) {
    gap: 15px;
  }
}

.user-overview-header {
  background: #161533;
  border: 4px solid #090c1d;
  border-radius: 10px;
  padding: 25px 30px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 20px;
  }

  .header-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 30px;

    @media (max-width: 1200px) {
      justify-content: center;
      text-align: center;
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 20px;

    @media (max-width: 1200px) {
      flex-direction: column;
      width: 100%;
    }

    .avatar-wrapper {
      width: 80px;
      height: 80px;
      background: #22224a;
      border-radius: 12px;
      display: grid;
      place-content: center;
      flex-shrink: 0;
    }

    .text-info {
      @media (max-width: 1200px) {
        width: 100%;
      }
    }

    .user-name {
      font-size: 1.8rem;
      font-weight: 800;
      color: #eeeeee;
      margin: 0;
      line-height: 1.2;

      @media (max-width: 500px) {
        font-size: 1.5rem;
      }

      .highlight {
        color: #5b46bc;
      }
    }

    .user-status {
      font-size: 1rem;
      color: #767c8b;
      margin: 5px 0 0;
    }
  }

  .header-stats {
    display: flex;
    gap: 15px;

    @media (max-width: 1200px) {
      width: 100%;
      justify-content: center;
    }

    @media (max-width: 600px) {
      flex-direction: column;
      gap: 10px;
    }

    .stat-box {
      padding: 15px 25px;
      background: #22224a;
      border-radius: 9px;
      display: flex;
      flex-direction: column;
      min-width: 160px;

      @media (max-width: 600px) {
        min-width: 100%;
      }

      .label {
        font-size: 0.8rem;
        font-weight: 800;
        color: #616498;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .value {
        font-size: 1.6rem;
        font-weight: 900;
        color: #eeeeee;
        margin-top: 5px;
      }

      &.accent {
        .value {
          color: #f7be2c;
        }
      }
    }
  }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 25px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    gap: 15px;
  }
}

.content-block {
  background: #161533;
  border: 4px solid #090c1d;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;

  .block-header {
    padding: 20px 25px;
    background: rgba(255, 255, 255, 0.02);
    border-bottom: 2px solid #090c1d;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;

    @media (max-width: 600px) {
      padding: 15px;
      flex-direction: column;
      align-items: flex-start;
    }

    .title-group {
      display: flex;
      align-items: center;
      gap: 12px;

      .icon {
        color: #5b46bc;
      }
      .title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #eeeeee;

        @media (max-width: 500px) {
          font-size: 1.1rem;
        }
      }
    }
  }

  .block-body {
    padding: 25px;

    @media (max-width: 768px) {
      padding: 15px;
    }

    &.table-container {
      background: #22224a;
      margin: 20px;
      border-radius: 10px;
      overflow-x: auto;
      scrollbar-width: thin;

      @media (max-width: 768px) {
        margin: 10px;
        padding: 0;
      }
    }
  }
}

.stats-sidebar {
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 1200px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .sidebar-card {
    background: #161533;
    border: 4px solid #090c1d;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    min-height: 90px;

    .card-icon {
      width: 50px;
      height: 50px;
      background: #22224a;
      border-radius: 8px;
      display: grid;
      place-content: center;
      color: #5b46bc;
      flex-shrink: 0;
    }

    .card-content {
      display: flex;
      flex-direction: column;

      .card-label {
        font-size: 0.8rem;
        font-weight: 700;
        color: #616498;
        text-transform: uppercase;
      }

      .card-value {
        font-size: 1.3rem;
        font-weight: 800;
        color: #eeeeee;
        margin-top: 2px;

        &.positive {
          color: #00c74d;
        }
        &.negative {
          color: #fd3b31;
        }
        &.neutral {
          color: #eeeeee;
        }
      }
    }
  }
}

.metrics-section {
  grid-column: 1 / -1;
}

.tabs-container {
  display: flex;
  background: #090c1d;
  padding: 5px;
  border-radius: 8px;
  gap: 5px;

  @media (max-width: 600px) {
    width: 100%;
    justify-content: space-between;
  }

  .tab-item {
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: #616498;
    font-size: 0.85rem;
    font-weight: 800;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.2s;
    flex-grow: 1;
    text-align: center;

    @media (max-width: 500px) {
      padding: 6px 10px;
      font-size: 0.75rem;
    }

    &.active {
      background: #5b46bc;
      color: white;
    }

    &:hover:not(.active) {
      color: white;
    }
  }
}

.chart-wrapper {
  height: 380px;

  @media (max-width: 768px) {
    height: 300px;
  }

  @media (max-width: 500px) {
    height: 250px;
  }
}

.no-data-msg {
  text-align: center;
  padding: 40px;
  color: #616498;
  font-weight: 700;
}
</style>
