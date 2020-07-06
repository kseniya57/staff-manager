<template>
  <div class="form-group">
    <span v-if="label" class="label">{{ label }}</span>
    <textarea
      ref="textarea"
      class="textarea"
      style="resize: none"
      @input="e => $emit('input', e.target.value)"
      :value="value"
      v-bind="$attrs"
      v-on="listeners"
    ></textarea>
  </div>
</template>

<script>
export default {
  props: ['value', 'label'],
  data: () => ({
    minHeight: 50
  }),
  mounted() {
    this.resize();
  },
  methods: {
    resize: function() {
      this.$refs.textarea.style.setProperty('height', 'auto');
      let contentHeight = this.$refs.textarea.scrollHeight + 1;
      if (this.minHeight) {
        contentHeight =
          contentHeight < this.minHeight ? this.minHeight : contentHeight;
      }
      if (this.maxHeight) {
        if (contentHeight > this.maxHeight) {
          contentHeight = this.maxHeight;
          this.maxHeightScroll = true;
        } else {
          this.maxHeightScroll = false;
        }
      }
      const heightVal = contentHeight + 'px';
      this.$refs.textarea.style.setProperty('height', heightVal);
      return this;
    }
  },
  watch: {
    value() {
      this.$nextTick(this.resize);
    }
  },
  computed: {
    listeners() {
      return Object.entries(this.$listeners).reduce(
        (map, [event, listener]) =>
          Object.assign(map, event === 'input' ? {} : { [event]: listener }),
        {}
      );
    }
  }
};
</script>
