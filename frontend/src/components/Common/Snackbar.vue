<template>
  <div class="snackbar df aic jcc">
    <span class="snackbar__text">{{ notification.content }}</span>
    <span class="snackbar__icon" v-text-color="isError ? 'error' : 'success'"
      >{{ isError ? '✖' : '✔︎' }}︎</span
    >
  </div>
</template>

<script>
export default {
  props: ['notification'],
  computed: {
    isError() {
      return this.notification.type === 'error';
    }
  }
};
</script>

<style lang="sass" scoped>
.snackbar
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05)
    border-radius: 6px
    padding: 2rem
    position: absolute
    top: 3rem
    right: 3rem
    background-color: #fefefe
    &__text
        color: $dark
        font-size: 1.5rem
        margin-right: 1rem
    &__icon
        font-size: 2rem
        cursor: pointer
</style>
