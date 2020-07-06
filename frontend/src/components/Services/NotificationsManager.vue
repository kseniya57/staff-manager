<template>
  <div class="notifications__container">
    <v-fade-transition
      v-for="(notification, index) in notifications"
      :key="index"
    >
      <snackbar :notification="notification"></snackbar>
    </v-fade-transition>
  </div>
</template>

<script>
import { Snackbar } from '@/components/Common';
import Vue from 'vue';
import { VFadeTransition } from '@/components/Transitions';
export default {
  data: () => ({
    notifications: []
  }),
  components: {
    Snackbar,
    VFadeTransition
  },
  created() {
    Vue.prototype.$showError = this.showError.bind(this);
  },
  methods: {
    showError(e) {
      const notification = {
        id: +new Date().getSeconds(),
        type: 'error',
        content: e.message || e
      };
      this.notifications.push(notification);
      notification.timeout = setTimeout(() => {
        this.notifications = this.notifications.filter(
          item => item.id !== notification.id
        );
      }, 5000);
    }
  }
};
</script>
