<template>
  <div class="box right-modal df fdc ais" v-color="'white'">
    <v-input v-model="right.name" :label="text.rights.name" v-mb="2"></v-input>
    <v-input
      v-model="right.description"
      :label="text.rights.description"
      v-mb="2"
    ></v-input>
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
import { GQL_ADD_RIGHT, GQL_UPDATE_RIGHT } from '@/graphql';
import { omit } from 'ramda';
import { VInput } from '@/components/Controls';

export default {
  components: {
    VInput
  },
  props: {
    right: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    save() {
      const { id } = this.right;
      this.$apollo
        .mutate({
          mutation: id ? GQL_UPDATE_RIGHT : GQL_ADD_RIGHT,
          variables: {
            id,
            input: omit(['__typename', 'id'], this.right)
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
.right-modal
    padding: 1rem
    max-height: 90vh
    width: 50rem
    max-width: 90vw
</style>
