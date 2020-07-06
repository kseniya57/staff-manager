<template>
  <div class="form-group">
    <span class="label" v-if="label">{{ label }}</span>
    <input
      class="input"
      :value="value"
      @input="e => $emit('input', e.target.value)"
      :style="inputStyle"
    />
  </div>
</template>

<script>
export default {
  props: ['value', 'label', 'inputStyle']
};
</script>
