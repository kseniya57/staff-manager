<template>
  <div id="app">
    <Main v-if="isAuthenticated" />
    <Auth v-else />
    <notifications-manager />
  </div>
</template>

<script>
import Auth from '@/views/Auth';
import Main from '@/layouts/Main';
import { mapGetters } from 'vuex';
import { NotificationsManager } from '@/components/Services';

export default {
  components: {
    Auth,
    Main,
    NotificationsManager
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  }
};
</script>
