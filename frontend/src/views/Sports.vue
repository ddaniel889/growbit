<template>
  <div class="sports-container">
    <div class="top-banner">
      <div class="banner-content">
        <h1>Sports Betting</h1>
        <p>Real-time odds from 250+ bookmakers</p>
      </div>
    </div>

    <div class="main-content">
      <!-- Sports Navigation -->
      <div class="sports-nav">
        <div
          v-for="sport in sports"
          :key="sport.slug"
          class="sport-item"
          :class="{ active: selectedSport === sport.slug }"
          @click="selectSport(sport.slug)"
        >
          <span class="sport-name">{{ sport.name }}</span>
        </div>
      </div>

      <!-- Events List -->
      <div class="events-section">
        <LoadingAnimation v-if="loadingEvents" />
        <div v-else-if="events.length > 0" class="events-grid">
          <div v-for="event in events" :key="event.id" class="event-card">
            <div class="event-header">
              <span class="league-name">{{ event.league.name }}</span>
              <span class="event-status" :class="event.status">{{
                event.status
              }}</span>
            </div>
            <div class="teams">
              <div class="team">
                <span class="team-name">{{ event.home }}</span>
                <span class="score" v-if="event.scores">{{
                  event.scores.home
                }}</span>
              </div>
              <div class="vs">VS</div>
              <div class="team">
                <span class="team-name">{{ event.away }}</span>
                <span class="score" v-if="event.scores">{{
                  event.scores.away
                }}</span>
              </div>
            </div>
            <div class="event-footer">
              <span class="event-date">{{ formatDate(event.date) }}</span>
              <button class="view-odds-btn" @click="fetchOdds(event.id)">
                View Odds
              </button>
            </div>

            <!-- Odds Expansion -->
            <transition name="slide-fade">
              <div v-if="selectedEventId === event.id" class="odds-details">
                <LoadingAnimation v-if="loadingOdds" :size="30" />
                <div v-else-if="eventOdds" class="odds-list">
                  <div
                    v-for="(odds, bookmaker) in eventOdds.bookmakers"
                    :key="bookmaker"
                    class="bookmaker-row"
                  >
                    <span class="bookmaker-name">{{ bookmaker }}</span>
                    <div class="odds-values">
                      <div
                        v-for="(value, market) in odds"
                        :key="market"
                        class="market-odds"
                      >
                        <span class="market-label">{{ market }}</span>
                        <span class="odds-value">{{ value }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
        <div v-else class="no-events">
          <p>No active events found for this sport.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import LoadingAnimation from "@/components/LoadingAnimation.vue";

export default {
  name: "SportsView",
  components: {
    LoadingAnimation,
  },
  data() {
    return {
      sports: [],
      events: [],
      selectedSport: "football",
      selectedEventId: null,
      eventOdds: null,
      loadingEvents: false,
      loadingOdds: false,
      loadingSports: false,
    };
  },
  async mounted() {
    await this.fetchSports();
    await this.fetchEvents(this.selectedSport);
  },
  methods: {
    async fetchSports() {
      this.loadingSports = true;
      try {
        const response = await axios.get("/api/sports/sports");
        this.sports = response.data;
      } catch (error) {
        console.error("Failed to fetch sports", error);
      } finally {
        this.loadingSports = false;
      }
    },
    async fetchEvents(sport) {
      this.loadingEvents = true;
      try {
        const response = await axios.get(`/api/sports/events/${sport}`);
        this.events = response.data;
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        this.loadingEvents = false;
      }
    },
    async selectSport(sport) {
      this.selectedSport = sport;
      this.selectedEventId = null;
      await this.fetchEvents(sport);
    },
    async fetchOdds(eventId) {
      if (this.selectedEventId === eventId) {
        this.selectedEventId = null;
        return;
      }
      this.selectedEventId = eventId;
      this.loadingOdds = true;
      try {
        const response = await axios.get(`/api/sports/odds/${eventId}`);
        this.eventOdds = response.data;
      } catch (error) {
        console.error("Failed to fetch odds", error);
      } finally {
        this.loadingOdds = false;
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.sports-container {
  min-height: 100vh;
  color: #eeeeee;
  background: #0b0f19;

  .top-banner {
    height: 150px;
    background: linear-gradient(135deg, #1b2845 0%, #274060 100%);
    display: flex;
    align-items: center;
    padding: 0 40px;
    margin-bottom: 20px;

    .banner-content {
      h1 {
        font-size: 2.5rem;
        margin: 0;
        background: linear-gradient(90deg, #00c6ff, #0072ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      p {
        margin: 5px 0 0;
        color: #9ba0b4;
        font-size: 1.1rem;
      }
    }
  }

  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .sports-nav {
    display: flex;
    overflow-x: auto;
    gap: 15px;
    padding-bottom: 15px;
    scrollbar-width: thin;

    &::-webkit-scrollbar {
      height: 4px;
    }

    .sport-item {
      padding: 10px 20px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.3s ease;
      border: 1px solid transparent;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      &.active {
        background: linear-gradient(90deg, #00c6ff, #0072ff);
        color: white;
        border-color: rgba(255, 255, 255, 0.2);
      }
    }
  }

  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
  }

  .event-card {
    background: rgba(25, 28, 38, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      border-color: rgba(0, 198, 255, 0.3);
    }

    .event-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      font-size: 0.9rem;

      .league-name {
        color: #9ba0b4;
      }

      .event-status {
        text-transform: uppercase;
        font-weight: 700;
        font-size: 0.75rem;
        padding: 2px 8px;
        border-radius: 4px;

        &.live {
          color: #ff4b2b;
          background: rgba(255, 75, 43, 0.1);
        }
        &.pending {
          color: #f9d423;
          background: rgba(249, 212, 35, 0.1);
        }
      }
    }

    .teams {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      .team {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;

        .team-name {
          font-weight: 700;
          text-align: center;
        }
        .score {
          font-size: 1.5rem;
          color: #00c6ff;
        }
      }

      .vs {
        padding: 0 15px;
        color: #564f80;
        font-weight: 900;
      }
    }

    .event-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .event-date {
        color: #9ba0b4;
        font-size: 0.85rem;
      }

      .view-odds-btn {
        background: #19202e;
        border: 1px solid #3b3a65;
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: #3b3a65;
        }
      }
    }
  }

  .odds-details {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);

    .bookmaker-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);

      &:last-child {
        border-bottom: none;
      }

      .bookmaker-name {
        font-weight: 600;
        font-size: 0.9rem;
      }

      .odds-values {
        display: flex;
        gap: 10px;

        .market-odds {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          padding: 5px 10px;
          border-radius: 6px;
          min-width: 50px;

          .market-label {
            font-size: 0.7rem;
            color: #9ba0b4;
            text-transform: uppercase;
          }
          .odds-value {
            font-weight: 700;
            color: #00c6ff;
          }
        }
      }
    }
  }

  .no-events {
    text-align: center;
    padding: 50px;
    color: #9ba0b4;
  }
}

/* Animations */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
