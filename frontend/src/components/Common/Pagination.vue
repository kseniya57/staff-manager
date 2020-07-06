<template>
  <div class="pagination df aic jcc" v-if="count > 1">
    <v-icon
      name="keyboard_arrow_left"
      class="pagination__item"
      @click.stop="$emit('input', value - 1)"
      v-if="value > 1"
    ></v-icon>
    <span
      class="pagination__item"
      v-if="value > 1"
      @click.stop="$emit('input', 1)"
      >1</span
    >
    <span class="pagination__item" v-if="value > 2">...</span>
    <span class="pagination__item active">{{ value }}</span>
    <span class="pagination__item" v-if="value < count - 1">...</span>
    <span
      class="pagination__item"
      @click.stop="$emit('input', count)"
      v-if="value < count"
      >{{ count }}</span
    >
    <v-icon
      name="keyboard_arrow_right"
      class="pagination__item"
      @click.stop="$emit('input', value + 1)"
      v-if="value < count"
    ></v-icon>
  </div>
</template>

<script>
export default {
  props: {
    count: Number,
    value: Number
  }
};
</script>

<style scoped lang="sass">
.pagination
  margin-top: 1rem
  &__item
    width: 4rem
    height: 3rem
    border-right: $devider
    color: $dark
    background-color: $light
    display: inline-flex
    align-items: center
    justify-content: center
    cursor: pointer
    &.active
      background-color: $primary
      color: $white
    &:first-child
      border-bottom-left-radius: .3rem
      border-top-left-radius: .3rem
    &:last-child
      border-bottom-right-radius: .3rem
      border-top-right-radius: .3rem
</style>
