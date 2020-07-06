<template>
  <div class="fullheight">
    <loader v-if="loading" />
    <div v-else class="df fullheight ais auth">
      <!--      <Background class="auth__left" name="auth-bg" ext="jpg"></Background>-->
      <div class="df aic jcc auth__left">
        <form class="df aic jcc fdc auth__form" @submit.prevent="mutate">
          <img :src="logo" class="auth__logo" v-mb="4" />
          <input
            class="input auth__input"
            type="email"
            v-model="authData.email"
            :placeholder="text.users.email"
          />
          <input
            class="input auth__input"
            type="password"
            v-model="authData.password"
            :placeholder="text.users.password"
          />
          <v-button v-mb="2">{{ text.auth.login }}</v-button>
        </form>
      </div>
      <div class="expanded auth__figure"></div>
    </div>
  </div>
</template>

<script>
import { AUTH_TOKEN } from '../constants';
import Loader from '@/components/Common/Loader';
import logo from '@/assets/images/logo.svg';
import { GQL_CHECK, GQL_LOGIN } from '@/graphql';

const TOKEN = localStorage.getItem(AUTH_TOKEN);

export default {
  components: {
    Loader
  },
  data: () => ({
    authData: {},
    authOutput: null,
    loading: false,
    logo
  }),
  apollo: {
    authOutput: {
      query: GQL_CHECK,
      variables: {
        token: TOKEN
      },
      skip: !TOKEN || TOKEN === 'undefined',
      update: data => data.check,
      error: () => {
        localStorage.removeItem(AUTH_TOKEN);
      }
    }
  },
  watch: {
    authOutput(value) {
      const { user } = value || {};
      if (user) {
        this.$store.commit('login', user);
      }
    }
  },
  methods: {
    async mutate() {
      if (this.loading) return;
      if (!this.authData.email) {
        return this.showError('Введите E-Mail');
      }
      if (!this.authData.password) {
        return this.showError('Введите пароль');
      }
      this.loading = true;
      try {
        this.authOutput = await this.$apollo
          .mutate({
            mutation: GQL_LOGIN,
            variables: {
              input: this.authData
            }
          })
          .then(data => data.data.login)
          .catch(this.$showError);
        localStorage.setItem(AUTH_TOKEN, this.authOutput.token);
      } catch (e) {
        console.error(e);
      }
      this.loading = false;
    }
  }
};
</script>

<style lang="sass" scoped>
.auth
    background-color: #1E3C00
    &__left
        width: 100%
        z-index: 1
    &__form
      margin-bottom: 10vh

    &__text
        max-width: 30rem
        text-align: center

    &__input
        min-width: 25rem
        margin-bottom: 2rem
        background-color: $white

        &:last-child
            margin-bottom: 4rem
    &__logo
        width: 10rem
    &__figure
      position: absolute
      top: 0
      right: 0
      left: 0
      bottom: 0
      background-color: $accent
      clip-path: polygon(80% 0, 100% 0, 100% 100%, 81% 100%, 22% 100%)
</style>
