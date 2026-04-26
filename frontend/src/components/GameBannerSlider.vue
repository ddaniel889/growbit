<template>
  <div class="slider-container" @mouseenter="pause" @mouseleave="resume">
    <div class="slider-wrapper" :style="wrapperStyle">
      <div
        v-for="(banner, index) in banners"
        :key="index"
        class="slide-item"
        :style="itemStyle"
      >
        <div class="slide-content" @click="goToGame(banner.url)">
          <img :src="banner.img" alt="Game Banner" />
        </div>
      </div>
    </div>

    <div class="dots" v-if="totalPages > 1">
      <span
        v-for="n in totalPages"
        :key="n"
        :class="{ active: currentPage === n - 1 }"
        @click="setCurrentPage(n - 1)"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "GameBannerSlider",
  data() {
    return {
      banners: [
        {
          img: "/img/banners/PenaltyShootOut_PragmaticPlay.png",
          url: "/game/evoplay:PenaltyShootOut",
        },
        {
          img: "/img/banners/GoldenChicken_SpadeGaming.png",
          url: "/game/spadegaming:GoldenChicken",
        },
        {
          img: "/img/banners/RocketBlastMegaways _PragmaticPlay.png",
          url: "/game/pragmaticexternal:RocketBlastMegaways",
        },
        {
          img: "/img/banners/GateofOlympus_PragmaticPlay.png",
          url: "/game/pragmaticexternal:GatesOfOlympus1",
        },
        {
          img: "/img/banners/SugarSupreme_PragmaticPlay.png",
          url: "/game/pragmaticexternal:SugarSupremePowernudge",
        },
        {
          img: "/img/banners/BigBassCrash_PragmaticPlay.png",
          url: "/game/pragmaticexternal:BigBassCrash",
        },
        {
          img: "/img/banners/Spaceman_PragmaticPlay.png",
          url: "/game/pragmaticexternal:Spaceman",
        },
        {
          img: "/img/banners/BuffaloKing_PragmaticPlay.png",
          url: "/game/pragmaticexternal:BuffaloKing",
        },
        {
          img: "/img/banners/Baccarat_PragmaticLive.png",
          url: "/game/pragmaticexternal:Super8Baccarat",
        },
        {
          img: "/img/banners/BigBass_PragmaticPlay.png",
          url: "/game/pragmaticexternal:BigBassChristmasBash",
        },
        {
          img: "/img/banners/FuryofOdin_PragmaticPlay.png",
          url: "/game/pragmaticexternal:FuryofOdinMegaways",
        },
        {
          img: "/img/banners/GrayhoundRacing_GoldenRace.png",
          url: "/game/infin:Dog6",
        },
        {
          img: "/img/banners/Keno_TvBet.png",
          url: "/game/infin:tvbet_keno",
        },
      ],
      currentIndex: 0,
      windowWidth: window.innerWidth,
      autoPlayInterval: null,
    };
  },
  computed: {
    itemsPerView() {
      if (this.windowWidth >= 1600) return 6;
      if (this.windowWidth >= 1200) return 5;
      if (this.windowWidth >= 992) return 4;
      if (this.windowWidth >= 600) return 3;
      return 2;
    },
    itemWidthPercent() {
      return 100 / this.itemsPerView;
    },
    totalPages() {
      return Math.ceil(this.banners.length / this.itemsPerView);
    },
    currentPage() {
      return Math.floor(this.currentIndex / this.itemsPerView);
    },
    wrapperStyle() {
      return {
        transform: `translateX(-${this.currentIndex * this.itemWidthPercent}%)`,
        width: "100%", // Logic fix: container is 100%, wrapper translates within it.
        // Wait, native flex carousel logic:
        // Container Overflow Hidden.
        // Wrapper Flex.
        // If wrapper width is 100%, items are flex-shrinked.
        // So actually wrapper width doesn't need to be set or can be 100%.
        // The translateX moves items to the left.
      };
    },
    itemStyle() {
      return {
        width: `${this.itemWidthPercent}%`,
        flex: `0 0 ${this.itemWidthPercent}%`,
      };
    },
  },
  methods: {
    resize() {
      this.windowWidth = window.innerWidth;
    },
    next() {
      // Increment index
      if (this.currentIndex + this.itemsPerView < this.banners.length) {
        this.currentIndex += 1;
      } else {
        this.currentIndex = 0; // Loop back
      }
    },
    pause() {
      if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
    },
    resume() {
      this.pause();
      this.autoPlayInterval = setInterval(this.next, 3000);
    },
    setCurrentPage(pageIndex) {
      this.currentIndex = pageIndex * this.itemsPerView;
      // Ensure we don't go out of bounds?
      if (this.currentIndex >= this.banners.length) {
        this.currentIndex = 0;
      }
    },
    goToGame(url) {
      this.$router.push(url);
    },
  },
  mounted() {
    window.addEventListener("resize", this.resize);
    this.resume();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
    this.pause();
  },
};
</script>

<style scoped lang="scss">
.slider-container {
  width: 100%;
  overflow: hidden;
  position: relative;
  margin-bottom: 30px;
  padding-bottom: 20px;
}

.slider-wrapper {
  display: flex;
  transition: transform 0.5s ease-in-out;
  width: 100%; /* Relative to parent */
}

/* Because wrapper width is 100%, and we want to slide items.
   Actually if wrapper is 100%, items are shrunk.
   Standard carousel: Wrapper contains ALL items in a row.
   So Wrapper Width should be ample? 
   Or simply: Wrapper display flex. Items flex-shrink 0.
   Translate moves the wrapper.
*/
.slider-wrapper {
  width: 100%;
  display: flex;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-item {
  padding: 0 6px; /* spaceBetween increased for professional look */
  box-sizing: border-box;
}

.slide-content {
  cursor: pointer;
  border-radius: 8px; /* Slightly tighter radius */
  overflow: hidden;
  position: relative;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }

  img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
    aspect-ratio: 443/196;
    border-radius: 8px;
  }
}

.dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 15px;

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    cursor: pointer;
    transition: all 0.3s;

    &.active {
      background: #00bae6;
      width: 20px;
      border-radius: 4px;
    }
  }
}
</style>
