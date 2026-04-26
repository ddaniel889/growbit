<template>
  <form class="login-credientials" @submit.prevent="loginAction()">
    <div class="input-group">
      <div class="input-wrapper">
        <div class="icon-slot">
          <User />
        </div>
        <input
          v-model="loginEmail"
          type="text"
          placeholder="Email or Username"
          required
        />
      </div>
    </div>

    <div class="input-group">
      <div class="input-wrapper">
        <div class="icon-slot">
          <Lock />
        </div>
        <input
          required
          v-model="loginPassword"
          :type="showPass ? 'text' : 'password'"
          placeholder="Password"
        />
        <div class="eye-slot">
          <component
            :is="showPass ? 'Eye' : 'EyeOff'"
            @click="showPass = !showPass"
          />
        </div>
      </div>
    </div>

    <div class="content-buttons">
      <button class="btn-continue" type="submit">
        Log In <span class="btn-arrow"><ArrowRight :size="16" /></span>
      </button>
    </div>
  </form>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AppButton from "@/components/AppButton.vue";
import { User, Lock, Eye, EyeOff, ArrowRight } from "lucide-vue";

export default {
  name: "Login",
  components: { AppButton, User, Lock, Eye, EyeOff, ArrowRight },
  props: ["tab"],
  data() {
    return {
      loginEmail: null,
      loginPassword: null,
      showPass: false,
    };
  },
  methods: {
    ...mapActions([
      "modalsSetShow",
      "modalsSetData",
      "notificationShow",
      "authSendCredentialsLogin",
      "authSendCredentialsRegister",
    ]),
    loginAction() {
      if (this.loginEmail === null || this.loginEmail.trim() === "") {
        this.notificationShow({
          type: "error",
          message: "Your entered email is invalid.",
        });
        return;
      }

      if (this.loginPassword === null || this.loginPassword.trim() === "") {
        this.notificationShow({
          type: "error",
          message: "Your entered password is invalid.",
        });
        return;
      }

      const data = { email: this.loginEmail, password: this.loginPassword };
      this.authSendCredentialsLogin(data);
    },
    loginTermsButton() {
      this.modalsSetShow(null);
      setTimeout(() => {
        this.modalsSetShow("Terms");
      }, 300);
    },
  },
  computed: {
    ...mapGetters(["authSendLoginLoading"]),
  },
};
</script>

<style scoped lang="scss">
.login-credientials {
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-grow: 1;
  align-items: center;
  gap: 15px;
  justify-content: center;
}

.input-group {
  width: 100%;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: #191c35;
  border: 1px solid #2e3259;
  border-radius: 8px;
  padding: 0 12px;
  height: 48px;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: #00c6ff;
  }

  .icon-slot {
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;

    svg {
      width: 18px;
      height: 18px;
      fill: #616498;
    }
  }

  input {
    background: transparent;
    border: none;
    color: #fff;
    height: 100%;
    width: 100%;
    outline: none;
    font-size: 0.95rem;
    padding: 0;

    &::placeholder {
      color: #616498;
    }
  }

  .eye-slot {
    cursor: pointer;
    svg {
      width: 18px;
      fill: #616498;
    }
  }
}

.content-buttons {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.btn-continue {
  width: 100%;
  height: 50px;
  background: linear-gradient(90deg, #00c6ff 0%, #0072ff 100%);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  .btn-arrow {
    font-size: 1.2rem;
  }
}
</style>
