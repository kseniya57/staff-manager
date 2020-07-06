<template>
  <div class="form-group">
    <span v-if="label" class="label">{{ label }}</span>
    <input
      class="input"
      :value="model | money"
      @keydown.prevent="input"
      style="color: transparent;text-shadow: 0 0 0 gray;outline: none;"
      :style="inputStyle"
      v-bind="$attrs"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: { default: 0 },
    label: String,
    inputStyle: String,
    max: {
      type: Number,
      default: Number.MAX_SAFE_INTEGER
    }
  },
  data: () => ({
    model: ''
  }),
  mounted() {
    this.model = this.value;
  },
  methods: {
    input(e) {
      const { key } = e;
      const stringValue = this.model + '';
      if (/\d/.test(key)) {
        this.model = Math.min(+(stringValue + key), this.max);
        this.$emit('input', this.model);
      } else if (key === 'Backspace') {
        this.model = +stringValue.substring(0, stringValue.length - 1);
        this.$emit('input', this.model);
      }
    }
  },
  watch: {
    value() {
      this.model = this.value;
    }
  }
};
</script>
