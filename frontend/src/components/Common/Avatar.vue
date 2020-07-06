<template>
  <div class="user" v-circle="2" v-on="$listeners">
    <v-image class="user__avatar" :src="user.avatar" v-circle="2" />
    <div class="user__details details df fdc fww">
      <div class="details__avatar-container">
        <v-image class="details__avatar" :src="user.avatar" v-circle="3" />
      </div>
      <span class="text--bold details__name">{{ user.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['user']
};
</script>

<style lang="sass" scoped>
.user
    position: relative

    &__details
        position: absolute
        top: -5.5rem
        right: -13rem
        height: 5rem
        width: 12rem
        padding: .5rem
        background-color: $white
        border-radius: .6rem .6rem .6rem 0
        opacity: 0
        transform: translateY(50%) scaleY(0)
        transition: $default-transition

        &::after
            content: ''
            position: absolute
            left: -1rem
            bottom: 0
            border: .5rem solid $white
            border-left-color: transparent
            border-top-color: transparent

    &:hover
        .user__details
            opacity: 1
            transform: translateY(0) scaleY(1)

    .details
        &__avatar-container
            height: 100%
</style>
