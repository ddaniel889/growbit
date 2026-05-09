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

  padding: 0;

  /* Overlay gradient to ensure text readability */
  &::before {
   content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      rgba(30, 32, 74, 0.4) 0%, 
      rgba(13, 16, 38, 0.7) 100%
    );
    z-index: 1;
  }

  @media screen and (max-width: 991px) {
    display: none;
  }

  .banner-content {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    h2 {
      font-size: 1.1rem;
      margin-bottom: 20px;
      letter-spacing: 3px;
      color: #00c6ff;
      text-transform: uppercase;
      font-weight: 600;
    }

    .banner-logo {
    
      width: 100%;
      height: 100%;
      /* 'cover' hará que la imagen cubra todo el espacio sin deformarse, 
         'contain' hará que se vea completa ocupando el máximo posible */
      object-fit: contain; 
      padding: 20px; 
      filter: drop-shadow(0 0 20px rgba(0, 198, 255, 0.4));

      @media screen and (max-width: 1200px) {
        height: 60px;
      }
    }


    .logo-text {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 25px;
      background: linear-gradient(135deg, #ffffff 0%, #a5aabf 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }

    h3 {
      font-size: 1.6rem;
      font-weight: 700;
      line-height: 1.4;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
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
