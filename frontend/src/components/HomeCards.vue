<template>
  <div class="cards-grid">
    <div
      v-for="(card, index) in cards"
      :key="index"
      class="card-wrapper"
      @click="handleCardClick(card)"
    >
      <div class="card-bg">
        <div class="description">
          {{ card.description }}
        </div>
      </div>
      <div class="card-image">
        <img :src="card.imgBackGround" :alt="card.action" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeCards",
  data() {
    return {
      cards: [
        {
          imgBackGround: "/img/page/casino.png",
          description:
            "Discover our diverse casino games for an exciting adventure.",
          action: "casino",
          href: "/casino", // Internal route
          isExternal: false,
        },
        {
          imgBackGround: "/img/page/slots.png",
          description:
            "Improve your odds with live slots and real time dealing.",
          action: "slots",
          href: "/original-games",
          isExternal: false,
        },
        {
          imgBackGround: "/img/page/racing.png",
          description:
            "Experience the thrill of horse, greyhound racing and enjoy winnings.",
          action: "racing",
          href: "/leaderboard",
          isExternal: false,
        },
        {
          imgBackGround: "/img/page/bitup.png",
          description:
            "Secure victory in the competition by delivering a real-time Bitcoin chart.",
          action: "bitup",
          href: "https://bitup.game/trade",
          isExternal: true,
        },
      ],
    };
  },
  methods: {
    handleCardClick(card) {
      if (card.isExternal) {
        window.open(card.href, "_blank");
      } else {
        this.$router.push(card.href);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  width: 100%;
  margin-top: 50px; /* More space for popping images */
  margin-bottom: 40px;
  padding: 0 10px;

  /* HIDE SECTION 2 ON MOBILE VIEW */
  @media (max-width: 900px) {
    display: none;
  }

  @media (min-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.card-wrapper {
  position: relative;
  height: 180px; /* Total visual height area */
  cursor: pointer;
  /* overflow: visible !important; */
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);

    .card-bg {
      box-shadow: 0 0 20px rgba(0, 186, 230, 0.4);
      border-color: rgba(0, 186, 230, 0.6);
    }
  }
}

.card-bg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px; /* The bottom box height */
  background: linear-gradient(
    180deg,
    rgba(10, 30, 50, 0.85) 0%,
    rgba(5, 15, 25, 0.95) 100%
  );
  border: 1px solid rgba(0, 186, 230, 0.2);
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 186, 230, 0.1);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  z-index: 1;
  transition: all 0.3s ease;
}

.description {
  color: #cceeff;
  font-size: 13px;
  line-height: 1.4;
  text-align: center;
  font-weight: 500;
  margin-top: 10px; /* Slight push down if needed */
}

.card-image {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 160px; /* Large popping image */
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 2;
  /* The image sits 'above' the card-bg conceptually */
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 10px 10px rgba(0, 0, 0, 0.5));
  transition: transform 0.3s ease;
}

.card-wrapper:hover .card-image img {
  transform: scale(1.1) translateY(-5px);
}
</style>
