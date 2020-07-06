<template>
  <span
    :class="`tag dif aic jcc text--white ${removable && 'removable'}`"
    v-color="tag.color || 'primary'"
    v-on="$listeners"
  >
    {{ tag.name }}
    <v-icon
      v-if="removable"
      name="close"
      class="dif aic jcc pointer"
      v-circle="1.3"
      v-ml="1"
      size="xxs"
      v-color="'white'"
      color="black"
      @click.stop="$emit('remove')"
    ></v-icon>
  </span>
</template>

<script>
export default {
  props: {
    tag: { required: true },
    removable: { default: true }
  }
};
</script>

<style lang="sass" scoped>
.tag
    padding: .5rem .8rem
    border-radius: 1rem
    min-width: 3rem

    &.removable
        padding-right: .5rem
</style>
