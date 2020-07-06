<template>
  <div class="df aic jcc">
    <v-icon
      v-for="i in 10"
      v-mr="0.3"
      :key="i"
      name="star"
      v-text-color="i <= value ? 'yellow' : 'gray'"
      @click.stop="$emit('input', i)"
    ></v-icon>
  </div>
</template>

<script>
export default {
  props: ['value']
};
</script>

<style scoped lang="sass"></style>
