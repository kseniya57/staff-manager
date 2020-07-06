<template>
  <img :src="$getImage(src)" v-on="$listeners" />
</template>

<script>
export default {
  props: ['src']
};
</script>
