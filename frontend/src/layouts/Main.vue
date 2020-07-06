<template>
  <div v-color="'base'">
    <div class="df">
      <Sidebar v-model="sidebar" />
      <div class="container">
        <Header @toggleSidebar="sidebar = !sidebar" :sidebarState="sidebar" />
        <router-transition>
          <router-view :key="$route.path" />
        </router-transition>
      </div>
    </div>
    <modal-manager />
    <context-menu-manager />
    <file-uploader />
  </div>
</template>

<script>
import Header from '@/layouts/Header';
import Sidebar from '@/layouts/Sidebar';
import { RouterTransition } from '@/components/Transitions';

import {
  ModalManager,
  ContextMenuManager,
  FileUploader
} from '@/components/Services';

export default {
  data: () => ({
    sidebar: true
  }),
  components: {
    ModalManager,
    ContextMenuManager,
    FileUploader,
    Header,
    Sidebar,
    RouterTransition
  }
};
</script>

<style lang="sass" scoped>
.theme
    &-button
        position: absolute
        bottom: 1rem
        left: 1rem
</style>
