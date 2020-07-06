<template>
  <div class="box profile df fdc ais" v-color="'dark'">
    <div v-mb="3" v-ml="2" class="text--md text--white">
      {{ name }}
    </div>
    <tabs :items="tabs" v-mb="2" class="profile__tabs" v-color="'white'">
      <info :user="user"></info>
      <salary :userId="user.id"></salary>
      <comments :userId="user.id" />
      <expenses :userId="user.id" />
      <payroll :user="user" />
    </tabs>
    <div class="df aic jcc">
      <v-button @click.stop="save" v-color="'accent'" v-mr="1">{{
        text.actions.ok
      }}</v-button>
      <v-button @click.stop="$closeModal" v-color="'gray'">{{
        text.actions.cancel
      }}</v-button>
    </div>
  </div>
</template>

<script>
import { Tabs } from '@/components/Common';
import { GQL_USER, GQL_ADD_USER, GQL_UPDATE_USER } from '@/graphql';
import { Info, Salary, Comments, Expenses, Payroll } from './tabs';

export default {
  props: ['id'],
  components: {
    Tabs,
    Info,
    Salary,
    Comments,
    Expenses,
    Payroll
  },
  data() {
    return {
      user: {},
      tabs: this.id
        ? ['edit', 'payment', 'comment', 'computer', 'attach_money']
        : ['edit']
    };
  },
  apollo: {
    user: {
      query: GQL_USER,
      variables() {
        return { id: this.id };
      },
      skip() {
        return !this.id;
      }
    }
  },
  methods: {
    save() {
      const {
        id,
        firstName,
        lastName,
        middleName,
        email,
        phone,
        card,
        bio,
        socialNetworks,
        tags,
        skills
      } = this.user;

      const input = {
        firstName,
        lastName,
        middleName,
        email,
        phone,
        card,
        bio
      };

      if (socialNetworks) {
        input.socialNetworks = JSON.stringify(
          socialNetworks.map(({ id, nickname }) => ({ id, nickname }))
        );
      }

      if (tags) {
        input.tags = tags.map(tag => tag.id).filter(item => item);
      }

      if (skills) {
        input.skills = skills.map(item => item.id).filter(item => item);
      }

      this.$apollo
        .mutate({
          mutation: id ? GQL_UPDATE_USER : GQL_ADD_USER,
          variables: {
            id,
            input
          }
        })
        .then(this.$closeModal)
        .catch(this.$showError);
    }
  },
  computed: {
    name() {
      return `${this.user.lastName || ''} ${this.user.firstName || ''} ${this
        .user.middleName || ''}`;
    }
  }
};
</script>

<style lang="sass" scoped>
.profile
    padding: 3rem 5rem
    width: 90vw
    max-height: 90vh
    &__tabs
        min-height: 70vh
</style>
