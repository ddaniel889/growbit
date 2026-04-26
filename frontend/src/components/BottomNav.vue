<template>
  <nav class="mobile-menu">
    <!-- Menu -->
    <div
      class="control"
      :class="{ active: menuOpened === 'menu' }"
      @click="open('menu')"
    >
      <div class="control-inner">
        <Menu :size="22" :stroke-width="2.5" />
        <span>Menu</span>
      </div>
    </div>

    <!-- Home -->
    <div
      class="control"
      :class="{ active: $route.path === '/' || $route.path === '/casino' }"
      @click="handleMenuClick('/')"
    >
      <div class="control-inner">
        <Home :size="22" :stroke-width="2.5" />
        <span>Home</span>
      </div>
    </div>

    <!-- Wallet -->
    <div
      class="control wallet-control"
      :class="{ active: isActive('/wallet') }"
      @click="handleMenuClick('/wallet')"
    >
      <div class="wallet-background-curve"></div>
      <div class="wallet-btn">
        <Wallet :size="24" :stroke-width="2.5" />
      </div>
      <span>Wallet</span>
    </div>

    <!-- Profile -->
    <div
      class="control"
      :class="{ active: isActive('/profile') }"
      @click="handleMenuClick('/profile')"
    >
      <div class="control-inner">
        <User :size="22" :stroke-width="2.5" />
        <span>Account</span>
      </div>
    </div>

    <!-- Chat -->
    <div
      class="control"
      :class="{ active: generalChatMobile }"
      @click="chatClick"
    >
      <div class="control-inner">
        <MessageSquare :size="22" :stroke-width="2.5" />
        <span>Chat</span>
      </div>
    </div>

    <!-- Bottom Sheet -->
    <vue-bottom-sheet-vue2
      ref="myBottomSheet"
      @closed="handleBottomSheetClose()"
      :max-width="991"
      custom-class="my-modal"
      :z-index="2000"
    >

      <ol v-if="menuOpened === 'menu'" class="navigation">
        <div v-for="section in tabs" :key="section.name" class="parent">
          <li class="item section-header">
            <span>{{ section.name }}</span>
          </li>
          <li v-for="item in section.items" :key="item.name">
            <router-link :to="item.url" class="item" @click.native="close">
              <div class="icon-wrapper">
                <component
                  v-if="typeof item.icon !== 'string'"
                  :is="item.icon"
                  :size="20"
                />
                <img v-else :src="item.icon" alt="" />
              </div>
              <span>{{ item.name }}</span>
            </router-link>
          </li>
        </div>
      </ol>
      <ol v-else class="navigation">
        <div v-for="section in events" :key="section.name" class="parent">
          <li class="item section-header">
            <span>{{ section.name }}</span>
          </li>
          <li v-for="item in section.items" :key="item.name">
            <router-link :to="item.url" class="item" @click.native="close">
              <div class="icon-wrapper">
                <component
                  v-if="typeof item.icon !== 'string'"
                  :is="item.icon"
                  :size="20"
                />
                <img v-else :src="item.icon" alt="" />
              </div>
              <span>{{ item.name }}</span>
            </router-link>
          </li>
        </div>
      </ol>
    </vue-bottom-sheet-vue2>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import VueBottomSheetVue2 from "@webzlodimir/vue-bottom-sheet-vue2";
import {
  Menu,
  Home,
  Wallet,
  User,
  MessageSquare,
  Zap,
  Gamepad2,
  Heart,
  Flame,
  Sparkles,
  MonitorPlay,
  Trophy,
  Swords,
  Gift,
} from "lucide-vue";

import HeartIcon from "@/assets/images/heart_full.svg";
import OriginalsIcon from "@/assets/images/originals_icon.svg";
import EventsIcon from "@/assets/images/star.svg";
import SlotsIcon from "@/assets/images/slots.svg";
import CasinoIcon from "@/assets/images/casino.svg";
import DailyChallengesIcon from "@/assets/images/daily_challenge.svg";
import WeeklyRaceIcon from "@/assets/images/weekly_race.svg";
import PopularIcon from "@/assets/images/popular.svg";
import NewIcon from "@/assets/images/new.svg";
import LiveIcon from "@/assets/images/live.svg";
import RewardsIcon from "@/assets/images/gift_bold.svg";

