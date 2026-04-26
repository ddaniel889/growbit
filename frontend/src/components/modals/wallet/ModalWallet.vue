<template>
  <div class="modal-credit" :class="{ selected: selected || tab === TIP }">
    <div class="wallet-container">
      <div class="top_menu">
        <app-button
          :secondary="tab !== DEPOSIT"
          :click="() => selectTab(DEPOSIT)"
          :disabled="this.growtopiaTransaction.inProgress"
          >Purchase</app-button
        >
        <app-button
          :secondary="tab !== REDEEM"
          :click="() => selectTab(REDEEM)"
          :disabled="this.growtopiaTransaction.inProgress"
          >Redeem</app-button
        >
        <app-button
          :secondary="tab !== TIP"
          :click="() => selectTab(TIP)"
          :disabled="this.growtopiaTransaction.inProgress"
          >Tip</app-button
        >
        <div class="close" @click="modalCloseButton()">
          <img :src="CloseIcon" alt="Close" />
        </div>
        <!--        <div v-if="selected" class="back" @click="goBack()">-->
        <!--          <img :src="BackIcon" alt="Back" />-->
        <!--        </div>-->
      </div>

      <div class="top_menu_mobile" v-if="!selected">
        <AppDropdown
          height="45px"
          :items="dropdown"
          :selected-input="tab"
        ></AppDropdown>
      </div>

      <Tip v-if="tab === TIP"></Tip>
      <Deposit v-if="tab === DEPOSIT"></Deposit>
      <Redeem v-if="tab === REDEEM"></Redeem>
      <div v-else-if="!selected" class="opt">
        <LoadingAnimation v-if="cashierCryptoData.loading"></LoadingAnimation>
        <div v-for="group in structure">
          <label>{{ group.text }}</label>
          <div class="items">
            <div
              @click="select(item)"
              :class="`wallet-item ${item.value}`"
              v-for="item in group.options"
            >
              <img :src="item.icon" />
              <span>{{ item.text }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="selected" class="wallet-action">
        <div
          :style="{
            width: '100%',
            display: selected && selected.group === CRYPTO ? 'block' : 'none',
          }"
        >
          <CashierCryptoDepositItem
            :go-back="goBack"
            :currency="selected.text"
          ></CashierCryptoDepositItem>
        </div>

        <MmoTransactions
          :transaction-type="tab"
          :go-back="goBack"
          v-if="
            selected &&
            selected.group === INGAME_CURR &&
            selected.id !== 'Growtopia'
          "
          :currency="selected"
        ></MmoTransactions>
        <growtopia-items
          v-if="tab === DEPOSIT && selected && selected.id === 'Growtopia'"
          :game="selected"
          :go-back="goBack"
        ></growtopia-items>
        <CashierCryptoWithdrawItem
          v-if="tab === WITHDRAW && selected && selected.group === CRYPTO"
          :currency="selected.text"
          :go-back="goBack"
        ></CashierCryptoWithdrawItem>
        <withdraw-growtopia-items
          v-if="tab === WITHDRAW && selected && selected.id === 'Growtopia'"
          :go-back="goBack"
          :game="selected"
        ></withdraw-growtopia-items>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ButtonLoading from "@/components/ButtonLoading.vue";

import Crypto from "@/assets/images/crypto.svg";
import Box from "@/assets/images/box.svg";
import CloseIcon from "@/assets/images/close.svg";
import BackIcon from "@/assets/images/undo.svg";
import Arrow from "@/assets/images/arrow.svg";
import PromoIcon from "@/assets/images/promo.svg";
import Runescape3 from "@/assets/images/runescape3.svg";
import WowIcon from "@/assets/images/wow.png";
import AppButton from "@/components/AppButton.vue";
import WithdrawGrowtopiaItems from "@/components/modals/wallet/growtopia/WithdrawGrowtopiaItems.vue";
import GrowtopiaItems from "@/components/modals/wallet/growtopia/GrowtopiaItems.vue";
import CashierCryptoDepositItem from "@/components/modals/wallet/crypto/CashierCryptoDepositItem.vue";
import CashierCryptoWithdrawItem from "@/components/modals/wallet/crypto/CashierCryptoWithdrawItem.vue";
import MmoTransactions from "@/components/modals/wallet/mmo/MmoTransactions.vue";
import AppDropdown from "@/components/AppDropdown.vue";
import Tip from "@/components/modals/wallet/Tip.vue";
import Deposit from "@/components/modals/wallet/Deposit.vue";
//import Withdraw from "@/components/modals/wallet/Withdraw.vue";
import LoadingAnimation from "@/components/LoadingAnimation.vue";
import Redeem from "@/components/modals/wallet/Redeem.vue";

