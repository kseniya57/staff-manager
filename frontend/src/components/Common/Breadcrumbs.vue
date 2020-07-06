<template>
  <div class="df text--white">
    <span v-for="(item, index) in items" :key="item" class="df aic">
      <span
        @click.stop="go(item)"
        :class="`ttc ${isLast(index) && 'disabled'}`"
        >{{ text.menu[item] || item }}</span
      >
      <v-icon v-if="!isLast(index)" name="keyboard_arrow_right" />
    </span>
  </div>
</template>

<script>
export default {
  computed: {
    items() {
      return this.$route.path.split('/').slice(1);
    }
  },
  methods: {
    go(item) {
      const path = this.$route.path;
      this.$router.push(path.substr(0, path.indexOf(item) + item.length));
    },
    isLast(index) {
      return index + 1 === this.items.length;
    }
  }
};
</script>
