<template>
  <div class="hero-wrapper">
    <div class="hero-bg">
      <img src="/img/homepage-bg-15.png" alt="Hero Background" />
    </div>
    <div class="hero-content">
      <div class="text-group">
        <div class="signup-row">
          <span class="text-bright">Sign Up & </span>
          <span class="text-blue">Get Reward</span>
        </div>
        <div class="reward-row">
          <span class="text-upto">Up to </span>
          <span class="text-gradient">20,000 USD</span>
        </div>
      </div>
      <div class="btn-group">
        <button class="btn-signup" @click="$emit('play')">Sign Up Now</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeHero",
};
</script>

<style scoped lang="scss">
.hero-wrapper {
  position: relative;
  width: 100%;
  min-height: 170px;
  background-color: #0e172a;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 25px;
  cursor: default;

  @media (min-width: 640px) {
    min-height: 384px;
    margin-top: 0;
  }
}

.hero-bg {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;

    @media (min-width: 640px) {
      object-position: right center;
    }
  }
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  min-height: 170px; /* Match wrapper min-height */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 15px;

  @media (min-width: 640px) {
    min-height: 384px;
    padding-left: 40px;
  }
}

.text-group {
  margin-bottom: 15px;
  text-align: left;
}

.signup-row {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 5px;

  @media (min-width: 640px) {
    font-size: 20px;
  }

  .text-bright {
    color: white;
  }
  .text-blue {
    color: #38bdf8;
  }
}

.reward-row {
  font-weight: 600;
  font-size: 24px;
  line-height: 1.1;
  letter-spacing: -0.05em;
  margin-top: 0;

  @media (min-width: 640px) {
    font-size: 45px;
  }
  @media (min-width: 1024px) {
    font-size: 56px;
  }

  .text-upto {
    color: white;
    font-weight: 700;
  }

  .text-gradient {
    font-weight: 700;
    background: linear-gradient(90deg, #b5e916 22.99%, #43c111 73.57%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }
}

.btn-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-signup {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 12px;
  border: none;
  cursor: pointer;

  /* Mobile Style: graident-btn-sign (Teal to Green) */
  background: linear-gradient(3deg, #005063 2.44%, #58af10 98.26%);
  box-shadow: inset 0px 1px 2px 0px #7ce6ff;

  padding: 9px 20px;
  font-size: 12px;
  font-weight: 600;

  @media (min-width: 640px) {
    /* Desktop Style: gradient-btn-play (Transparent to Blue) */
    background: linear-gradient(
      180deg,
      rgba(0, 99, 122, 0) -4.88%,
      #00bae6 99.99%
    );
    padding: 14px 23px;
    font-size: 16px;
  }

  &:hover {
    opacity: 0.9;
  }
}

.or-text {
  font-size: 12px;
  color: white;

  @media (min-width: 640px) {
    font-size: 16px;
  }
}
</style>
