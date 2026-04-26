<template>
  <div class="login-forgot">
    <div class="input-group">
      <div class="input-wrapper">
        <div class="icon-slot">
          <InboxIcon />
        </div>
        <input v-model="loginEmail" type="email" placeholder="Enter Email..." />
      </div>
    </div>

    <div class="content-buttons">
      <button
        class="btn-continue"
        @click="modalResetButton()"
        :disabled="authSendLoginLoading"
      >
        Reset <span class="btn-arrow"><ArrowRight :size="16" /></span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AppButton from "@/components/AppButton.vue";
import InboxIcon from "@/assets/images/inbox.svg?inline";
import { ArrowRight } from "lucide-vue";

export default {
  name: "LoginForgot",
  data() {
    return {
      loginEmail: null,
    };
  },
  components: {
    AppButton,
    InboxIcon,
    ArrowRight,
  },
  methods: {
    ...mapActions([
      "notificationShow",
      "modalsSetShow",
      "modalsSetData",
      "authSendCredentialsRequest",
    ]),
    modalResetButton() {
      if (this.loginEmail === null || this.loginEmail.trim() === "") {
        this.notificationShow({
          type: "error",
          message: "Your entered email is invalid.",
        });
        return;
      }

      const data = { type: "reset", email: this.loginEmail };
      this.authSendCredentialsRequest(data);
    },
  },
  computed: {
    ...mapGetters(["authSendLoginLoading"]),
  },
};
</script>

<style scoped lang="scss">
.login-forgot {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  flex-grow: 1;
  justify-content: center;
}

.input-group {
  width: 100%;
  margin-top: 20px;
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
}

.content-buttons {
  width: 100%;
  margin-top: 20px;
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #22244a;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  .btn-arrow {
    font-size: 1.2rem;
  }
}
</style>
