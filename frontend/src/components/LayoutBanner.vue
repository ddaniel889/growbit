<template>
  <div class="layout-banner">
    <div class="banner-wrapper">
      <img src="/img/bannersc.png" alt="No Purchase Necessary" />
    </div>
  </div>
</template>

<script>
export default {
  name: "LayoutBanner"
};
</script>

<style lang="scss" scoped>
.layout-banner {
  width: 100%;
  // Usamos el mismo padding lateral que el footer para que en móvil no toque los bordes
  padding: 0 20px; 
  margin-top: 20px;
  margin-bottom: 20px;

  .banner-wrapper {
    // ESTA ES LA CLAVE: Usar el mismo max-width que el footer
    max-width: 1100px;
    margin-inline: auto; // Centra el contenedor
    width: 100%;

    img {
      width: 100%;      // Obliga a la imagen a ocupar todo el ancho del wrapper
      height: auto;     // Mantiene la proporción
      display: block;
      border-radius: 12px; // Bordes redondeados para que coincida con el estilo de la web
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); // Opcional: un poco de sombra para profundidad
    }
  }
}

// Ajuste para móviles
@media screen and (max-width: 991px) {
  .layout-banner {
    padding: 0 15px;
    margin-top: 10px;
  }
}
</style>
