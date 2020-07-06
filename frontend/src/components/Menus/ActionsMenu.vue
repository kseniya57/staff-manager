<template>
  <div class="menu-list df fdc">
    <span
      v-for="action in actions"
      class="menu-list__item dif aic"
      @click.stop="onClick(action)"
      :key="action.name"
    >
      <v-icon :name="action.icon" v-mr="1" />
      {{ text.actions[action.name] || action.name }}
    </span>
  </div>
</template>

<script>
export default {
  props: { actions: { required: true } },
  methods: {
    onClick({ action }) {
      action && action();
      this.$emit('close');
    }
  }
};
</script>
