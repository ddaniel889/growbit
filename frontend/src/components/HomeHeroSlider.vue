<template>
  <div class="slider-container" v-if="banners && banners.length > 0">
    <div class="slider-wrapper" :style="wrapperStyle">
      <div
        v-for="(banner, index) in banners"
        :key="banner._id || index"
        class="hero-card"
        :class="banner.imageClass"
        :style="{ background: banner.backgroundGradient, ...cardStyle }"
        @click="$router.push(banner.buttonUrl)"
      >
        <div class="card-content">
          <h2 class="title">{{ banner.title }}</h2>
          <p class="description">{{ banner.description }}</p>
          <div class="spacer"></div>
          <button class="action-btn">{{ banner.buttonText }}</button>
        </div>
        <img :src="banner.imageUrl" :class="['card-img', banner.imageClass]" />
      </div>
    </div>

    <!-- DOTS IF MANY -->
    <div class="dots" v-if="banners.length > itemsPerView">
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
  name: "HomeHeroSlider",
  props: {
    banners: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentIndex: 0,
      windowWidth: window.innerWidth,
    };
  },
  computed: {
    itemsPerView() {
      if (this.windowWidth > 1200) return 3;
      if (this.windowWidth > 900) return 2;
      return 1;
    },
    totalPages() {
      return Math.ceil(this.banners.length / this.itemsPerView);
    },
    currentPage() {
      return Math.floor(this.currentIndex / this.itemsPerView);
    },
    wrapperStyle() {
      const translate = (this.currentIndex * 100) / this.itemsPerView;
      return {
        transform: `translateX(-${translate}%)`,
      };
    },
    cardStyle() {
      // Use fixed width for desktop to create the peeking effect from the screenshot
      const isDesktop = this.windowWidth > 991;
      return {
        flex: isDesktop ? "0 0 375px" : "0 0 calc(90vw - 20px)",
        marginRight: "15px",
      };
    },
  },
  methods: {
    resize() {
      this.windowWidth = window.innerWidth;
    },
    setCurrentPage(pageIndex) {
      this.currentIndex = pageIndex * this.itemsPerView;
      if (this.currentIndex > this.banners.length - this.itemsPerView) {
        this.currentIndex = Math.max(
          0,
          this.banners.length - this.itemsPerView,
        );
      }
    },
  },
  mounted() {
    window.addEventListener("resize", this.resize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  },
};
</script>

<style scoped lang="scss">
@use "/src/assets/sass/mixins" as m;

.slider-container {
  width: 100%;
  overflow: hidden;
  position: relative;
  margin-bottom: 30px;
}

.slider-wrapper {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  width: 100%;
}

.hero-card {
  height: 220px;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  display: flex;
  padding: 20px 25px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  }

  .card-content {
    z-index: 2;
    position: relative;
    width: 60%;
    display: flex;
    flex-direction: column;
    height: 100%;

    .title {
      font-size: 24px;
      font-weight: 800;
      color: white;
      margin-top: 5px;
      margin-bottom: 8px;
      line-height: 1.1;
      letter-spacing: -0.2px;
    }

    .description {
      font-size: 15px;
      color: white;
      line-height: 1.3;
      font-weight: 600;
      opacity: 0.95;
    }

    .spacer {
      flex-grow: 1;
    }

    .action-btn {
      width: fit-content;
      background: #0d122b;
      color: white;
      border: none;
      padding: 10px 18px;
      border-radius: 5px;
      font-weight: 800;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
      margin-bottom: 5px;
      transition: background 0.2s;

      &:hover {
        background: lighten(#0d122b, 5%);
      }
    }
  }

  .card-img {
    position: absolute;
    right: 0;
    bottom: 0;
    height: 100%;
    object-fit: contain;
    z-index: 1;
    pointer-events: none;

    &.wizard {
      right: -25px;
      bottom: -15px;
      height: 115%;
      transform: scaleX(-1); // Mirroring if needed, but in image it faces left
    }

    &.plane {
      right: 5px;
      bottom: 10px;
      height: 85%;
    }

    &.vip {
      right: -10px;
      bottom: -10px;
      height: 105%;
    }
  }

  @media screen and (max-width: 1200px) {
    padding: 15px 20px;
    .card-content .title {
      font-size: 20px;
    }
  }

  @media screen and (max-width: 600px) {
    height: 190px;
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
      background: #5b46bc;
      width: 20px;
      border-radius: 4px;
    }
  }
}
</style>
