<template>
  <div class="slide-game">
    <transition name="fade" mode="out-in">
      <div
        v-if="
          slideData.game !== null &&
          ['created', 'pending', 'fairness'].includes(slideData.game.state) ===
            true
        "
        class="game-info"
        key="info"
      >
        <div v-if="slideData.game.state === 'fairness'" class="info-fairness">
          Waiting for eos block
          <span>#{{ slideData.game.fair.blockNum }}</span>
        </div>
        <div v-else class="info-countdown">
          Starting
          <div class="countdown-text">
            <span>{{ slideCountdownText.charAt(0) }}</span>
            <span>{{ slideCountdownText.charAt(1) }}</span>
            <span>.</span>
            <span>{{ slideCountdownText.charAt(2) }}</span>
            <span>{{ slideCountdownText.charAt(3) }}</span>
          </div>
        </div>
      </div>
      <div v-else class="game-selector" key="selector">
        <img src="@/assets/images/slide/indicator_top.png" />
        <img src="@/assets/images/slide/indicator_bottom.png" />
      </div>
    </transition>

    <div
      class="game-reel"
      :style="slideReelStyle"
      :class="{
        shadow:
          slideData.game !== null &&
          ['created', 'pending', 'fairness'].includes(slideData.game.state) ===
            true,
      }"
    >
      <div v-for="i in 8" :key="i" class="reel-row">
        <img src="../../../assets/images/slide/red_new.png" />
        <img src="../../../assets/images/slide/purple_new.png" />
        <img src="../../../assets/images/slide/red_new.png" />
        <img src="../../../assets/images/slide/purple_new.png" />
        <img src="../../../assets/images/slide/red_new.png" />
        <img src="../../../assets/images/slide/purple_new.png" />
        <img src="../../../assets/images/slide/red_new.png" />
        <img src="../../../assets/images/slide/yellow_new.png" />
        <img src="../../../assets/images/slide/purple_new.png" />
        <img src="../../../assets/images/slide/red_new.png" />
        <img src="../../../assets/images/slide/purple_new.png" />
        <img src="../../../assets/images/slide/red_new.png" />
        <img src="../../../assets/images/slide/purple_new.png" />
        <img src="../../../assets/images/slide/red_new.png" />
        <img src="../../../assets/images/slide/purple_new.png" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "SlideGame",
  data() {
    return {
      slideEndTimeout: null,
      slideCountdownRepeater: null,
      slideCountdownText: "0000",
      slideOrder: [2, 3, 4, 5, 6, 7, 8, 0, 9, 10, 11, 12, 13, 14, 1],
      slideReelStyle: {
        transform: "translate(0px, -50%)",
        transition: "none",
      },
    };
  },
  
  mounted() {
    if (this.slideData && this.slideData.game) {
      this.forceInitGamePosition(this.slideData.game);
    }
  },

  methods: {
    ...mapActions(["playSoundTick", "playSoundRoll", "playSoundWin"]),
    
    forceInitGamePosition(game) {
      if (!game) return;

      if (game.state === "created") {
        if (this.slideData && this.slideData.history && this.slideData.history.length > 0 && this.slideData.history[0]) {
          const index = this.slideOrder.indexOf(this.slideData.history[0].outcome);
          if (index !== -1) {
            this.slideReelStyle = {
              transform: "translate(" + (5575 - 125 * index) + "px, -50%)",
              transition: "none",
            };
          }
        } else {
          this.slideReelStyle = {
            transform: "translate(0px, -50%)",
            transition: "none",
          };
        }
        this.slideStartCountdown();
      } else if (game.state === "rolling") {
        this.slideRollReel(game.outcome);
      }
    },

    slideStartCountdown() {
      if (this.slideCountdownRepeater) {
        cancelAnimationFrame(this.slideCountdownRepeater);
      }

      if (!this.slideData || !this.slideData.game || !this.slideData.game.createdAt) {
        this.slideCountdownText = "0000";
        return;
      }

      const timeEnding = new Date(this.slideData.game.createdAt).getTime() + 1000 * 13;
      const timeLeft = Math.floor(
        (timeEnding - (new Date().getTime() + this.generalTimeDiff)) / 10
      );

      if (timeLeft <= 0) {
        this.slideCountdownText = "0000";
      } else {
        let formatted = String(timeLeft);
        while (formatted.length < 4) {
          formatted = "0" + formatted;
        }

        if (formatted.length > 4) {
          formatted = formatted.substring(formatted.length - 4);
        }

        this.slideCountdownText = formatted;
        this.slideCountdownRepeater = requestAnimationFrame(this.slideStartCountdown);
      }
    },

    slideRollReel(outcome) {
      const index = this.slideOrder.indexOf(outcome);
      if (index === -1) return;

      cancelAnimationFrame(this.slideCountdownRepeater);
      this.slideCountdownText = "0000";

      // Usamos el getter real nativo de la app para verificar silencio
      if (!this.soundMuted) {
        this.playSoundRoll(); 
      }

      this.slideReelStyle = {
        transform: "translate(" + (1075 - 125 * index) + "px, -50%)",
        transition: "transform 5500ms cubic-bezier(0.12, 0.8, 0.32, 1)",
      };

      this.slideEndTimeout = setTimeout(() => {
        if (!this.soundMuted) {
          this.playSoundWin(); 
        }
      }, 5500);
    }
  },
  computed: {
    ...mapGetters([
      "soundVolume",
      "soundMuted",
      "generalTimeDiff",
      "slideData",
      "testData",
    ]),
  },
  watch: {
    "slideData.game": {
      immediate: true,
      handler(data) {
        if (!data) return;
        this.forceInitGamePosition(data);
      },
      deep: true,
    },
  },
  beforeDestroy() {
    clearTimeout(this.slideEndTimeout);
    cancelAnimationFrame(this.slideCountdownRepeater);
  },
};
</script>

