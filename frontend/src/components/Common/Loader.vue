<template functional>
  <span class="loader__wrapper">
    <span class="loader"></span>
  </span>
</template>

<style scoped lang="sass">
.loader
    display: block
    position: relative
    left: 50%
    top: 50%
    width: 10rem
    height: 10rem
    margin-left: -5rem
    margin-top: -5rem
    border-radius: 50%
    border: .3rem solid transparent
    border-top-color: $accent
    animation: spin 2s linear infinite

    &__wrapper
        position: fixed
        top: 0
        left: 0
        width: 100%
        height: 100%

    &::before, &::after
        content: ''
        position: absolute
        border: .3rem solid transparent
        border-radius: 50%

    &::before
        top: .5rem
        left: .5rem
        right: .5rem
        bottom: .5rem
        border-top-color: darken($accent, 10%)
        animation: spin 3s linear infinite

    &::after
        top: 1.5rem
        left: 1.5rem
        right: 1.5rem
        bottom: 1.5rem
        border-top-color: lighten($accent, 10%)
        animation: spin 1.5s linear infinite

    @keyframes spin
        0%
            transform: rotate(0deg)
        100%
            transform: rotate(360deg)
</style>
