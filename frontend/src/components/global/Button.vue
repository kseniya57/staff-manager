<template>
  <button :class="`btn btn--${type}`" v-on="$listeners">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    type: { default: 'flat' }
  }
};
</script>

<style lang="sass" scoped>
.btn
    &, &:link, &:visited
        border: none
        background-color: $primary
        color: $white
        font-weight: 700
        transition: $default-transition
        will-change: box-shadow
        box-shadow: 0 .3rem .1rem -.2rem rgba($dark, .2), 0 .2rem rgba($dark, .14), 0 .1rem .5rem 0 rgba($dark, .12)
        cursor: pointer
        text-decoration: none
        text-align: center
        display: inline-flex
        justify-content: center
        align-items: center
        align-self: center
        text-transform: capitalize
        font-size: 1.4rem
        vertical-align: middle
        user-select: none

    &--flat
      &, &:link, &:visited
        padding: 0 1.6rem
        height: 3.6rem
        min-width: 8.8rem
        border-radius: .2rem

    &--transparent
      &, &:link, &:visited
        background-color: transparent
        color: $text-color--base
        border: 1px solid #DCDFE6
        border-radius: .4rem
        box-shadow: none
        font-weight: 300
        height: 4rem

    &--circle
        @include circle(3rem)

    &:hover
        transform: translateY(-.2rem)
        box-shadow: 0 1rem 2rem rgba($dark, .2)

    &:active, &:focus
        transform: translateY(-.1rem)
        box-shadow: 0 .5rem .5rem -.3rem rgba($dark, .2), 0 .8rem 1rem .1rem rgba($dark, .14), 0 .3rem 1.4rem .2rem rgba($dark, .12)
</style>
