<template>
  <div class="box role-modal df fdc ais" v-color="'white'">
    <v-input v-model="role.name" :label="text.roles.name" v-mb="2"></v-input>
    <multiple-select
      :query="GQL_RIGHTS"
      nameKey="description"
      name="rights"
      v-model="rights"
    ></multiple-select>
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
import { GQL_ADD_ROLE, GQL_UPDATE_ROLE, GQL_RIGHTS, GQL_ROLE } from '@/graphql';
import { omit, pluck } from 'ramda';
import { VInput, MultipleSelect } from '@/components/Controls';

export default {
  components: {
    VInput,
    MultipleSelect
  },
  props: {
    role: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    GQL_RIGHTS,
    rights: []
  }),
  apollo: {
    rights: {
      query: GQL_ROLE,
      variables() {
        return { id: this.role.id };
      },
      update: ({ role }) => role.rights,
      skip() {
        return !this.role.id;
      }
    }
  },
  methods: {
    save() {
      const { id } = this.role;
      this.$apollo
        .mutate({
          mutation: id ? GQL_UPDATE_ROLE : GQL_ADD_ROLE,
          variables: {
            id,
            input: Object.assign(omit(['__typename', 'id'], this.role), {
              rights: pluck('id', this.rights)
            })
          }
        })
        .then(this.$closeModal)
        .catch(this.$showError);
    },
    cancel() {
      this.$closeModal();
    }
  }
};
</script>

<style lang="sass" scoped>
.role-modal
    padding: 1rem
    max-height: 90vh
    width: 50rem
    max-width: 90vw
</style>
