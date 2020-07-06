<template>
  <transition name="slide">
    <div
      v-if="activeMenu"
      class="context-menu box"
      :style="{ top: `${y}px`, left: `${x}px` }"
    >
      <component :is="menus[activeMenu]" @close="close" v-bind="data" />
    </div>
  </transition>
</template>

<script>
import { ActionsMenu, ProfileImageMenu } from '@/components/Menus';
import Vue from 'vue';
import closeable from '@/mixins/closeable';

export default {
  data: () => ({
    x: 0,
    y: 0,
    data: null,
    activeMenu: null,
    menus: {
      actions: ActionsMenu,
      profileImage: ProfileImageMenu
    }
  }),
  methods: {
    openContextMenu(e, name, data) {
      e.preventDefault();
      this.x = e.clientX;
      this.y = e.clientY;
      this.data = data;
      this.activeMenu = name;
    },
    close() {
      this.activeMenu = null;
    }
  },
  mixins: [closeable],
  mounted() {
    Vue.prototype.$showContextMenu = this.openContextMenu;
    Vue.prototype.$closeContextMenu = this.close;
  },
  computed: {
    isOpen() {
      return this.activeMenu;
    }
  }
};
</script>

<style lang="sass" scoped>
.context-menu
    z-index: 100
    position: fixed
    overflow: hidden
</style>
