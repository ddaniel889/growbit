<template>
  <div class="app-loader" :class="{ absolute: !fullScreen }">
    <div class="central-container">
      <img src="/img/betsweeps.png" alt="betsweeps Loader" />
      <div class="loader-line"></div>
    </div>
  </div>
</template>

<script>
export default {//
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
  width: 100%;
}

.app-loader .central-container img {
  /* Altura base aumentada para compensar el espacio transparente del asset */
  height: 280px; 
  width: auto;
  filter: drop-shadow(0 0 25px rgba(204, 33, 49, 0.4));
  animation: pulse 2s ease-in-out infinite;
  max-width: 90vw;
  object-fit: contain;

  /* Aplicamos un escalado base para que el logo real sea imponente */
  transform: scale(1.5);
  
  /* Margen negativo inferior para que la barra de carga no quede muy lejos 
     debido al aire transparente de la imagen */
  margin-bottom: -40px; 

  @media screen and (max-width: 991px) {
    height: 220px;
    margin-bottom: -30px;
  }

  @media screen and (max-width: 480px) {
    height: 180px;
    margin-bottom: -20px;
  }

  @media screen and (max-width: 360px) {
    height: 140px;
    margin-bottom: -10px;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1.5);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.55);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0.9;
  }
}

.loader-line {
  width: 80%;
  max-width: 250px;
  height: 4px;
  position: relative;
  overflow: hidden;
  background-color: rgba(204, 33, 49, 0.1);
  margin: 0 auto;
  border-radius: 20px;
  z-index: 2;
}

.loader-line:before {
  content: "";
  position: absolute;
  left: -50%;
  height: 4px;
  width: 40%;
  background-color: #cc2131;
  box-shadow: 0 0 10px rgba(204, 33, 49, 0.5);
  animation: lineAnim 1.5s ease-in-out infinite;
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