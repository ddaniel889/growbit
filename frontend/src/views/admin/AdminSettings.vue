<template>
  <div class="admin-settings">
    <div class="settings-section">
      <div class="section-title">General</div>
      <AdminSettingsToggle
        name="Maintenance"
        setting="general.maintenance.enabled"
      />
      <AdminSettingsInput
        name="Volume Multiplier"
        setting="general.volumeMultiplier"
      />
      <AdminSettingsInput name="Fake Volume" setting="general.fakeVolume" />
      <!--      <AdminSettingsToggle-->
      <!--        name="Leaderboard"-->
      <!--        setting="general.leaderboard.enabled"-->
      <!--      />-->
      <AdminSettingsToggle name="Tip" setting="general.tip.enabled" />
      <!--      <AdminSettingsToggle-->
      <!--        name="Affiliate Redeem"-->
      <!--        setting="general.affiliate.enabled"-->
      <!--      />-->
      <!--      <AdminSettingsSelect-->
      <!--        name="Reward Multiplier"-->
      <!--        setting="general.reward.multiplier"-->
      <!--      />-->
    </div>
    <div class="settings-section">
      <div class="section-title">Chat</div>
      <AdminSettingsToggle name="Enabled" setting="chat.enabled" />
    </div>
    <div class="settings-section">
      <div class="section-title">Games</div>
      <AdminSettingsToggle name="Crash" setting="games.crash.enabled" />
      <AdminSettingsToggle name="Dice" setting="games.dice.enabled" />
      <AdminSettingsToggle name="Mines" setting="games.mines.enabled" />
      <AdminSettingsToggle name="Plinko" setting="games.plinko.enabled" />
      <AdminSettingsToggle name="Keno" setting="games.keno.enabled" />
      <AdminSettingsToggle name="Slide" setting="games.slide.enabled" />
      <AdminSettingsToggle name="Coinflip" setting="games.coinflip.enabled" />
      <AdminSettingsToggle name="Cases" setting="games.cases.enabled" />
      <AdminSettingsToggle name="Reme" setting="games.reme.enabled" />
      <AdminSettingsToggle name="Towers" setting="games.towers.enabled" />
    </div>
    <div class="settings-section">
      <div class="section-title">Crypto</div>
      <AdminSettingsToggle name="Deposit" setting="crypto.deposit.enabled" />
      <AdminSettingsToggle name="Withdraw" setting="crypto.withdraw.enabled" />
    </div>
    <div
      v-if="generalSettings && generalSettings.crypto"
      class="settings-section"
    >
      <div class="section-title">Crypto Coins</div>
      <template v-for="(coin, index) in generalSettings.crypto.coins">
        <AdminSettingsToggle
          :key="coin.name + 'enabled'"
          :name="coin.name + ' (Enable)'"
          :setting="'crypto.coins.' + index + '.enabled'"
        />
        <AdminSettingsToggle
          :key="coin.name + 'withdraw'"
          :name="coin.name + ' (Withdraw)'"
          :setting="'crypto.coins.' + index + '.withdrawEnabled'"
        />
      </template>
    </div>
    <div class="settings-section">
      <div class="section-title">Growtopia</div>
      <AdminSettingsToggle
        name="Withdraw"
        setting="growtopia.withdraw.enabled"
      />
      <AdminSettingsToggle name="Deposit" setting="growtopia.deposit.enabled" />
    </div>
    <div class="settings-section">
      <div class="section-title">MMO</div>
      <AdminSettingsToggle name="Withdraw" setting="mmo.withdraw.enabled" />
      <AdminSettingsToggle name="Deposit" setting="mmo.deposit.enabled" />
    </div>
    <div
      v-if="generalSettings && generalSettings.mmo"
      class="settings-section"
    >
      <div class="section-title">MMO Coins</div>
      <template v-for="(coin, index) in generalSettings.mmo.coins">
        <AdminSettingsToggle
          :key="coin.id"
          :name="coin.name"
          :setting="'mmo.coins.' + index + '.enabled'"
        />
      </template>
    </div>
    <div class="settings-section">
      <div class="section-title">Limited</div>
      <AdminSettingsToggle name="Withdraw" setting="limited.withdraw.enabled" />
      <AdminSettingsToggle name="Deposit" setting="limited.deposit.enabled" />
    </div>
    <div
      v-if="generalSettings && generalSettings.limited"
      class="settings-section"
    >
      <div class="section-title">Limited Items</div>
      <template v-for="(item, index) in generalSettings.limited.items">
        <AdminSettingsToggle
          :key="item.id"
          :name="item.name"
          :setting="'limited.items.' + index + '.enabled'"
        />
      </template>
    </div>
    <div
      v-if="generalSettings && generalSettings.gift"
      class="settings-section"
    >
      <div class="section-title">Gift Cards</div>
      <template v-for="(card, index) in generalSettings.gift.cards">
        <AdminSettingsToggle
          :key="card.id"
          :name="card.name"
          :setting="'gift.cards.' + index + '.enabled'"
        />
      </template>
    </div>
    <div
      v-if="generalSettings && generalSettings.credit"
      class="settings-section"
    >
      <div class="section-title">Credit Methods</div>
      <template v-for="(method, index) in generalSettings.credit.methods">
        <AdminSettingsToggle
          :key="method.id"
          :name="method.name"
          :setting="'credit.methods.' + index + '.enabled'"
        />
      </template>
    </div>
  </div>
</template>

<script>
import AdminSettingsToggle from "@/components/admin/AdminSettingsToggle";
import AdminSettingsSelect from "@/components/admin/AdminSettingsSelect";
import AdminSettingsInput from "@/components/admin/AdminSettingsInput";
import { mapGetters } from "vuex";

export default {//
  name: "AdminSettings",
  components: {
    AdminSettingsToggle,
    AdminSettingsSelect,
    AdminSettingsInput,
  },

  computed: {
    ...mapGetters(["generalSettings"]),//
  },
};
</script>

<style scoped>
.admin-settings {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, auto);
  gap: 10px;
}

.admin-settings .settings-section {
  width: 100%;
  padding: 15px 10px;
  border-radius: 5px;
  background-color: #22224a;
}

.admin-settings .settings-section:nth-child(1) {
  grid-column: 1 / 1;
  grid-row: 1 / 3;
}

.admin-settings .settings-section:nth-child(2) {
  grid-column: 1 / 1;
  grid-row: 3 / 3;
}

.admin-settings .settings-section:nth-child(3) {
  grid-column: 2 / 2;
  grid-row: 1 / 4;
}

.admin-settings .section-title {
  padding-left: 10px;
  font-size: 1rem;
  font-weight: 600;
  color: #5f6779;
}

@media only screen and (max-width: 1100px) {
  .admin-settings {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media only screen and (max-width: 850px) {
  .admin-settings {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media only screen and (max-width: 500px) {
  .admin-settings {
    grid-template-columns: repeat(1, 1fr);
  }

  .admin-settings .settings-section:nth-child(3) {
    grid-column: 1 / 1;
    grid-row: 4 / 4;
  }
}
</style>
