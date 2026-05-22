<template>
  <header>
    <div class="fixed">
      <div class="container">
        <div class="header-container">
          <div class="inner-container">
            <router-link to="/" custom v-slot="{ navigate }">
                <div @click="navigate" class="logo-wrapper">
                  <img class="logo-large" src="/img/betsweeps.png" alt="Betsweeps Logo" />
                  <!-- Logo para Móvil (Agregado) -->
                  <img class="logo-small" src="/img/betsweeps.png" alt="Betsweeps Logo" />

                </div>
            </router-link>
            <div class="switcher"></div>
            <div class="wallet" v-if="authUser?.user">  
            <div class="money">
            <span class="ingame" v-if="playingSlots">(In Game)</span>

           <img
                @click="show = !show"
                v-if="!playingSlots"
                :src="`/img/currencies/${selectedCurrency.toLowerCase()}_icon.png`" 
                alt=""
                />

          <span
             class="balance-value"
            :style="balanceWidth"
            @click="show = !show"
            v-if="!playingSlots"
            >{{ balance }}</span>

          <ArrowIcon
          v-if="!playingSlots"
          @click="show = !show"
          class="chevron"/>

         <transition name="slide">
           <div class="rows-menu" v-if="show === true">
            <div class="menu-inner">
        

    <button
    v-for="(item, index) in balances"
    :key="index"
    @click="pickCurrency(item.currency)"
    :class="{ active: item.currency === selectedCurrency }"
  >
    <span>
      {{ Number(item.balance).toLocaleString("en-US", { minimumFractionDigits: 2 }) }}
    </span>
   <span class="">  <img  :src="`/img/currencies/${item.currency.toLowerCase()}_icon.png`" /></span> 
  </button>
          </div>
          </div>
          </transition>
          </div>


              <app-button
                :click="
                  () => modalsSetShow(modalsShow === 'Wallet' ? null : 'Wallet')
                "
                :size="'16px'"
                :height="'33px'"
                :radius="'8px'"
              >
                <div>
                  <span class="wallet-txt-desktop">Purchase</span>
                  <span class="wallet-txt-mobile">+</span>
                </div>
              </app-button>
            </div>
            <div v-if="!authUser?.user" class="right auth-btns">
              <button
                class="login-btn-link"
                @click="modalsSetShow('Login')"
              >
                Login
              </button>
              <app-button
                :click="
                  () => {
                    modalsSetData({ authType: 'register' });
                    modalsSetShow('Login');
                  }
                "
                :height="'38px'"
                :size="'0.9rem'"
                :radius="'4px'"
                :padding="'0 22px'"
                :flat="true"
                class="register-flat"
              >
                Register
              </app-button>
            </div>
            <div v-else class="right flex-grow justify-content-end">
              <!--               <div
                v-if="authUser?.user"
                @click="
                  modalsSetShow(modalsShow === 'Rakeback' ? null : 'Rakeback')
                "
                :class="{ good: rakebackAvailable }"
              >
                <MagnetIcon></MagnetIcon>
              </div> -->
              <div
                @click="generalToggleChat()"
                class="hide-on-mobile has-tooltip"
                :class="{ selected: generalChat && !supportChat }"
                data-tooltip="Chat"
              >
                <ChatIcon></ChatIcon>
              </div>
              <div
                v-if="authUser?.user"
                @click="generalToggleSupport()"
                class="hide-on-mobile has-tooltip"
                :class="{ selected: supportChat }"
                data-tooltip="Support"
              >
                <PhoneIcon></PhoneIcon>
              </div>
              <router-link
                v-if="authUser?.user"
                tag="div"
                :to="`/profile`"
                class="hide-on-mobile has-tooltip"
                :class="{ notifications: hasProfileNotifications }"
                data-tooltip="Profile User"
              >
                <UserIcon></UserIcon>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import TokenIcon from "@/assets/images/mmo_coin.png";
import MagnetIcon from "@/assets/images/magnet.svg?inline";
import ChatIcon from "@/assets/images/Chat_alt.svg?inline";
import PhoneIcon from "@/assets/images/phone.svg?inline";
import UserIcon from "@/assets/images/User_fill.svg?inline";
import ArrowIcon from "@/assets/images/arrow.svg?inline";
import { LogIn, UserPlus } from "lucide-vue";