export default {
  components: {
    VueBottomSheetVue2,
    Menu,
    Home,
    Wallet,
    User,
    MessageSquare,
  },
  data() {
    return {
      menuOpened: null,
      tabs: [
        {
          name: "Casino",
          url: "",
          icon: CasinoIcon,
          items: [
            {
              name: "99wiwi Originals",
              icon: OriginalsIcon,
              url: "/casino/originals",
            },
            {
              name: "Slots",
              icon: SlotsIcon,
              url: "/casino/slots",
              items: null,
            },
            {
              name: "Favourite",
              icon: HeartIcon,
              url: "/casino/slots?filter=favourite",
              items: null,
            },
            {
              name: "Popular",
              icon: PopularIcon,
              url: "/casino/slots?filter=popular",
              items: null,
            },
            {
              name: "New",
              icon: NewIcon,
              url: "/casino/slots?filter=new",
              items: null,
            },
            {
              name: "Live",
              icon: LiveIcon,
              url: "/casino/slots?filter=live",
              items: null,
            },
          ],
        },
        {
          name: "Earn More",
          url: "",
          icon: EventsIcon,
          items: [
            {
              name: "Races",
              icon: WeeklyRaceIcon,
              url: "/leaderboard",
            },
            {
              name: "Challenges",
              icon: DailyChallengesIcon,
              url: "/challenges",
              items: null,
            },
            {
              name: "Rewards",
              icon: RewardsIcon,
              url: "/rewards",
              items: null,
            },
          ],
        },
      ],
      events: [
        {
          name: "Earn More",
          url: "",
          icon: EventsIcon,
          items: [
            {
              name: "Races",
              icon: WeeklyRaceIcon,
              url: "/leaderboard",
            },
            {
              name: "Challenges",
              icon: DailyChallengesIcon,
              url: "/challenges",
              items: null,
            },
          ],
        },
      ],
    };
  },

  methods: {
    ...mapActions([
      "generalSetChatMobile",
      "modalsSetShow",
      "generalSetSupportMobile",
    ]),
    chatClick() {
      this.modalsSetShow(null);
      this.close();
      this.generalSetChatMobile(!this.generalChatMobile);
    },
    supportClick() {
      this.modalsSetShow(null);
      this.close();
      if (!this.authUser?.user) {
        this.modalsSetShow("Login");
        return;
      }
      this.generalSetSupportMobile(!this.supportMobile);
    },
    isActive(path) {
      return this.$route.path.startsWith(path);
    },
    open(whatToOpen) {
      if (this.menuOpened === whatToOpen) {
        this.close();
      } else {
        this.menuOpened = whatToOpen;
        this.$refs.myBottomSheet.open();
      }
    },
    handleBottomSheetClose() {
      this.menuOpened = null;
    },
    close() {
      this.modalsSetShow(null);
      this.menuOpened = null;
      this.$refs.myBottomSheet.close();
    },
    handleMenuClick(url) {
      this.modalsSetShow(null);
      this.close();
      this.generalSetChatMobile(false);

      if (url === "/profile") {
        if (!this.authUser?.user) {
          this.modalsSetShow("Login");
          return;
        }
      }

      if (url === "/wallet") {
        if (!this.authUser?.user) {
          this.modalsSetShow("Login");
          return;
        } else {
          this.modalsSetShow("Wallet");
          return;
        }
      }

      if (url !== this.$route.path) {
        this.$router.push(url);
      } else if (url === this.$route.path) {
        this.$router.push("/");
      }
    },
  },
  computed: {
    ...mapGetters(["authUser", "generalChatMobile", "supportMobile"]),
  },
};
</script>

<style lang="scss">
.mobile-menu {


  .my-modal {
    ol.navigation {
      min-height: 600px;
      font-weight: bold;
      font-size: 1.143rem;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      color: white;
      z-index: 10;
      margin-right: auto;
      gap: 8px;

      margin-left: 0;

      > div > a {
        width: 100%;
      }

      .parent {
        width: 100%;

        background: #22224a;
        border-radius: 8px;
        padding-bottom: 5px;

        > li span {
          text-transform: uppercase;
        }

        .item {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 12px 16px;
          width: 100%;
          cursor: pointer;
          color: #9ba0b4;
          transition: all 0.2s ease;
          text-decoration: none;

          .icon-wrapper {
            width: 24px;
            display: flex;
            align-items: center;
            justify-content: center;

            svg {
              stroke: currentColor;
              stroke-width: 2;
            }

            img {
              width: 20px;
              height: 20px;
              object-fit: contain;
              filter: grayscale(1) opacity(0.7);
            }
          }

          span {
            font-size: 13px;
            font-weight: 600;
          }

          &.router-link-exact-active,
          &.router-link-active {
            color: white;
            background: rgba(91, 70, 188, 0.1);

            .icon-wrapper {
              svg {
                stroke: #f6be2c;
              }
              img {
                filter: none;
                opacity: 1;
              }
            }
          }
        }

        > li {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 7px;

          height: 48px;

          background: #22224a;
          border-radius: 8px;
        }
      }
    }

    background: #090c1d !important;

    > main {
      background: #090c1d !important;
    }

    > header {
      border-bottom: 1px solid#1E1F44;
      box-shadow: none;
    }
  }
}

.mobile-menu {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: calc(65px + env(safe-area-inset-bottom));
  background: #090c1d !important;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  display: flex;
  justify-content: space-around;
  align-items: stretch; /* Stretch controls to full height */
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 39000;
  user-select: none;

  .control {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
    height: 65px; /* Fixed height for the interactive area */

    .control-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }

    svg {
      display: block;
      stroke: currentColor;
      stroke-width: 2.5;
    }

    span {
      font-size: 11px;
      font-weight: 600;
      line-height: 1;
    }

    &.active {
      color: #f6be2c;
    }
  }

  /* Specific style for the raised wallet button */
  .wallet-control {
    margin-top: -24px;
    position: relative;
    overflow: visible;

    .wallet-background-curve {
      position: absolute;
      top: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 68px;
      height: 68px;
      background: #090c1d;
      border-radius: 50%;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      z-index: 1;
    }

    .wallet-btn {
      position: relative;
      z-index: 2;
      width: 50px;
      height: 50px;
      background: #1f2235;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
      color: white;

      svg {
        stroke: currentColor;
      }
    }

    span {
      position: relative;
      z-index: 2;
    }

    &.active .wallet-btn {
      background: #25283d;
      color: #f6be2c;
    }
  }

  @media screen and (min-width: 991px) {
    display: none;
  }
}
</style>
