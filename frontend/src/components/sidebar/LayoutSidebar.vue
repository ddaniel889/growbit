<template>
  <nav
    :class="
      'sidebar visible ' +
      (mobileToggle ? 'mobileToggle' : '')
    "
    @click="mobileToggle = false"
  >
    <div class="sidebar-header">
      <div class="toggle">
        <img src="@/assets/images/menu.svg" />
      </div>
    </div>

    <ol class="navigation">
      <div
        class="sidebar-banner"
        @click="$router.push('/cases')"
      >
        <img src="/img/sidebar_banner.png" alt="Jackpots" />
      </div>
      <SidebarItem
        :item="tab"
        :collapsed="false"
        v-for="tab in tabs"
        :key="tab.name"
      />
    </ol>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";

import OriginalsImage from "@/assets/images/Growbit_G.webp";
import PopularIcon from "@/assets/images/popular.svg?inline";
import LiveIcon from "@/assets/images/live.svg?inline";
import RewardsIcon from "@/assets/images/gift_bold.svg?inline";
import DailyChallengesIcon from "@/assets/images/star.svg?inline";
import WeeklyRaceIcon from "@/assets/images/weekly_race.svg?inline";
import SidebarItem from "@/components/sidebar/SidebarItem.vue";
import SlotsIcon from "@/assets/images/slots.svg?inline";
import BombIcon from "@/assets/images/bomb_icon.svg?inline";
import BoxIcon from "@/assets/images/box.svg?inline";
import PvpIcon from "@/assets/images/pvp.svg?inline";
import {
  Tv,
  Disc,
  Layers,
  Diamond,
  Zap,
  TrendingUp,
  Crosshair,
  BarChart2,
  Globe,
  Coins,
  Gamepad2,
  ChevronDown,
} from "lucide-vue";

const GrowbitG = {
  render(h) {
    return h("img", {
      attrs: { src: OriginalsImage },
      style: { width: "22px", height: "auto" },
    });
  },
};

export default {
  components: {
    SidebarItem,
    Tv,
    Disc,
    Layers,
    Diamond,
    Zap,
    TrendingUp,
    Crosshair,
    BarChart2,
    Globe,
    Coins,
    Gamepad2,
    ChevronDown,
  },
  data() {
    return {
      mobileToggle: false,
    };
  },
  computed: {
    ...mapGetters(["authUser", "challengesData"]),
    tabs() {
      return [
        // ── CASINO ──────────────────────────────────────────────
        {
          name: "Casino",
          url: "",
          items: [
            { name: "Growbit Games", icon: GrowbitG, url: "/casino/originals" },
            {
              name: "Popular",
              icon: PopularIcon,
              url: "/casino/slots?filter=popular",
            },
            { name: "Slots", icon: SlotsIcon, url: "/casino/slots" },
          ],
        },

        // ── EARN MORE ────────────────────────────────────────────
        {
          name: "Earn More",
          url: "",
          items: [
            {
              name: "Weekly Race",
              icon: WeeklyRaceIcon,
              url: "/leaderboard",
            },
            {
              name: "Challenges",
              icon: DailyChallengesIcon,
              url: "/challenges",
              count: this.challengesData?.active?.length || null,
            },
            {
              name: "Rewards",
              icon: RewardsIcon,
              url: "/rewards",
            },
            {
              name: "Vip Club",
              icon: RewardsIcon,
              url: "/rewards",
            }
          ],
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/variables";

.sidebar-banner {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 20px;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  flex-shrink: 0;

  &.collapsed {
    img {
      object-fit: cover;
      height: 45px;
      border-radius: 8px;
    }
  }

  img {
    width: 100%;
    display: block;
  }
}

.sidebar {
  width: 240px;
  &.collapsed {
    width: 65px;
  }
  .mode-switch {
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;

    .casino,
    .sports {
      width: 100%;
      background: transparent;
      border: none;
      padding: 0;
      cursor: pointer;

      & > div {
        min-height: 40px;
        width: 100%;
        flex-grow: 1;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #161533;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: 5px;

        span {
          font-weight: 800;
          font-size: 14px;
          text-align: center;
          text-transform: uppercase;
          color: #ffffff;
          text-shadow: 0px 3px 3px rgba(0, 0, 0, 0.5);
        }
      }
    }

    .casino.active > div {
      background-color: #5b46bc;
    }
  }

  flex-shrink: 0;
  z-index: 99;
  transition: width ease 0.4s;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #0c0b1c;
  @media (max-width: 991px) {
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .hidden {
    display: none;
  }

  &.mobileToggle {
    display: block !important;
    width: 250px;
    opacity: 1;
  }

  .sidebar-header {
    height: $header-height;
    display: flex;
    align-items: center;
    align-self: flex-start;
    justify-content: flex-start;
    margin-right: auto;
    background: #111026;
    width: 100%;

    @media (max-width: 991px) {
      display: none !important;
    }

    .toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 100%;
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
}

@media (max-width: 991px) {
  .sidebar {
    display: none;
  }
}

ol.navigation {
  border-right: 2px solid #121129;
  font-weight: 700;
  font-size: 1rem;
  padding: 10px 15px 0 15px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  color: white;
  z-index: 10;
  margin-right: auto;
  gap: 12px;
  background: #0c0b1c;
  flex: 1;
  margin-left: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 40px;
  @media (max-width: 991px) {
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  > div > a {
    width: 100%;
  }
}
</style>
