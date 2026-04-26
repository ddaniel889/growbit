<template>
  <div class="parent" :class="{ collapsed: collapsed }">
    <li
      @click="handleClick"
      class="top"
      :class="{ collapsed: collapsed, open: open }"
    >
      <span class="title" :class="{ collapsed: collapsed }">{{
        item.name
      }}</span>
      <div class="right" :class="{ collapsed: collapsed }">
        <img
          :src="DropdownIcon"
          :style="{
            transform: open ? 'rotate(180deg)' : 'none',
          }"
          alt=""
        />
      </div>
    </li>
    <ol class="sub-items-list" v-show="open || collapsed">
      <router-link
        v-for="it in item.items"
        :key="it.name"
        :to="it.url"
        custom
        v-slot="{ navigate, isActive }"
      >
        <li
          @click="navigate"
          class="sub-item"
          :class="{ collapsed: collapsed, active: isActive }"
        >
          <div class="icon-wrapper">
            <component :is="it.icon"></component>
          </div>
          <div class="text" :class="{ collapsed: collapsed }">
            <span>{{ it.name }}</span>
            <span v-if="it.count" class="challenge-count">{{ it.count }}</span>
          </div>
        </li>
      </router-link>
    </ol>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import DropdownIcon from "@/assets/images/arrow.svg?url";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    collapsed: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const open = ref(true);
    const isTablet = ref(window.innerWidth <= 1700);

    const handleClick = () => {
      open.value = !open.value;
    };

    const updateIsMobile = () => {
      isTablet.value = window.innerWidth <= 1700;
    };

    onMounted(() => {
      window.addEventListener("resize", updateIsMobile);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", updateIsMobile);
    });

    return {
      isTablet,
      open,
      handleClick,
      DropdownIcon,
    };
  },
};
</script>

<style lang="scss" scoped>
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.challenge-count {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 5px;
  margin-left: auto;
  min-width: 22px;
  height: 18px;
  background: white;
  color: #0b0b1b;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 800;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

.parent {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 5px;
  flex-shrink: 0;

  &.collapsed {
    background: transparent;
  }

  li.top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    width: 100%;
    height: 48px;
    cursor: pointer;
    background: #161533;
    border-radius: 8px;
    margin-bottom: 5px;

    &.open {
      border-radius: 8px 8px 0 0;
      margin-bottom: 0;
    }

    > span.title {
      font-weight: 800;
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #ffffff;
      letter-spacing: 0.5px;
    }

    .right {
      margin-left: auto;
      display: flex;
      align-items: center;

      > img {
        width: 14px;
        height: 14px;
        opacity: 0.8;
        transition: transform 0.3s;
      }
    }
  }

  ol.sub-items-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: #111026;
    border-radius: 0 0 8px 8px;
    padding: 5px 0;
    margin-bottom: 10px;

    li.sub-item {
      display: flex;
      gap: 12px;
      align-items: center;
      padding: 9px 18px;
      cursor: pointer;
      color: #8c8ea9;
      font-weight: 700;
      font-size: 0.825rem;
      transition: all 0.2s;
      list-style: none;

      svg {
        flex-shrink: 0;
        width: 16px;
        height: 16px;
        stroke: currentColor;
        fill: none;
      }

      &:hover,
      &.active {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.04);
      }

      &.active {
        position: relative;
        &::after {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 20px;
          width: 3px;
          background: #5b46bc;
          border-radius: 0 4px 4px 0;
        }
      }
    }

    .text {
      display: flex;
      align-items: center;
      flex-grow: 1;
      font-weight: 600;
    }
  }
}
</style>
