<template>
  <nav
    :class="
      'admin-sidebar visible'
    "
  >
    <div class="sidebar-header">
      <router-link to="/" class="logo-link">
        <img src="/img/growbit_text.svg" alt="Logo" class="sidebar-logo" />
      </router-link>
    </div>


    <div class="navigation-scroll">
      <ol class="navigation">
        <div
          class="sidebar-banner"
          @click="$router.push('/cases')"
          style="width: 100%; margin-bottom: 15px; cursor: pointer; border-radius: 8px; overflow: hidden;"
        >
          <img src="/img/sidebar_banner.png" alt="Jackpots" style="width: 100%; display: block;" />
        </div>
        <SidebarItem
          v-for="section in menuSections"
          :key="section.name"
          :item="section"
          :collapsed="false"
        />
      </ol>
    </div>

    <div class="sidebar-footer">
      <router-link to="/" class="back-link">
        <ExternalLink :size="16" />
        <span>Back to Site</span>
      </router-link>
    </div>
  </nav>
</template>

<script>
import {
  LayoutDashboard,
  Users,
  Share2,
  Tag,
  Wallet,
  BarChart2,
  Settings,
  CreditCard,
  MessageSquare,
  Trophy,
  Swords,
  RefreshCcw,
  Gamepad2,
  ExternalLink,
  Coins
} from "lucide-vue";
import SidebarItem from "@/components/sidebar/SidebarItem.vue";

export default {
  name: "AdminSidebar",
  components: {
    ExternalLink,
    SidebarItem,
  },
  data() {
    return {
      menuSections: [
        {
          name: "Main",
          items: [
            { name: "Dashboard", url: "/admin", icon: LayoutDashboard },
            { name: "Users", url: "/admin/users", icon: Users },
            { name: "Support", url: "/admin/support", icon: MessageSquare },
            { name: "Reports", url: "/admin/stats", icon: BarChart2 },
          ],
        },
        {
          name: "Financial",
          items: [
            { name: "Cashier", url: "/admin/cashier", icon: Wallet },
            { name: "Payments", url: "/admin/payments", icon: CreditCard },
            { name: "Affiliates", url: "/admin/affiliates", icon: Share2 },
            { name: "Promo", url: "/admin/promo", icon: Tag },
           // { name: "Exchange", url: "/admin/currencies", icon: RefreshCcw },
            { name: "Withdraws", url: "/admin/withdraws", icon: RefreshCcw },
          ],
        },
        {
          name: "Settings",
          items: [
            { name: "Slots", url: "/admin/slots", icon: Gamepad2 },
            { name: "Races", url: "/admin/leaderboard", icon: Trophy },
            { name: "Challenges", url: "/admin/challenges", icon: Swords },
            { name: "Banners", url: "/admin/banners", icon: Tag },
            { name: "Settings", url: "/admin/settings", icon: Settings },
            { name: "Coins", url: "/admin/coins", icon: Coins },
          ],
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/variables";

.admin-sidebar {
  width: 240px;

  flex-shrink: 0;
  height: 100vh;
  position: sticky;
  top: 0;
  transition: width ease 0.4s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #0c0b1c; // Match growbit_old .sidebar background
  z-index: 100;

  @media (max-width: 991px) {
    display: none;
  }

  .sidebar-header {
    height: 75px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    gap: 15px;
    background: #111026; // Match growbit_old .sidebar-header background
    width: 100%;

    .logo-link {
      flex-grow: 1;
      display: flex;
      align-items: center;
      .sidebar-logo {
        height: 36px;
        width: auto;
      }
    }

    .logo-link {
      flex-grow: 1;
      display: flex;
      align-items: center;
      .sidebar-logo {
        height: 36px;
        width: auto;
      }
    }

    .header-title {
      font-size: 1rem;
      font-weight: 800;
      color: white;
      text-transform: uppercase;
      letter-spacing: 1px;

      .highlight {
        color: #5b46bc; // Match growbit_old active color
      }
    }

  }

  .navigation-scroll {
    width: 100%;
    overflow-y: auto;
    flex-grow: 1;
    @media (max-width: 991px) {
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  ol.navigation {
    padding: 20px 15px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;

    .parent {
      background: #161533; // Match growbit_old .parent background
      border-radius: 8px;
      width: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 15px;
        cursor: pointer;
        width: 100%;

        .title {
          font-weight: 800;
          font-size: 0.85rem;
          text-transform: uppercase;
          color: #eeeeee;
          letter-spacing: 0.5px;
        }

        .right {
          color: #616498;
          display: flex;
          align-items: center;
        }
      }
    }

    .sub-items {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding-bottom: 5px;
    }

    .sub-item-link {
      height: 44px;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 15px;
      text-decoration: none;
      color: #616498;
      font-weight: 700;
      font-size: 0.9rem;
      transition: all 0.2s;

      .icon-wrapper {
        display: grid;
        place-content: center;
        width: 25px;
        height: 25px;

        svg {
          stroke: currentColor;
          fill: none;
        }
      }

      .text {
        flex-grow: 1;
      }

      &:hover,
      &.router-link-active {
        color: white;
        .icon-wrapper svg {
          stroke: white;
        }
      }

      &.router-link-active {
        // background: rgba(91, 70, 188, 0.1);
      }

      &.collapsed {
        justify-content: center;
        padding: 0;
        gap: 0;
      }
    }
  }

  .sidebar-footer {
    padding: 20px 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    background: #0c0b1c;

    .back-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px;
      border-radius: 8px;
      background: #161533;
      color: #eeeeee;
      text-decoration: none;
      font-weight: 800;
      font-size: 0.8rem;
      text-transform: uppercase;
      transition: all 0.2s;

      &:hover {
        background: #5b46bc;
        color: white;
      }
    }
  }
}
</style>
