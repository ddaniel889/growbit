<template>
  <div class="modal-login">
    <div class="left-banner">
     <div class="banner-content">
        <!-- Solo dejamos la imagen del logo -->
        <img src="/img/preloader-logo.png" alt="Logo" class="banner-logo" />
      </div>
    </div>
    <div class="right-content">
      <div class="top">
        <div class="close" @click="modalsSetShow(null)">
          <img :src="CloseIcon" alt="Close" />
        </div>
      </div>

      <div class="login-content">
        <div class="auth-tabs">
          <div
            class="tab"
            :class="{ active: modalTab === 'login' }"
            @click="modalSetTab('login')"
          >
            Sign In
          </div>
          <div
            class="tab"
            :class="{ active: modalTab === 'register' }"
            @click="modalSetTab('register')"
          >
            Sign Up
          </div>
        </div>

        <Login v-if="modalTab === 'login'" v-bind:tab="modalTab" />
        <Register v-else-if="modalTab === 'register'" v-bind:tab="modalTab" />
        <LoginForgot v-else-if="modalTab === 'forgot'" v-bind:tab="modalTab" />
      </div>

      <div class="already" v-if="modalTab !== 'forgot'">
        <div
          v-if="modalTab === 'login'"
          class="forgot"
          @click="modalSetTab('forgot')"
        >
          Forgot your password?
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Login from "@/components/auth/Login.vue";
import Register from "@/components/auth/Register.vue";
import LoginForgot from "@/components/auth/LoginForgot";
import AppButton from "@/components/AppButton.vue";
import CloseIcon from "@/assets/images/close.svg";

export default {
  name: "ModalLogin",
  components: {
    AppButton,
    Login,
    Register,
    LoginForgot,
  },
  data() {
    return {
      modalTab: "login",
      CloseIcon,
    };
  },
  computed: {
    ...mapGetters(["modalsData"]),
  },
  created() {
    if (this.modalsData?.authType === "register") {
      this.modalsSetData({ authType: null, code: this.modalsData?.code });
      this.modalSetTab("register");
    }
  },
  methods: {
    ...mapActions(["modalsSetShow", "modalsSetData"]),
    modalSetTab(tab) {
      this.modalTab = tab;
    },
  },
};
</script>

<style scoped lang="scss">
.modal-login {
  width: 800px;
  min-height: 500px; /* Reduced slightly to fit better on smaller desktop screens */
  background: var(--dark-blue);
  border-radius: 16px;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
  border: 1px solid #2e3259;

  @media screen and (max-width: 991px) {
    width: 100%;
    max-width: 500px; /* Limit width on mobile/tablet for better look */
    flex-direction: column;
    min-height: auto;
    margin: 0 auto;
  }
}

.left-banner {
  width: 40%;
  background: url("/img/login_bg.jpg") no-repeat center center;
  background-size: cover;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0; // Eliminamos cualquier espacio interno que empuje la imagen
  
  /* Importante: Mantiene el recorte de las esquinas si el modal es redondeado */
  overflow: hidden; 

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    /* Gradiente sutil para integrar la imagen con el fondo oscuro del sitio */
    background: linear-gradient(
      180deg,
      rgba(30, 32, 74, 0.4) 0%, 
      rgba(13, 16, 38, 0.7) 100%
    );
    z-index: 1;
  }

  @media screen and (max-width: 991px) {
    display: none; // Oculta el banner en dispositivos móviles para ahorrar espacio
  }

  .banner-content {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: block; // Cambiado a block para que la imagen sea el contenedor principal

    .banner-logo {
      width: 100%;
      height: 100%;
      /* 'cover' asegura que la imagen se expanda y llene todo el recuadro izquierdo */
      object-fit: cover; 
      margin: 0;
      padding: 0; // Quitamos el padding previo que causaba el marco vacío
      filter: drop-shadow(0 0 20px rgba(0, 198, 255, 0.4));
      
      /* Eliminamos cualquier restricción de altura previa en media queries */
    }
  }
}

.right-content {
  width: 60%;
  background: #0f1226;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-bottom: 30px;

  @media screen and (max-width: 991px) {
    width: 100%;
    background: #14172e; /* Slightly lighter on mobile to stand out from page bg */
  }
}

.top {
  display: flex;
  justify-content: flex-end;
  padding: 20px;

  .close {
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s;
    &:hover {
      opacity: 1;
    }
    img {
      width: 24px;
      height: 24px;
    }
  }
}

.login-content {
  padding: 0 40px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 500px) {
    padding: 0 20px;
  }
}

.auth-tabs {
  display: flex;
  margin-bottom: 30px;
  border-bottom: 2px solid #22244a;

  .tab {
    flex: 1;
    text-align: center;
    padding: 12px 10px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    color: #616498;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: all 0.2s;

    &.active {
      color: #fff;
      border-bottom-color: #00c6ff;
    }

    &:hover:not(.active) {
      color: #8a8cae;
    }
  }
}

.already {
  text-align: center;
  margin-top: 20px;

  .forgot {
    color: #616498;
    cursor: pointer;
    font-size: 0.95rem;
    transition: color 0.2s;
    &:hover {
      color: #fff;
    }
  }
}
</style>
