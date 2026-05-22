<template>
  <div class="current-games-container">
    <div class="header">
      <div class="title-section">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="title-icon"
        >
          <path
            fill-rule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="title">CURRENT GAMES</span>
      </div>

      <div class="controls">
        <div class="nav-btn left" @click="scrollLeft">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </div>
        <div class="nav-btn right" @click="scrollRight">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
        <router-link to="/games" class="see-all">See all</router-link>
      </div>
    </div>

    <div class="games-slider" ref="slider">
      <div
        class="game-card"
        v-for="game in games"
        :key="game.id"
        @click="goToGame(game.link)"
      >
        <div class="game-image-wrapper">
          <img :src="game.image" :alt="game.name" />
        </div>
        <div class="game-info">
          <div class="game-header">
            <span class="game-name">{{ game.name }}</span>
            <div class="online-badge">
              <span class="dot"></span>
              {{ game.online }} ONLINE
            </div>
          </div>

          <div class="game-stats">
            <span class="stat-label">Hourly Drop</span>
            <div class="stat-value">
              {{ game.hourlyDrop }}
              <img src="/img/sc_icon.png" class="currency-icon" alt="DL" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CurrentGames",
  data() {
    return {
      games: [
        {
          id: "towers",
          name: "TOWERS",
          image: "/img/game/towers.png",
          online: "1,532",
          hourlyDrop: "217.32",
          link: "/towers",
        },
        {
          id: "roulette",
          name: "ROULETTE",
          image: "/img/game/roulette.png",
          online: "1,253",
          hourlyDrop: "117.23",
          link: "/casino/roulette",
        },
        {
          id: "crash",
          name: "CRASH",
          image: "/img/game/crash.png",
          online: "812",
          hourlyDrop: "812.12",
          link: "/crash",
        },
        {
          id: "mines",
          name: "MINES",
          image: "/img/game/mines.png",
          online: "2,273",
          hourlyDrop: "517.32",
          link: "/mines",
        },
        {
          id: "plinko",
          name: "PLINKO",
          image: "/img/game/plinko.png",
          online: "1,982",
          hourlyDrop: "345.50",
          link: "/plinko",
        },
        {
          id: "dice",
          name: "DICE",
          image: "/img/game/dice.png",
          online: "984",
          hourlyDrop: "125.00",
          link: "/dice",
        },
      ],
    };
  },
  methods: {
    scrollLeft() {
      this.$refs.slider.scrollBy({ left: -300, behavior: "smooth" });
    },
    scrollRight() {
      this.$refs.slider.scrollBy({ left: 300, behavior: "smooth" });
    },
    goToGame(link) {
      this.$router.push(link);
    },
  },
};
</script>

<style scoped lang="scss">
.current-games-container {
  width: 100%;
  margin-bottom: 40px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 10px;

  .title-icon {
    width: 24px;
    height: 24px;
    color: #8b92b0;
  }

  .title {
    font-size: 1.2rem;
    font-weight: 800;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #191b30;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b92b0;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #252846;
    color: #fff;
  }

  svg {
    width: 18px;
    height: 18px;
  }
}

.see-all {
  padding: 8px 16px;
  background: #191b30;
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background 0.2s;
  height: 36px;
  display: flex;
  align-items: center;

  &:hover {
    background: #252846;
  }
}

.games-slider {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding-bottom: 10px; /* Space for scrollbar if any, though we hide it usually */
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.game-card {
  flex: 0 0 280px; /* Fixed width for cards */
  height: 110px;
  background: #161829;
  border-radius: 12px;
  display: flex;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    transform: translateY(-2px);
    background: #1e2034;
    border-color: rgba(255, 255, 255, 0.1);
  }
}

.game-image-wrapper {
  width: 100px;
  height: 100%;
  background: #0b0d19;
  position: relative;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.game-info {
  flex-grow: 1;
  padding: 12px 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.game-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.game-name {
  font-size: 1rem;
  font-weight: 800;
  color: #fff;
  text-transform: uppercase;
}

.online-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(39, 174, 96, 0.15);
  color: #27ae60;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  width: fit-content;

  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #27ae60;
  }
}

.game-stats {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 2px;
}

.stat-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 5px;

  .currency-icon {
    width: 14px;
    height: 14px;
  }
}

@media (max-width: 600px) {
  .game-card {
    flex: 0 0 260px;
  }

  .see-all {
    display: none;
  }
}
</style>
