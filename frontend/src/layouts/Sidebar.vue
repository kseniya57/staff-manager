<template>
  <v-slide-x-transition>
    <div class="sidebar" v-color="'base'" v-if="value">
      <div class="sidebar__header-block df jcc aic">
        <img :src="logo" class="sidebar__logo" />
      </div>
      <account-box :user="user" @update="updateAvatar" />
      <div class="menu">
        <div v-for="item in menu" :key="item.name">
          <a
            class="menu__item df aic"
            :class="item.active && 'active'"
            @click.stop="clickMenuItem(item)"
          >
            <v-icon :name="item.icon" v-mr="1" size="lg"></v-icon>
            <span>{{ text.menu[item.name] }}</span>
          </a>
          <v-expand-transition>
            <div class="menu__sub" v-show="item.active && item.children">
              <a
                class="menu__item df aic"
                :class="child.active && 'active'"
                v-for="child in item.children"
                :key="child.name"
                @click.stop="clickSubmenuItem(item, child)"
              >
                <v-icon
                  :name="child.icon"
                  v-mr="1"
                  :color="child.active ? 'primary' : 'dark'"
                  size="lg"
                ></v-icon>
                <span class="ttc">{{ text.menu[child.name] }}</span>
              </a>
            </div>
          </v-expand-transition>
        </div>
      </div>
    </div>
  </v-slide-x-transition>
</template>

<script>
import { mapGetters } from 'vuex';
import AccountBox from '../components/AccountBox';
import { VExpandTransition, VSlideXTransition } from '@/components/Transitions';
import { GQL_UPDATE_USER } from '@/graphql';
import logo from '@/assets/images/logo.svg';

export default {
  props: {
    value: Boolean
  },
  components: {
    AccountBox,
    VExpandTransition,
    VSlideXTransition
  },
  data() {
    const routeName = this.$route.name;
    return {
      logo,
      menu: [
        {
          name: 'home',
          icon: 'home',
          link: '/',
          active: routeName === 'home'
        },
        {
          name: 'departments',
          icon: 'group_work',
          link: '/departments',
          active: routeName === 'departments'
        },
        {
          name: 'positions',
          icon: 'work',
          link: '/positions',
          active: routeName === 'positions'
        },
        {
          name: 'users',
          icon: 'people',
          link: '/users',
          active: routeName === 'users'
        },
        {
          name: 'settings',
          icon: 'settings',
          active: false,
          children: [
            {
              name: 'socialNetworks',
              icon: 'public',
              link: '/socialNetworks',
              active: routeName === 'socialNetworks'
            },
            {
              name: 'rights',
              icon: 'security',
              link: '/rights',
              active: routeName === 'rights'
            },
            {
              name: 'roles',
              icon: 'camera_roll',
              link: '/roles',
              active: routeName === 'roles'
            },
            {
              name: 'bonuses',
              icon: 'card_giftcard',
              link: '/bonuses',
              active: routeName === 'bonuses'
            },
            {
              name: 'expenses',
              icon: 'laptop',
              link: '/expenses',
              active: routeName === 'expenses'
            }
          ]
        },
        {
          name: 'payrolls',
          icon: 'attach_money',
          link: '/payrolls',
          active: routeName === 'payrolls'
        }
      ]
    };
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    clickMenuItem(item) {
      const activeItem = this.menu.find(item => item.active);
      if (activeItem) {
        if (item.name === activeItem.name) {
          if (item.children) {
            item.active = false;
          }
          return;
        }
        activeItem.active = false;
        if (activeItem.children) {
          activeItem.children.forEach(child => (child.active = false));
        }
      }
      item.active = true;
      if (item.link) {
        this.$router.push(item.link);
      }
    },
    clickSubmenuItem(item, child) {
      if (child.active) {
        return;
      }
      const activeItem = item.children.find(item => item.active);
      if (activeItem) {
        this.$set(activeItem, 'active', false);
      }
      this.$set(child, 'active', true);
      this.$router.push(child.link);
    },
    updateAvatar({ avatar }) {
      this.$set(this.user, 'avatar', avatar);
      this.$apollo.mutate({
        mutation: GQL_UPDATE_USER,
        variables: {
          id: this.user.id,
          input: { avatar }
        }
      });
    }
  }
};
</script>

<style lang="sass" scoped>
.sidebar
    width: $sidebar-width
    height: calc(100vh - #{$header-height})
    border-right: $devider
    &__header-block
      height: $header-height
      border-bottom: $devider
    &__logo
      width: 4rem

    .menu
        &__item
            padding: 1.5rem 2rem
            cursor: pointer
            transition: background-color .3s ease
            border-bottom: $devider

            &.active
                background-color: $primary
                color: $white

        &__sub
            background-color: $white
            box-shadow: $default-shadow

            .menu__item.active
                background-color: $base--2
</style>