<style scoped>
.slide-game {
  width: 100%;
  height: 150px;
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  overflow: hidden;
}
.slide-game .game-info {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  border-radius: 18px;
  z-index: 5;
}
.slide-game .game-info.fade-enter-active,
.slide-game .game-info.fade-leave-active {
  transition: opacity 0.3s;
}
.slide-game .game-info.fade-enter-from,
.slide-game .game-info.fade-leave-to {
  opacity: 0;
}
.slide-game .info-text {
  font-size: 13px;
  font-weight: 500;
}
.slide-game .info-fairness {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
}
.slide-game .info-countdown {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
}
.slide-game .info-fairness span {
  margin-top: 3px;
  font-size: 1.571rem;
  color: var(--green);
}
.slide-game .countdown-text {
  display: flex;
  align-items: center;
  margin-top: 3px;
}
.slide-game .countdown-text span {
  width: 13px;
  text-align: center;
  font-size: 1.571rem;
  color: var(--green);
}
.slide-game .countdown-text span:nth-child(3) {
  width: auto;
}
.slide-game .game-selector {
  width: 6px;
  height: 100%;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 5;
}
.slide-game .game-selector > img {
  position: absolute;
  left: -14px;
}
.slide-game .game-selector > img:first-of-type {
  top: 0;
}
.slide-game .game-selector > img:last-of-type {
  bottom: 0;
}
.slide-game .game-selector:before {
  top: 0;
}
.slide-game .game-selector:after {
  bottom: 0;
}
.slide-game .game-reel {
  position: absolute;
  top: 50%;
  display: flex;
  align-items: center;
}
.slide-game .game-reel.shadow {
  img {
    opacity: 0.3;
  }
}
.slide-game .reel-row {
  display: flex;
  align-items: center;
}
.slide-game .reel-row img {
  width: 100px;
  height: 128px;
  margin-right: 25px;
}
</style>