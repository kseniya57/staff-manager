<template>
  <span
    class="toggle"
    role="checkbox"
    tabindex="0"
    :aria-checked="value"
    @click.stop="toggle"
    @keydown.space.prevent="toggle"
    v-color="'accent'"
  >
  </span>
</template>

<script>
export default {
  props: ['value'],
  methods: {
    toggle() {
      this.$emit('input', !this.value);
    }
  }
};
</script>

<style lang="sass" scoped>
.toggle
    width: 3.5rem
    height: 2rem
    border-radius: 1rem
    position: relative

    &::after
        position: absolute
        left: 0
        top: -.2rem
        content: ''
        width: 2.4rem
        height: 2.4rem
        border-radius: 50%
        background-color: $white
        transition: left .2s ease

    &[aria-checked="true"]
        &::after
            left: calc(100% - 2.4rem)
</style>
