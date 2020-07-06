<template>
  <div class="lang-select df jcc aic">
    <ul
      class="lang-select__list df fdc aic"
      :style="{
        height: `${languages.length * 100}%`,
        top: `${-100 * activeIndex}%`
      }"
    >
      <li
        :class="
          `lang-select__option df aic jcc ${index === activeIndex && 'active'}`
        "
        v-for="(option, index) in languages"
        :key="index"
      >
        {{ option }}
      </li>
    </ul>
    <span class="lang-select__controls df fdc aic jcsb">
      <v-icon name="keyboard_arrow_up" @click.stop="go(-1)" />
      <v-icon name="keyboard_arrow_down" @click.stop="go(1)" />
    </span>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapGetters(['lang', 'languages']),
    activeIndex() {
      return this.languages.findIndex(value => value === this.lang);
    }
  },

  methods: {
    ...mapMutations(['setLang']),
    go(direction) {
      const index =
        (this.activeIndex + direction + this.languages.length) %
        this.languages.length;
      this.setLang(this.languages[index]);
    }
  }
};
</script>

<style lang="sass" scoped>
.lang-select
    overflow: hidden
    position: relative
    width: 3.5rem

    &__list
        padding: 0 .2rem
        position: absolute
        left: 0
        width: 100%
        transition: $default-transition

    &__option
        flex: 1
        text-transform: uppercase

    &__controls
        height: 100%
        i
            cursor: pointer
            &:hover
                color: $dark!important
            &:first-child
                transform: translateY(.3rem)

            &:last-child
                transform: translateY(-.3rem)
</style>