import AppButton from "@/components/AppButton.vue";
import { currencyExchangeRatesMixin } from "@/currencyExchangeMixin";

export default {
  mixins: [currencyExchangeRatesMixin],
  computed: {
    
    ...mapGetters([
      "authUser",
      "hasProfileNotifications",
      "supportChat",
      "generalChat",
      "fiatRates",
      "selectedCurrency",
      "rakebackData",
      "modalsShow",
      "authUser",
    ]),
    // rakebackAvailable() {
    //   const data = this.rakebackData?.rakeback;

    //   if (!data) {
    //     return false;
    //   }

    //   for (const r of data) {
    //     if (!r.lastClaimed) return true;
    //     const claimIntervals = {
    //       daily: 24 * 60 * 60 * 1000,
    //       weekly: 7 * 24 * 60 * 60 * 1000,
    //       monthly: 30 * 24 * 60 * 60 * 1000,
    //     };

    //     if (
    //       new Date(new Date(r.lastClaimed).getTime() + claimIntervals[r.type]) <
    //       new Date()
    //     ) {
    //       return true;
    //     }
    //   }

    //   return false;
    // },
    rakebackAvailable() {
      let rakeback = this.rakebackData?.rakeback;

      if (!rakeback) {
        return false;
      }

      const today = new Date();
      const claimIntervals = {
        daily: this.getNextDayInMiliseconds(),
        weekly: this.getNextWeekInMiliseconds(),
        monthly: this.getNextMonthInMiliseconds(),
      };

      for (const r of rakeback) {
        if (
          r.type === "daily" &&
          r.lastClaimed &&
          !this.isSameDay(new Date(r.lastClaimed), today) &&
          r.available >= 0.1
        ) {
          return true;
        } else if (!r.lastClaimed) {
          if (r.available > 0.1) {
            return true;
          }
        } else if (
          r.type === "weekly" &&
          r.lastClaimed &&
          !this.isSameWeek(new Date(r.lastClaimed), today) &&
          r.available >= 0.1
        ) {
          return true;
        } else if (!r.lastClaimed) {
          if (r.available > 0.1) {
            return true;
          }
        }

        if (
          r.type === "monthly" &&
          r.lastClaimed &&
          !this.isSameMonth(new Date(r.lastClaimed), today) &&
          r.available >= 0.1
        ) {
          return true;
        } else if (!r.lastClaimed) {
          if (r.available > 0.1) {
            return true;
          }
        }
      }

      return false;
    },

balances() {
  const wallet = this.authUser?.user?.wallet || { sc: 0, gc: 0 };

  return [
    { currency: "SC", balance: wallet.sc || 0 },
    { currency: "GC", balance: wallet.gc || 0 }
  ];
  
  /*return [
    {
      currency: "SC",
      balance: wallet.sc 
    },
    {
      currency: "GC",
      balance: wallet.gc
    }
  ];*/
},
 // ACTUALIZA EL COMPUTED balance() PARA EL FORMATO:
balance() {
  const active = this.balances.find((b) => b.currency === this.selectedCurrency);
  if (!active) return "0.00";
  
  // Formateamos aquí para la vista principal
  return Number(active.balance).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
},
    balanceDLS() {
      //  console.log('computed user balance ' + this.authUser?.user?.balance );
      return this.authUser?.user?.balance;
    },
    /*balanceWidth() {
      if (this.selectedCurrency === "DLS") {
        console.log('selectedCurrency')
        console.log(this.selectedCurrency)
        let width;
        if (this.balance.length <= 6) width = this.balance.length + 1;
        else width = this.balance.length - 1;
        return { width: width + "ch" };
      } else if (this.selectedCurrency === "TRY") {
        let width;
        // console.log(this.balance);
        //  console.log(this.balance.length);
        if (this.balance.length < 5) width = this.balance.length + 2;
        else if (this.balance.length < 8) width = this.balance.length + 1;
        else width = this.balance.length + 1;
        return { width: width + "ch" };
      } else if (this.selectedCurrency === "EUR") {
        let width;
        // console.log(this.balance);
        // console.log(this.balance.length);
        if (this.balance.length < 6) width = this.balance.length + 2;
        else width = this.balance.length + 1;
        return { width: width + "ch" };
      } else {
        let width;
        // console.log(this.balance);
        // console.log(this.balance.length);
        if (this.balance.length < 6) width = this.balance.length + 2;
        else if (this.balance.length < 8) width = this.balance.length + 1;
        else width = this.balance.length;
        return { width: width + "ch" };
      }
    }*/
    balanceWidth() {
  // Simplificado: 1ch por cada número + un pequeño margen
  return { width: (this.balance.length + 1) + "ch" };
},
  },
  components: {
    ChatIcon,
    UserIcon,
    AppButton,
    MagnetIcon,
    PhoneIcon,
    ArrowIcon,
    LogIn,
    UserPlus,
  },
  data() {
    return {
      TokenIcon,
      playingSlots: false,
      animated: [],
      show: false,
      nonLocalFound: false,
      animationTimeout: null,
      Logo: "/img/preloader-logo.svg",
      LogoSmall: "/img/preloader-logo.svg",
      // Solo SC y GC
     /* currencyList: [
        { name: "Sweep Coins", code: "sc", icon: "sc_icon.png" },
        { name: "Gold Coins", code: "gc", icon: "gc_icon.png" }
      ]*/
      symbols: {
        SC: "", // O "SC " si quieres que aparezca el texto antes del número
      GC: "",
      DLS: "",
        USD: "$",
        GBP: "£",
        EUR: "€",
        TRY: "₺",
        DLS: "",
      }
    };
  },
  mounted() {
    this.playingSlots = !!this.$route.matched.find((m) => m.name === "Slot");

  },
  watch: {
    // Vigilamos el getter del socket. Cuando deje de ser 'undefined', se ejecuta.
    "$store.getters.socketCashier": {
      immediate: true, // Se ejecuta inmediatamente al cargar para verificar si ya existe
      handler(cashierSocket) {
        if (cashierSocket) {
          // Limpiamos posibles escuchas previas para no duplicar eventos
          cashierSocket.off("PAYMENT_SUCCESS");

          // Escuchamos el evento de éxito
          cashierSocket.on("PAYMENT_SUCCESS", (data) => {
            if (data && data.user) {
              // Actualizamos el usuario con los nuevos balances wallet.sc y wallet.gc
              const sanitizedUser = {
          ...data.user,
          wallet: {
            sc: Number(data.user.wallet.sc),
            gc: Number(data.user.wallet.gc)
          }
        }
              this.$store.commit("auth_update_user", data.user);
              //this.$toast.success("Balance updated!");
            this.notificationShow({ 
               type: "success", 
               message: "Balance updated!" 
            })
              this.$store.dispatch("notificationShow", {
                type: "success",
                message: "Deposit confirmed! Your balance has been updated."
              });
            }
          });
          console.log("[SOCKET] Listener de pagos activado en el Header");
        }
      }
    }
  },
beforeDestroy() {
 const cashierSocket = this.$store.getters["socketCashier"];
  if (cashierSocket) cashierSocket.off("PAYMENT_SUCCESS");
},
  methods: {
    pickCurrency(currency) {
    this.setCurrency(currency); // Esto debe actualizar 'selectedCurrency' en Vuex
    this.show = false;
  },
    ...mapActions([
      "modalsSetShow",
      "modalsSetData",
      "generalToggleChat",
      "generalToggleSupport",
      "setCurrency",
      "notificationShow"
    ]),
    getBalanceInSelectedCurrency(balance) {
      return this.getDisplayCurrencyAmountFormatted(balance);
    },
    pickCurrency(currency) {
      this.setCurrency(currency);
      this.show = false;
    },
    getSymbol(currency) {
      return this.symbols[currency];
    },
    getFloatBalance(balance) {
      return parseFloat(balance.replace(/[^0-9.-]+/g, ""));
    },
    getNextDayInMiliseconds() {
      const now = new Date();
      const nextDay = new Date(now);
      nextDay.setHours(24, 0, 0, 0);

      return nextDay;
    },

    getNextWeekInMiliseconds() {
      const now = new Date();
      const nextWeek = new Date(now);
      nextWeek.setDate(now.getDate() + (7 - now.getDay()));
      nextWeek.setHours(0, 0, 0, 0);

      return nextWeek;
    },

    getNextMonthInMiliseconds() {
      const now = new Date();
      const nextMonth = new Date(now);
      nextMonth.setMonth(now.getMonth() + 1);
      nextMonth.setDate(1);
      nextMonth.setHours(0, 0, 0, 0);

      return nextMonth;
    },

    isSameDay(date1, date2) {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    },

    isSameWeek(date1, date2) {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        this.getWeekNumber(date1) === this.getWeekNumber(date2)
      );
    },

    isSameMonth(date1, date2) {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth()
      );
    },

    getWeekNumber(date) {
      const janFirst = new Date(date.getFullYear(), 0, 1);
      // Source: https://stackoverflow.com/a/27125580/3307678
      return Math.ceil(
        ((date.getTime() - janFirst.getTime()) / 86400000 +
          janFirst.getDay() +
          1) /
          7,
      );
    },
  },
  watch: {
    balanceDLS: {
      handler: function (newValue, oldValue) {
        newValue = this.getFloatBalance(
          this.getBalanceInSelectedCurrency(newValue),
        );
        oldValue = this.getFloatBalance(
          this.getBalanceInSelectedCurrency(oldValue),
        );

        if (newValue == undefined || oldValue == undefined) {
          return;
        }

        //console.log(newValue);
        //console.log(oldValue);

        if (!this.playingSlots) {
          let e = {};
          if (newValue >= oldValue) {
            e.action = "add";
            e.diff = newValue - oldValue;
            e.diff = e.diff.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            //  e.diff = this.getBalanceInSelectedCurrency(newValue - oldValue);
          } else if (oldValue > newValue) {
            e.action = "subtract";
            e.diff = oldValue - newValue;
            e.diff = e.diff.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            // e.diff = this.getBalanceInSelectedCurrency(newValue - oldValue);
          }

          this.animated.push(e);
          setTimeout(
            () => (this.animated = this.animated.filter((a) => a !== e)),
            1000,
          );
        }
      },
    },
    $route: {
      handler: function (newRouteValue) {
        this.playingSlots = !!newRouteValue.matched.find(
          (m) => m.name === "Slot",
        );
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
@use "@/assets/sass/mixins" as m;
@import "@/assets/sass/variables";

header {
  .auth-btns {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 6px;
    margin-left: auto;
    flex-shrink: 0;

    .login-ghost {
      background: transparent !important;
      color: #9ba0b4 !important;
      font-weight: 700;
      min-width: 80px;
      transition: all 0.2s;

      @media (max-width: 991px) {
        min-width: 42px !important;
        width: 42px !important;
        height: 42px !important;
        padding: 0 !important;
        border-radius: 12px !important;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &:hover {
        color: white !important;
      }
    }

    .register-action {
      min-width: 110px;
      box-shadow: 0 4px 15px rgba(91, 70, 188, 0.4);

      @media (max-width: 991px) {
        min-width: 42px !important;
        width: 42px !important;
        height: 42px !important;
        padding: 0 !important;
        border-radius: 12px !important;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .desktop-text {
      @media (max-width: 991px) {
        display: none;
      }
    }

    .mobile-icon {
      display: none;
      @media (max-width: 991px) {
        display: block;
      }
    }
  }

  height: $header-height;
  display: initial !important;
  flex-shrink: 0;
  z-index: 38001;
  overflow: visible;
  @include m.hide_scrollbar();

  .logo-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
    flex-shrink: 0;
    height: 100%;
    overflow: visible;
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.98);
    }
  }

  .logo-large {
    height: 120px;
    width: auto;
    //object-fit: contain;
    margin-top: -10px; 
    display: block;
    object-fit: contain;

  @media (max-width: 991px) {
    display: none;
  }

  /* Ajustes para pantallas grandes */
  @media (min-width: 1400px) {
    height: 140px;
  }

  /* Ajuste para laptops */
   @media (max-width: 1200px) {
    height: 100px;
  }
  }

.logo-small {
  display: none;
  /* Aumentamos significativamente el alto para compensar el espacio vacío de la imagen */
  height: 110px; 
  width: auto;
  object-fit: contain;
  
  /* Esto moverá el logo hacia la izquierda y arriba para centrar la parte visible */
  margin-left: -15px; 
  margin-top: -5px;

  @media (max-width: 991px) {
    display: block;
    /* Usamos scale para agrandar el logo real sin que el contenedor crezca demasiado */
    transform: scale(1.6); 
    transform-origin: left center;
  }
}

  @media (max-width: 991px) {
    .logo-large {
      display: none;
    }
    .logo-small {
      display: block;
      height: 36px;
    }
  }

  @media (max-width: 480px) {
    .logo-small {
      display: block;
      height: 32px;
      height: 30px;
      width: auto;
    }
  }

  @media (max-width: 360px) {
    .logo-small {
      height: 28px;
    }
  }

  .magnet-box {
    padding: 3px;
    display: grid;
    place-content: center;
    background: #090c1d;
    border-radius: 10px;
    margin-left: 5px;
    height: 45px;
  }

  .wallet {
    z-index: 5;
    margin-left: auto;
    align-items: center;
    padding: 3px;
    height: 45px;
    display: flex;

    background: #090c1d;
    border-radius: 10px;

    @media (max-width: 991px) {
      margin-right: 8px;
      flex-shrink: 0;
    }

    .money {
      //  padding-inline: 10px;
      //  white-space: nowrap;
      display: flex;
      cursor: pointer;
      align-items: center;
      justify-content: center;



      .animated {
        position: absolute;
        left: -30px;
        opacity: 0;
      }

      .color-red {
        color: red;
      }

      .color-green {
        color: green;
      }

      span {
        &.balance-value {
          padding-left: 10px;
        }
        font-family: Excon;
        letter-spacing: 0; /* Remove any default spacing */
        //width: 8ch;  /* Set the width to a multiple of the average character width */
        white-space: pre; /* Keep white space intact */
        color: white;
        font-size: 1.143rem;
        font-weight: 600;
        @media (max-width: 400px) {
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &.ingame {
          padding-right: 10px;
          font-weight: 600;
          color: #564f80;
        }
      }

      > img {
        margin-left: 10px;
        // margin-right: 10px;
        height: 18px;
        width: 18px;
        padding-bottom: 1px;
      }

      .chevron {
        //padding-right: 10px;
      }

      //gap: 4px;
    }

    @media (max-width: 840px) {
      transform: unset !important;
      left: 125px !important;
    }

    .wallet-txt-desktop {
      @media (max-width: 991px) {
        display: none;
      }
    }

    .wallet-txt-mobile {
      @media (min-width: 991px) {
        display: none;
      }
    }

    display: flex;
  }

  .chat {
    display: flex;
    border: 1px solid #3b3a65;
    background: rgba(255, 255, 255, 0.07);
    cursor: pointer;
    transition: background 0.3s ease;
    border-radius: 50%;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    padding-top: 2px;
    width: 45px;
    height: 45px;
    align-items: center;
    justify-content: center;
    margin-left: 10px;

    > img {
      width: 22px !important;
      height: 22px !important;
      margin-left: 0 !important;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  .fixed {
    height: $header-height;
    position: sticky;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 1000;
    background: #111026;
    border-bottom: 2px solid #121129;

    .header-container {
      display: flex;
      height: 100%;
     // padding: 0 20px;
      display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px; /* Ajusta según el diseño */
  background-color: #0b0e11; /* Color oscuro del fondo */

      .inner-container {
        display: flex;
        align-items: center;
        width: 100%;
        overflow: visible;
        gap: 15px;

        @media (max-width: 991px) {
          margin: unset;
          padding: 0 10px;
          gap: 8px;
          overflow: visible;
        }

        .logo-wrapper {
          flex-shrink: 0;
          @media (max-width: 991px) {
            flex-shrink: 1;
            min-width: 0;
            max-width: 120px;
          }
        }
      }

      border-right: 5px solid #111026;

      @media (max-width: 991px) {
        a {
          margin-right: 15px;
        }
      }

      height: $header-height;

      .switcher {
        display: flex;

        @media (max-width: 991px) {
          display: none;
        }
      }

      @media (max-width: 1800px) {
        padding: 0 10px;
      }

      @media (max-width: 1500px) {
        padding: 0 10px;
      }

      @media (max-width: 1350px) {
        padding: 0 10px;
      }

      .menuSwitcher {
        display: none;
        margin-left: 15px;
        opacity: 0.5;
        transition: opacity 0.3s ease;
        cursor: pointer;

        &:hover {
          opacity: 1;
        }
      }
    }

    background: #111026;

    .logo {
      /*        height: 40px;
                width: 40px;
                display: flex;
                cursor: pointer;
                background: url('/img/misc/logo.png') no-repeat center;
                background-size: contain;
                margin-left: unset;
      */
      @media (min-width: 991px) {
        display: none;
      }
    }

    .right {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: auto;
      cursor: pointer;

      /* Contenedor base del tooltip */
.has-tooltip {
  position: relative; /* Esencial para posicionar el tooltip respecto al botón */
  
  // Pseudo-elemento para el globo de texto
  &::before {
    content: attr(data-tooltip); /* Captura el texto dinámicamente del HTML */
    position: absolute;
    bottom: -38px; /* Lo posiciona justo debajo del botón */
    left: 50%;
    transform: translateX(-50%) translateY(10px); /* Centrado horizontal con desfase inicial */
    
    // Estilos de diseño (Colores oscuros/neón acordes al proyecto)
    background-color: #1a1c38;
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.5px;
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid #2e3259;
    white-space: nowrap; /* Evita que el texto se rompa en varias líneas */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
    
    // Configuración para animación fluida (Fade-in + Slide)
    opacity: 0;
    pointer-events: none; /* Evita parpadeos molestos si el mouse pasa por encima */
    transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
    z-index: 99;
  }

  // Pseudo-elemento para la pequeña flecha apuntando arriba
  &::after {
    content: "";
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    
    // Construcción de la flecha mediante bordes
    border-width: 0 6px 6px 6px;
    border-style: solid;
    border-color: transparent transparent #2e3259 transparent;
    
    opacity: 0;
    pointer-events: none;
    transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
    z-index: 100;
  }

  // Comportamiento al hacer Hover (Pasa el mouse)
  &:hover {
    &::before,
    &::after {
      opacity: 1;
      transform: translateX(-50%) translateY(0); /* Sube suavemente a su posición final */
    }
  }
}

      &.ml-auto {
        margin-left: auto;
      }

      > div {
        display: grid;
        place-content: center;
        width: 45px;
        height: 45px;
        background: #22224a;
        border-radius: 15px;
      }

      .notifications {
        border: 2px solid #f7be2c;
      }

      .good {
        border: 2px solid #24ae59;
      }
      .selected {
        border: 2px solid #c6caff;
      }

      &.auth-btns {
        gap: 12px;
        //padding-right: 10px;
        margin-left: auto;
        display: flex !important;
        
        @media (max-width: 991px) {
           padding-right: 0;
           // Si los botones son muy grandes para móvil, puedes ajustar el padding aquí
           .login-btn-link {
             font-size: 0.8rem;
             padding: 0 5px;
           }
        }

        .login-btn-link {
          background: transparent;
          border: none;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          padding: 0 10px;
          transition: opacity 0.2s;
          
          &:hover {
            opacity: 0.8;
          }
        }

        .register-flat {
          background: #5b46bc !important;
          color: #ffffff;
          font-weight: 800;
          box-shadow: 0 4px 15px rgba(91, 70, 188, 0.2);
          &:hover {
            background: #6a53d4 !important;
          }
        }
      }

      .hide-on-mobile {
        @media (max-width: 991px) {
          display: none;
        }
      }

      @media (max-width: 991px) {
        [data-notification-view] {
          display: none !important;
        }
      }

      .btn {
        //padding: 10px 30px !important;
        //border-radius: 10px;
      }
    }
  }
}

.balance-a-enter-active,
.balance-a-leave-active {
  transition: all 1s ease;
}

.balance-a-enter {
  margin-top: 25px;
  opacity: 1 !important;
}

.balance-a-enter-to {
  margin-top: 0;
  opacity: 0 !important;
}

.balance-a-leave,
.balance-a-leave-to {
  opacity: 0 !important;
}

.money {
  width: 100%;
  position: relative;

  .rows-menu {
    position: absolute;
    top: 42px;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 9;

    &.slide-enter-active,
    &.slide-leave-active {
      overflow: hidden;
      transition: height 0.2s ease;
    }

    &.slide-enter-to,
    &.slide-leave {
      height: 370px;
    }

    &.slide-enter,
    &.slide-leave-to {
      height: 0;
    }
  }

.menu-inner {
  width: 100%;
  position: relative;
  padding: 5px 0;
  border-radius: 5px;
  background-color: #22224a;
  max-height: 300px;
  overflow: scroll;

  button {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
    padding: 0 17px;
    border-radius: 0;
    font-size: 0.857rem;
    font-weight: 600;
    color: #ffffff;
    background-color: transparent;
    border: none;
    transition: all 0.3s ease;
     img {
        height: 18px;
        width: 18px;
      }

    &:hover,
    &.active {
      background-color: #292950;
    }
  }
}
}
</style>
