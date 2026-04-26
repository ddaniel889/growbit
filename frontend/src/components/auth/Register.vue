<template>
  <div class="registration">
    <!-- Email Registration Form -->
    <div v-if="method === 'email'" class="form-content">
      <div class="input-group">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="custom-input"
          required
        />
      </div>

      <div class="input-group">
        <input
          v-model="username"
          type="text"
          placeholder="Name"
          class="custom-input"
          required
        />
      </div>

      <div class="input-group">
        <div class="input-wrapper-pass">
          <input
            v-model="password"
            :type="showPass ? 'text' : 'password'"
            placeholder="Password"
            class="custom-input-pass"
            required
          />
          <component
            :is="showPass ? 'Eye' : 'EyeOff'"
            class="eye-icon"
            :size="18"
            @click="togglePasswordVisibility"
          />
        </div>
      </div>

      <div class="input-group">
        <div class="input-wrapper-pass">
          <input
            v-model="passwordCfm"
            :type="showPass ? 'text' : 'password'"
            placeholder="Repeat Password"
            class="custom-input-pass"
            required
          />
        </div>
      </div>

      <!-- Referral Code (Collapsible) -->
      <div class="referral-section">
        <div class="referral-toggle" @click="showReferral = !showReferral">
          <span>Enter Referral Code</span>
          <ChevronDown
            :size="14"
            :class="{ rotated: showReferral }"
            style="transition: transform 0.2s"
          />
        </div>
        <div class="input-group" v-if="showReferral">
          <input
            v-model="code"
            type="text"
            placeholder="Referral Code"
            class="custom-input"
          />
        </div>
      </div>

      <!-- Checkboxes -->
      <div class="checkbox-group">
        <label class="custom-checkbox">
          <input type="checkbox" v-model="termsAcceptedStep1" />
          <span class="checkmark"></span>
          <span class="label-text">
            I agree to the
            <a href="#" @click.prevent="proceedToTerms">User Agreement</a> &
            confirm I am at least 18 years old
          </span>
        </label>

        <label class="custom-checkbox">
          <input type="checkbox" v-model="marketingAccepted" />
          <span class="checkmark"></span>
          <span class="label-text">
            I agree to receive marketing promotions
          </span>
        </label>
      </div>

      <div class="content-buttons">
        <button class="btn-signup" @click="register" :disabled="!validStep1">
          <span />
          <span>Continue</span>
          <div class="arrow-box">
            <ArrowRight :size="16" />
          </div>
        </button>
      </div>
    </div>

    <!-- Phone Registration Form (Placeholder or Future Impl) -->
    <div v-if="method === 'phone'" class="form-content">
      <div class="phone-placeholder">Phone registration coming soon.</div>
    </div>

    <!-- Terms Modal (Overlay) -->
    <div v-if="step === 2" class="terms-overlay">
      <div class="terms-box">
        <div class="terms-header">
          <h1>User Agreement</h1>
        </div>
        <div class="terms-content">
          <LoadingAnimation v-if="loadingTos"></LoadingAnimation>
          {{ tos }}
        </div>
        <AppButton :click="() => (step = 1)" :height="'40px'">Back</AppButton>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AppButton from "@/components/AppButton.vue";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  ArrowRight,
} from "lucide-vue";
import axios from "axios";
import LoadingAnimation from "@/components/LoadingAnimation.vue";

export default {
  name: "Register",
  props: ["tab"],
  components: {
    LoadingAnimation,
    AppButton,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ChevronDown,
    ArrowRight,
  },
  data() {
    return {
      method: "email",
      step: 1,
      tos: "",
      USERNAME_REGEX: /^[a-zA-Z0-9]+$/,
      loadingTos: false,
      username: null,
      email: null,
      password: null,
      passwordCfm: null,
      code: null,
      showPass: false,
      showReferral: false,
      termsAcceptedStep1: false,
      marketingAccepted: true,
      disableRef: false,
    };
  },
  created() {
    let code = sessionStorage.getItem("code");
    if (code) {
      this.code = code;
      this.disableRef = true;
      this.showReferral = true;
    }

    axios
      .get("tos.txt", { baseURL: null })
      .then(({ data }) => {
        this.tos = data;
      })
      .catch(() => {
        this.tos = "Error loading terms.";
      });
  },
  methods: {
    ...mapActions(["notificationShow", "authSendCredentialsRegister"]),
    togglePasswordVisibility() {
      this.showPass = !this.showPass;
    },
    proceedToTerms() {
      this.step = 2;
    },
    register() {
      if (!this.validStep1) return;

      if (
        this.username === null ||
        this.username.trim() === "" ||
        !this.username.trim().match(this.USERNAME_REGEX)
      ) {
        this.notificationShow({
          type: "error",
          message: "Your entered name is invalid.",
        });
        return;
      }
      if (this.username.length < 3) {
        this.notificationShow({
          type: "error",
          message: "Your entered name should be at least 3 characters.",
        });
        return;
      }
      if (this.username.length > 20) {
        this.notificationShow({
          type: "error",
          message: "Your entered name cannot exceed 20 characters.",
        });
        return;
      }

      if (this.email === null || this.email.trim() === "") {
        this.notificationShow({
          type: "error",
          message: "Your entered email is invalid.",
        });
        return;
      }

      // Restore Gmail check
      const [local, domain] = this.email.trim().split("@");
      if (domain !== "gmail.com") {
        this.notificationShow({
          type: "error",
          message: "Email must be Gmail.",
        });
        return;
      }

      if (this.password === null || this.password.trim() === "") {
        this.notificationShow({
          type: "error",
          message: "Your entered password is invalid.",
        });
        return;
      }

      if (this.password.length <= 4) {
        this.notificationShow({
          type: "error",
          message: "Password must be at least 5 characters.",
        });
        return;
      }

      // Restore password confirmation check
      if (this.password !== this.passwordCfm) {
        this.notificationShow({
          type: "error",
          message: "Passwords do not match.",
        });
        return;
      }

      const data = {
        username: this.username,
        email: this.email,
        password: this.password,
        code: this.code,
      };
      this.authSendCredentialsRegister(data);
    },
  },
  computed: {
    ...mapGetters(["authSendLoginLoading", "modalsData"]),
    validStep1() {
      if (!this.termsAcceptedStep1) return false;
      if (!this.username || this.username.trim() === "") return false;
      if (!this.email || this.email.trim() === "") return false;
      if (!this.password || this.password.length <= 4) return false;
      if (this.password !== this.passwordCfm) return false;
      return true;
    },
  },
};
</script>

