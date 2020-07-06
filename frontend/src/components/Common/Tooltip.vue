<script>
export default {
  props: {
    message: { required: true },
    position: { default: 'bottom' },
    tag: { default: 'div' }
  },
  data: () => ({
    visible: false,
    tooltip: null
  }),
  methods: {
    show() {
      this.visible = true;
    },
    dismiss() {
      this.visible = false;
    }
  },
  render(h) {
    if (!this.tooltip) {
      this.tooltip = h(
        'span',
        {
          class: `tooltip tooltip--${this.position}`
        },
        [this.message]
      );
    }
    return h(
      this.tag,
      {
        class: 'relative',
        on: {
          ...this.$listeners,
          mouseenter: () => (this.visible = true),
          mouseleave: () => (this.visible = false)
        }
      },
      (this.$slots.default || []).concat(this.visible ? [this.tooltip] : [])
    );
  }
};
</script>

<style lang="sass" scoped>
.tooltip
    position: absolute
    padding: .2rem .4rem
    background-color: rgba(#000000, .8)
    color: rgba($white, .8)
    border-radius: .6rem
    font-size: 1rem
    &--bottom
        bottom: 0
        left: 50%
        transform: translate(-50%, calc(100% + .5rem))
    &--top
        top: 0
        left: 50%
        transform: translate(-50%, calc(-100% - .5rem))
    &--right
        right: 0
        top: 50%
        transform: translate(calc(100% + .5rem), -50%)
    &--left
        left: 0
        top: 50%
        transform: translate(calc(-100% - .5rem), -50%)
</style>
