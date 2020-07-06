<template>
  <div class="box position-modal df fdc ais" v-color="'white'">
    <v-input
      v-model="position.name"
      :label="text.positions.name"
      v-mb="2"
    ></v-input>
    <div v-mb="2" class="df">
      <money-input
        v-model="position.minSalary"
        :label="text.positions.minSalary"
        v-mx="0.5"
      ></money-input>
      <money-input
        v-model="position.maxSalary"
        :label="text.positions.maxSalary"
        v-mx="0.5"
      ></money-input>
    </div>
    <v-textarea
      :label="text.positions.description"
      v-model="position.description"
      v-mb="2"
    ></v-textarea>
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
import { GQL_ADD_POSITION, GQL_UPDATE_POSITION } from '@/graphql';
import { omit } from 'ramda';
import { VInput, MoneyInput, VTextarea } from '@/components/Controls';

export default {
  components: {
    VInput,
    MoneyInput,
    VTextarea
  },
  props: {
    position: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    save() {
      const { id } = this.position;
      this.$apollo
        .mutate({
          mutation: id ? GQL_UPDATE_POSITION : GQL_ADD_POSITION,
          variables: {
            id,
            input: omit(['__typename', 'id'], this.position)
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
.position-modal
    padding: 1rem
    max-height: 90vh
    width: 50rem
    max-width: 90vw
</style>
