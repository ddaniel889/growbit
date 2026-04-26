<template>
  <div class="admin-settings-input">
    <div class="input-name">{{ name }}</div>
    <div class="input-wrapper">
      <input
        v-model="adminValue"
        type="number"
        step="0.01"
        v-on:input="adminSettingsInput()"
        v-bind:disabled="socketSendLoading !== null"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AdminSettingsInput",
  props: ["name", "setting"],
  data() {
    return {
      adminValue: null,
    };
  },
  methods: {
    ...mapActions(["adminSendSettingValueSocket"]),
    adminSettingsInput() {
      const data = { setting: this.setting, value: Number(this.adminValue) };
      this.adminSendSettingValueSocket(data);
    },
  },
  computed: {
    ...mapGetters(["socketSendLoading", "generalSettings"]),
    adminGetValue() {
      let value = this.generalSettings;

      for (let key of this.setting.split(".")) {
        if (value[key] === undefined) return 0;
        value = value[key];
      }

      return value;
    },
  },
  created() {
    this.adminValue = this.adminGetValue;
  },
  watch: {
    generalSettings: {
      handler() {
        this.adminValue = this.adminGetValue;
      },
      deep: true,
    },
  },
};

</script>

<style scoped>
.admin-settings-input {
  width: 100%;
  height: 47px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 0 10px;
  border-radius: 5px;
}

.admin-settings-input .input-name {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 700;
  color: #7c808d;
}

.admin-settings-input .input-wrapper {
  width: 100px;
  height: 33px;
  padding: 0 5px;
  border-radius: 5px;
  background: #2c333f;
}

.admin-settings-input input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.857rem;
  font-weight: 600;
  color: #8a8e99;
  text-align: right;
  padding-right: 5px;
}

/* Remove arrows from number input */
.admin-settings-input input::-webkit-outer-spin-button,
.admin-settings-input input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
