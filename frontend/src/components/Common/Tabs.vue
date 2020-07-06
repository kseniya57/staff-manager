<script>
export default {
  props: {
    items: { required: true },
    position: { default: 'left' }
  },
  data: () => ({
    activeIndex: 0
  }),
  render(h) {
    const tabs = h(
      'div',
      {
        class: 'tabs df fdc',
        style: { backgroundColor: this.colors.primary, [this.position]: '2rem' }
      },
      this.items.map((item, index) =>
        h(
          'i',
          {
            class: `material-icons tabs__item pointer ${this.activeIndex ===
              index && 'active'}`,
            on: {
              click: () => {
                this.activeIndex = index;
                this.$emit('input', index);
              }
            }
          },
          item.icon || item
        )
      )
    );
    return h(
      'div',
      {
        class: 'tabs__container box df',
        style: { [`padding-${this.position}`]: '10rem' }
      },
      [tabs, this.$slots.default[this.activeIndex]]
    );
  }
};
</script>

<style lang="sass" scoped>
.tabs
    border-radius: 1rem
    position: absolute
    top: -1rem
    bottom: -1rem
    width: 5rem

    &__container
        width: 100%
        position: relative
        padding: 2rem
        border: $devider

        & > div:nth-child(2)
            width: 100%
            overflow-y: auto

    &__item
        padding: 1rem
        text-align: center
        color: $white
        transition: $default-transition

        &.active
            color: $secondary
</style>
