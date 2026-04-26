<template>
  <div class="app-loader" :class="{ absolute: !fullScreen }">
    <div class="central-container">
      <img src="/img/preloader-logo.svg" alt="99wiwi Loader" />
      <div class="loader-line"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppLoader",
  props: {
    fullScreen: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style scoped>
.app-loader {
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  z-index: 100;
  opacity: 1;
  background: var(--dark-blue-2);
}

.app-loader.absolute {
  position: absolute;
  z-index: 5;
}

.app-loader .central-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
  img {
    height: 80px;
    filter: drop-shadow(0 0 15px rgba(204, 33, 49, 0.2));
    animation: pulse 2s ease-in-out infinite;
    max-width: 80vw;
    object-fit: contain;

    @media screen and (max-width: 991px) {
      height: 60px;
    }

    @media screen and (max-width: 480px) {
      height: 50px;
    }

    @media screen and (max-width: 360px) {
      height: 40px;
    }

  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.02);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
}

.loader-line {
  width: 90%;
  max-width: 300px;
  height: 3px;
  position: relative;
  overflow: hidden;
  background-color: rgba(204, 33, 49, 0.1);
  margin: 30px auto;
  @media screen and (max-width: 991px) {
    margin: 20px auto;
  }
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;
}

.loader-line:before {
  content: "";
  position: absolute;
  left: -50%;
  height: 3px;
  width: 40%;
  background-color: #cc2131;
  box-shadow: 0 0 10px rgba(204, 33, 49, 0.5);
  -webkit-animation: lineAnim 1.5s ease-in-out infinite;
  -moz-animation: lineAnim 1.5s ease-in-out infinite;
  animation: lineAnim 1.5s ease-in-out infinite;
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;
}

@keyframes lineAnim {
  0% {
    left: -40%;
    width: 20%;
  }
  50% {
    left: 40%;
    width: 60%;
  }
  100% {
    left: 100%;
    width: 20%;
  }
}
</style>
