<template>
  <div class="box bonus-modal df fdc ais" v-color="'white'">
    <v-input v-model="bonus.name" :label="text.bonuses.name" v-mb="2"></v-input>
    <money-input
      v-model="bonus.amount"
      :label="text.bonuses.amount"
      v-mb="2"
    ></money-input>
    <v-textarea
      :label="text.bonuses.description"
      v-model="bonus.description"
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
import { GQL_ADD_BONUS, GQL_UPDATE_BONUS } from '@/graphql';
import { omit } from 'ramda';
import { VInput, MoneyInput, VTextarea } from '@/components/Controls';

export default {
  components: {
    VInput,
    MoneyInput,
    VTextarea
  },
  props: {
    bonus: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    save() {
      const { id } = this.bonus;
      this.$apollo
        .mutate({
          mutation: id ? GQL_UPDATE_BONUS : GQL_ADD_BONUS,
          variables: {
            id,
            input: omit(['__typename', 'id'], this.bonus)
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
.bonus-modal
    padding: 1rem
    max-height: 90vh
    width: 50rem
    max-width: 90vw
</style>
