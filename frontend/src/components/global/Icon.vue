<template>
  <i
    :class="`material-icons icon text--${size}`"
    :style="`color: ${color}`"
    v-on="$listeners"
    >{{ name }}</i
  >
</template>

<script>
export default {
  props: {
    name: String,
    size: { default: 'md' },
    color: { default: 'gray' }
  }
};
</script>

<style lang="sass" scoped>
.icon
    font-feature-settings: 'liga'
    vertical-align: text-bottom
    font-weight: 900
    transition: $default-transition
    cursor: pointer
</style>
