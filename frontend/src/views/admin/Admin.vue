<template>
  <div v-if="show" class="admin-layout">
    <AdminSidebar />
    <div class="admin-main">
      <header class="admin-top-nav">
        <div class="header-left">
          <button class="mobile-toggle" @click="mobileSidebar = true">
            <Menu :size="24" />
          </button>
          <router-link to="/" class="admin-logo-wrapper">
            <img src="/img/betsweeps.png" alt="Logo" class="logo-large" />
          </router-link>
          <div class="nav-divider"></div>
          <h1 class="nav-title">Admin <span class="highlight">Panel</span></h1>
        </div>

        <div class="header-right">
          <!-- Profile/User info could go here -->
        </div>
      </header>

      <div class="admin-content-wrapper">
        <div class="admin-content">
          <transition name="page-fade" mode="out-in">
            <router-view />
          </transition>
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar Backdrop -->
    <transition name="fade">
      <div
        v-if="mobileSidebar"
        class="sidebar-backdrop"
        @click="mobileSidebar = false"
      ></div>
    </transition>

    <!-- Mobile Sidebar -->
    <transition name="slide">
      <AdminSidebar v-if="mobileSidebar" class="mobile-sidebar" />
    </transition>
  </div>
</template>

<script>
import AdminFilterNavbar from "@/components/admin/AdminFilterNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Menu } from "lucide-vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Admin",
  metaInfo: {
    title: "Admin Panel",
  },
  components: {
    AdminFilterNavbar,
    AdminSidebar,
    Menu,
  },
  data() {
    return {
      mobileSidebar: false,
    };
  },
  methods: {
    ...mapActions(["adminGetSupportChats"]),
  },
  created() {
    this.adminGetSupportChats();
  },
  computed: {
    show() {
      return sessionStorage.getItem("admin");
    },
    currentPageName() {
      const path = this.$route.path;
      if (path === "/admin") return "Dashboard";
      const parts = path.split("/");
      const last = parts[parts.length - 1];
      return last.charAt(0).toUpperCase() + last.slice(1);
    },
  },
  watch: {
    $route() {
      this.mobileSidebar = false;
    },
  },
};
</script>

<style scoped lang="scss">
.admin-layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: #0c0b1c; // Match user dashboard legacy background
  color: #eeeeee;
}

.admin-main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
}

.admin-top-nav {
  height: 75px;
  background: #111026;
  border-bottom: 2px solid #090c1d;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  position: sticky;
  top: 0;
  z-index: 90;

  @media (max-width: 991px) {
    padding: 0 15px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 25px;
    padding-left: 25px;

    @media (max-width: 991px) {
      padding-left: 0;
      gap: 15px;
    }

    .mobile-toggle {
      display: none;
      background: transparent;
      border: none;
      color: #5b46bc;
      cursor: pointer;
      padding: 0;

      @media (max-width: 991px) {
        display: flex;
        align-items: center;
      }
    }

    .admin-logo-wrapper {
  display: flex;
  align-items: center;
  /* Evitamos que el contenedor corte el logo al escalarlo */
  overflow: visible; 
  height: 100%;

  .logo-large {
    /* Subimos la altura base para compensar el aire de la imagen */
    height: 110px; 
    width: auto;
    object-fit: contain;
    
    /* Centrado visual: ajusta el margen negativo para alinear con "ADMIN PANEL" */
    margin-top: -5px; 
    
    /* Aplicamos escala para que el logo real se vea del tamaño correcto */
    transform: scale(1.3);
    transform-origin: left center;
    
    transition: transform 0.3s ease;

    @media (max-width: 500px) {
      /* En pantallas muy pequeñas, ajustamos la escala un poco menos */
      height: 90px;
      transform: scale(1.2);
    }

    &:hover {
      transform: scale(1.35);
    }
  }
}

    .nav-divider {
      width: 1px;
      height: 24px;
      background: #22224a;

      @media (max-width: 500px) {
        display: none;
      }
    }

    .nav-title {
      font-size: 0.95rem;
      font-weight: 900;
      color: #eeeeee;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      padding-left: 15px !important;
      margin: 0;
      display: flex;
      gap: 8px;

      @media (max-width: 500px) {
        font-size: 0.8rem;
        letter-spacing: 1px;
      }

      .highlight {
        color: #616498;
        font-weight: 600;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
  }
}

.admin-content-wrapper {
  padding: 30px;
  flex-grow: 1;
  overflow-y: auto;
  position: relative;

  @media (max-width: 991px) {
    padding: 15px;
  }
}

/* Transitions */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.25s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 150;
}

.mobile-sidebar {
  position: fixed !important;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 200;
  display: flex !important;
}
</style>