<style scoped lang="scss">
.registration {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
}

.sub-tabs {
  display: flex;
  margin-bottom: 20px;

  .sub-tab {
    flex: 1;
    text-align: center;
    padding-bottom: 10px;
    cursor: pointer;
    color: #616498;
    font-weight: 700;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    border-color: rgba(255, 255, 255, 0.05);

    &.active {
      color: #00bae6;
      border-bottom: 2px solid #00bae6;
      background: linear-gradient(
        0deg,
        rgba(0, 186, 230, 0.1) 0%,
        rgba(0, 0, 0, 0) 100%
      );
    }
  }
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-group {
  width: 100%;
}

.custom-input {
  width: 100%;
  height: 46px;
  background: #191c35;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 0 15px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;

  &::placeholder {
    color: #616498;
  }

  &:focus {
    border-color: #00bae6;
    background: #1e213d;
  }
}

.input-wrapper-pass {
  position: relative;
  width: 100%;

  .custom-input-pass {
    width: 100%;
    height: 46px;
    background: #191c35;
    border: 1px solid transparent;
    border-radius: 8px;
    padding: 0 40px 0 15px;
    color: white;
    font-size: 14px;
    outline: none;
    transition: all 0.2s;

    &::placeholder {
      color: #616498;
    }

    &:focus {
      border-color: #00bae6;
      background: #1e213d;
    }
  }

  .eye-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #616498;
    cursor: pointer;
    &:hover {
      color: white;
    }
  }
}

.referral-section {
  color: #9aa1b8;
  font-size: 13px;
  margin-top: -5px;

  .referral-toggle {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    margin-bottom: 5px;
    user-select: none;

    div {
      transition: transform 0.2s;
    }

    .rotated {
      transform: rotate(180deg);
    }
  }
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 5px;
}

.custom-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  font-size: 13px;
  color: #8a8cae;

  input {
    display: none;
  }

  .checkmark {
    width: 18px;
    height: 18px;
    min-width: 18px;
    border: 1px solid #2e3259;
    border-radius: 4px;
    background: #191c35;
    position: relative;
  }

  input:checked ~ .checkmark {
    background: #00c6ff;
    border-color: #00c6ff;

    &::after {
      content: "";
      position: absolute;
      left: 5px;
      top: 1px;
      width: 6px;
      height: 12px;
      border: solid #0f1226;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }

  .label-text {
    line-height: 1.4;
    a {
      color: #00c6ff;
      text-decoration: none;
      font-weight: 600;
    }
  }
}

.btn-signup {
  width: 100%;
  height: 48px;
  background: linear-gradient(90deg, #00c6ff 0%, #0072ff 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px 0 20px;
  transition: opacity 0.2s;
  margin-top: 10px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  .arrow-box {
    width: 38px;
    height: 38px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    display: grid;
    place-content: center;
  }
}

.phone-placeholder {
  color: #616498;
  text-align: center;
  margin-top: 30px;
}

.terms-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #141629;
  z-index: 10;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;

  .terms-box {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  h1 {
    font-size: 1.2rem;
    color: white;
    margin-bottom: 15px;
  }

  .terms-content {
    flex: 1;
    overflow-y: auto;
    color: #8a8cae;
    font-size: 0.9rem;
    white-space: pre-wrap;
    margin-bottom: 15px;
    background: #191c35;
    padding: 10px;
    border-radius: 8px;

    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: #2e3259;
      border-radius: 3px;
    }
  }
}
</style>