const GrowtopiaIcon = "/img/growtopia/blue_gem_lock.png";

const DEPOSIT = "deposit";
const PROMOCODE = "promocode";
const TIP = "tip"; 
const REDEEM = "redeem";      
const WITHDRAW = "withdraw";
const INGAME_CURR = "Video-game currency";
const INGAME_ITEMS = "Ingame items";
const CRYPTO = "Crypto currency";

export default {
  name: "ModalWallet",
  components: {
    LoadingAnimation,
    CashierCryptoDepositItem,
    CashierCryptoWithdrawItem,
    ButtonLoading,
    GrowtopiaItems,
    MmoTransactions,
    WithdrawGrowtopiaItems,
    Tip,
    Deposit,
    Redeem,
    AppButton,
    AppDropdown,
  },
  data() {
    return {
      modalAmount: 0,
      DEPOSIT,
      WITHDRAW,
      REDEEM,
      INGAME_CURR,
      INGAME_ITEMS,
      CRYPTO,
      PROMOCODE,
      TIP,
      CloseIcon,
      WowIcon,
      Runescape3,
      BackIcon,
      PromoIcon,
      GrowtopiaIcon,
      selected: null,
      Arrow,
      tab: DEPOSIT,
      dropdown: [
        {
          name: "Deposit",
          onSelect: () => this.selectTab(DEPOSIT),
        },
        {
          name: "Withdraw",
          onSelect: () => this.selectTab(REDEEM),
        },
        {
          name: "Tip",
          onSelect: () => this.selectTab(TIP),
        },
      ],
    };
  },
  created() {
    this.cashierGetCryptoDataSocket();
    this.cashierGetGrowtopiaActiveTransactions();
  },
  methods: {
    ...mapActions([
      "notificationShow",
      "modalsSetShow",
      "cashierSendCreditDepositSocket",
      "cashierGetCryptoDataSocket",
      "cashierGetGrowtopiaActiveTransactions",
    ]),
    modalCloseButton() {
      this.modalsSetShow(null);
    },
    goBack() {
      if (
        this.growtopiaTransaction.inProgress ||
        this.growtopiaTransaction.loading
      ) {
        return;
      }
      this.selected = null;
    },

    selectTab(tab) {
      if (
        this.growtopiaTransaction.inProgress ||
        this.growtopiaTransaction.loading
      ) {
        return;
      }

      this.selected = null;
      this.tab = tab;
    },
    select(select) {
      if (
        this.growtopiaTransaction.inProgress ||
        this.growtopiaTransaction.loading
      ) {
        return;
      }
      this.selected = select;
    },
  },
  watch: {
    modalsData: {
      immediate: true,
      handler(val) {
        if (val && val.tab) {
          if ([DEPOSIT, WITHDRAW, TIP].includes(val.tab)) {
            this.selectTab(val.tab);
          }
        }
      },
    },
    growtopiaTransaction: {
      immediate: true,
      deep: true,
      handler(state, oldState) {
        if (state.inProgress) {
          if (
            (this.selected && this.selected.id != "Growtopia") ||
            this.tab != state.type
          ) {
            this.selected = {
              text: "Growtopia",
              id: "Growtopia",
              group: INGAME_CURR,
              icon: GrowtopiaIcon,
            };
            this.tab = state.type;
          }
        }
      },
    },
  },
  computed: {
    ...mapGetters([
      "socketSendLoading",
      "modalsData",
      "cashierCryptoData",
      "growtopiaTransaction",
      "generalSettings",
    ]),
    structure() {
      const items = [];

      // Crypto Section
      const cryptoEnabled =
        this.tab === WITHDRAW
          ? this.generalSettings?.crypto?.withdraw?.enabled
          : this.generalSettings?.crypto?.deposit?.enabled;

      if (cryptoEnabled) {
        const coins = (this.generalSettings?.crypto?.coins || []).filter(
          (c) =>
            c &&
            c.name &&
            (this.tab === WITHDRAW ? c.withdrawEnabled : c.enabled),
        );

        if (coins.length > 0) {
          items.push({
            text: CRYPTO,
            icon: Crypto,
            bg: null,
            options: coins.map((c) => ({
              icon: `/img/cashier/${c.name.toLowerCase()}.png`,
              text: c.name === "USDT" ? `${c.name} (${c.network})` : c.name,
              value: c.name,
              style: "",
              group: CRYPTO,
              id: c.name,
            })),
          });
        }
      }

      // Growtopia / Video-game Section
      const growtopiaEnabled =
        this.tab === WITHDRAW
          ? this.generalSettings?.growtopia?.withdraw?.enabled
          : this.generalSettings?.growtopia?.deposit?.enabled;

     /* if (growtopiaEnabled) {
        items.push({
          text: INGAME_CURR,
          icon: Box,
          bg: null,
          options: [
            {
              text: "Growtopia",
              value: "Growtopia",
              id: "Growtopia",
              group: INGAME_CURR,
              icon: GrowtopiaIcon,
            },
          ],
        });
      }*/

      // MMO Section
      const mmoEnabled =
        this.tab === WITHDRAW
          ? this.generalSettings?.mmo?.withdraw?.enabled
          : this.generalSettings?.mmo?.deposit?.enabled;

      if (mmoEnabled) {
        const mmoCoins = (this.generalSettings?.mmo?.coins || []).filter(
          (c) => c && c.id && c.name && c.enabled,
        );

        if (mmoCoins.length > 0) {
          items.push({
            text: "MMO currency",
            icon: Box,
            bg: null,
            options: mmoCoins.map((c) => ({
              text: c.name,
              value: c.id,
              id: c.id,
              group: INGAME_CURR,
              icon: c.id === "rs3_gold" ? Runescape3 : WowIcon, // Map icons by ID
            })),
          });
        }
      }

      // Gift Cards Section
      const giftEnabled =
        this.tab === WITHDRAW
          ? this.generalSettings?.gift?.withdraw?.enabled
          : this.generalSettings?.gift?.deposit?.enabled;

      if (giftEnabled) {
        const giftCards = (this.generalSettings?.gift?.cards || []).filter(
          (c) => c && c.name && c.enabled,
        );

        if (giftCards.length > 0) {
          items.push({
            text: "Gift Cards",
            icon: PromoIcon,
            bg: null,
            options: giftCards.map((c) => ({
              text: c.name,
              value: c.id,
              id: c.id,
              group: "Gift Cards",
              icon: PromoIcon,
            })),
          });
        }
      }

      // Limited Items Section
      const limitedEnabled =
        this.tab === WITHDRAW
          ? this.generalSettings?.limited?.withdraw?.enabled
          : this.generalSettings?.limited?.deposit?.enabled;

      if (limitedEnabled) {
        const limitedItems = (this.generalSettings?.limited?.items || []).filter(
          (c) => c && c.name && c.enabled,
        );

        if (limitedItems.length > 0) {
          items.push({
            text: INGAME_ITEMS,
            icon: Box,
            bg: null,
            options: limitedItems.map((c) => ({
              text: c.name,
              value: c.id,
              id: c.id,
              group: INGAME_ITEMS,
              icon: WowIcon, // Placeholder icon
            })),
          });
        }
      }

      // Credit Section
      const creditEnabled =
        this.tab === WITHDRAW
          ? this.generalSettings?.credit?.withdraw?.enabled
          : this.generalSettings?.credit?.deposit?.enabled;

      if (creditEnabled) {
        const creditMethods = (
          this.generalSettings?.credit?.methods || []
        ).filter((c) => c && c.name && c.enabled);

        if (creditMethods.length > 0) {
          items.push({
            text: "Credit",
            icon: Crypto,
            bg: null,
            options: creditMethods.map((c) => ({
              text: c.name,
              value: c.id,
              id: c.id,
              group: "Credit",
              icon: "/img/cashier/visa.png",
            })),
          });
        }
      }

      return items;
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-credit {
  width: 1000px;

  &.selected {
    @media (min-width: 991px) {
      width: 700px;
    }
  }

  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--dark-blue);
  border-radius: 15px;
  border: 4px solid #090c1d;

  @media (max-width: 991px) {
    width: 100%;
    background: #090c1d;
  }
  .items {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .back,
  .close {
    width: 40px;
    height: 40px;
    background: #22224a;
    border-radius: 8px;
    display: grid;
    cursor: pointer;
    place-content: center;
  }

  .close {
    margin-left: auto;
  }
}

.select-wrapper {
  width: 100%;
  @media (min-width: 991px) {
    display: none;
  }
}

.cashier-select-wrapper {
  width: 100%;
  margin-bottom: 25px;
  color: #f7be2c;
}

.select-wrapper {
  width: 100%;
  @media (min-width: 991px) {
    display: none;
  }
}

.cashier-select-wrapper {
  width: 100%;
  margin-bottom: 25px;
  color: #f7be2c;
}

.wallet-container {
  height: fit-content;
  display: flex;
  width: 100%;
  z-index: 5;
  flex-direction: column;
  overflow: scroll;

  .wallet-action {
    display: flex;
    flex-grow: 1;
    align-items: center;
    flex-direction: column;
  }

  .top_menu_mobile {
    display: flex;
    flex-direction: row;
    gap: 15px;
    padding: 15px;

    @media screen and (min-width: 991px) {
      display: none;
    }
  }

  .top_menu {
    padding: 30px;
    background: #090c1d;
    display: flex;
    height: 80px;
    align-items: center;
    flex-direction: row;
    gap: 15px;

    @media screen and (max-width: 991px) {
      display: none;
    }
  }

  .opt {
    padding: 30px;
    @media (max-width: 991px) {
      padding: 15px;
    }

    > div {
      display: flex;
      flex-direction: column;

      > label {
        margin-bottom: 20px;
        font-family: "Excon";
        font-style: normal;
        font-weight: 700;
        font-size: 1.429rem;
        line-height: 28px;
        color: #eeeeee;
      }

      margin-bottom: 30px;
    }
  }

  .wallet-item {
    width: 170px;
    gap: 25px;

    background: #22224a;
    cursor: pointer;
    border: 2px solid #00a2ff;

    border-radius: 10px;
    padding: 25px 19px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    @media (max-width: 991px) {
      max-width: 45%;
      gap: 10px;
      padding: 15px 10px;
    }
    span {
      font-weight: 700;
      font-size: 1.29rem;
      color: #eeeeee;
      text-transform: capitalize;
    }

    img {
      width: 35px;
      height: 35px;
      border-radius: 10px;
    }

    &.BCH {
      border: 2px solid #0eb98b; /* Bitcoin Cash */
    }

    &.BNB {
      border: 2px solid #f3ba2f; /* Binance Coin */
    }

    &.BTC {
      border: 2px solid #f7931a; /* Bitcoin */
    }

    &.DOGE {
      border: 2px solid #c2a633; /* Dogecoin */
    }

    &.DOGS {
      border: 2px solid #6c757d; /* Dogs */
    }

    &.LTC {
      border: 2px solid #345d9d; /* Litecoin */
    }

    &.NOT {
      border: 2px solid #000000; /* Not Coin */
    }

    &.POL {
      border: 2px solid #8247e5; /* Polygon */
    }

    &.SHIB {
      border: 2px solid #fbaa28; /* Shiba Inu */
    }

    &.SOL {
      border: 2px solid #3a87ff; /* Solana */
    }

    &.TON {
      border: 2px solid #0098ff; /* Toncoin */
    }

    &.TRX {
      border: 2px solid #eb0029; /* TRON */
    }

    &.USDT {
      border: 2px solid #26a17b; /* Tether */
    }

    &.USDC {
      border: 2px solid #2775ca; /* USD Coin */
    }

    &.XMR {
      border: 2px solid #f26822; /* Monero */
    }
  }

  .promo-item {
    width: fit-content;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 15px;
    gap: 25px;
    background: #22224a;
    border: 2px solid #090c1d;
    border-radius: 10px;

    span {
      font-family: "Excon";
      font-style: normal;
      font-weight: 700;
      font-size: 1.29rem;
      color: #eeeeee;
    }
  }
}
</style>
