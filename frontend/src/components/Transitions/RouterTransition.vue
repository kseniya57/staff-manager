<template>
  <transition
    :name="transitionName"
    :mode="transitionMode"
    :enter-active-class="transitionEnterActiveClass"
    @beforeLeave="beforeLeave"
    @enter="enter"
    @afterEnter="afterEnter"
  >
    <slot />
  </transition>
</template>

<script>
export default {
  data: () => ({
    prevHeight: 0,
    transitionName: 'slide',
    transitionMode: 'out-in',
    transitionEnterActiveClass: ''
  }),
  created() {
    this.$router.beforeEach((to, from, next) => {
      const toDepth = to.path.split('/').length;
      const fromDepth = from.path.split('/').length;
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
      this.transitionEnterActiveClass = `${this.transitionName}-enter-active`;
      next();
    });
  },
  methods: {
    beforeLeave(element) {
      this.prevHeight = getComputedStyle(element).height;
    },
    enter(element) {
      const { height } = getComputedStyle(element);

      element.style.height = this.prevHeight;

      setTimeout(() => {
        element.style.height = height;
      });
    },
    afterEnter(element) {
      element.style.height = null;
    }
  }
};
</script>

<style lang="sass" scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active
    transition-duration: .5s
    transition-property: height, opacity, transform
    transition-timing-function: cubic-bezier(.55, 0, .1, 1)
    overflow: hidden

.slide-left-enter,
.slide-right-leave-active
    opacity: 0
    transform: translate(2em, 0)

.slide-left-leave-active,
.slide-right-enter
    opacity: 0
    transform: translate(-2em, 0)
</style>
