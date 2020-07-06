<template>
  <header class="header df ais" v-color="'base'">
    <div class="header__block" v-px="1">
      <v-icon name="menu" size="lg" @click="$emit('toggleSidebar')"></v-icon>
    </div>
    <breadcrumbs class="header__block expanded" v-ml="2" />
    <!--    <dropdown width="20rem" class="header__block">-->
    <!--      <template-->
    <!--        slot="activator"-->
    <!--        scope="{ active }"-->
    <!--        :class="`ttc ${active && 'active'}`"-->
    <!--      >-->
    <!--        <v-icon name="notifications" :color="active ? 'accent' : 'white'" />-->
    <!--      </template>-->
    <!--      <div slot="content" class="header__cards-container"></div>-->
    <!--    </dropdown>-->
    <!--    <dropdown width="20rem" class="header__block">-->
    <!--      <template-->
    <!--        slot="activator"-->
    <!--        scope="{ active }"-->
    <!--        :class="`ttc ${active && 'active'}`"-->
    <!--      >-->
    <!--        <v-icon name="dialpad" :color="active ? 'accent' : 'white'" />-->
    <!--      </template>-->
    <!--      <div slot="content" class="header__cards-container"></div>-->
    <!--    </dropdown>-->
    <full-screen-icon class="header__block" v-px="1"></full-screen-icon>
    <!--    <div class="header__block">-->
    <!--      <lang-select class="fullheight" />-->
    <!--    </div>-->
    <div
      class="header__block header__exit pointer"
      @click.stop="$store.commit('logout')"
    >
      <v-icon name="exit_to_app" size="lg" />
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';
import Breadcrumbs from '@/components/Common/Breadcrumbs';
//import Dropdown from '@/components/Common/Dropdown';
//import LangSelect from '@/components/LangSelect';
import FullScreenIcon from '@/components/FullScreen';

export default {
  props: {
    sidebarState: Boolean
  },
  components: {
    Breadcrumbs,
    //Dropdown,
    //LangSelect,
    FullScreenIcon
  },
  computed: {
    ...mapGetters(['user'])
  }
};
</script>

<style lang="sass" scoped>
.header
    border-bottom: $devider
    height: $header-height

    &__cards-container
        padding: 1rem
        text-align: left
        max-height: 50vh
        overflow-y: scroll

    &__card
        margin-bottom: 1rem

    &__exit
        padding: 0 1rem

        &:hover > i
            color: $dark !important

    &__block
        border-right: $devider
        display: flex
        align-items: center
        text-align: center
</style>
