<template>
  <div class="box social-network-modal df fdc ais" v-color="'white'">
    <v-image
      class="social-network-modal__image asc pointer"
      @click.stop="uploadImage"
      :src="socialNetwork.image"
      v-mb="2"
    ></v-image>
    <v-input
      v-model="socialNetwork.name"
      :label="text.socialNetworks.name"
      v-mb="2"
    ></v-input>
    <v-input
      v-model="socialNetwork.link"
      :label="text.socialNetworks.link"
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
import { GQL_ADD_SOCIAL_NETWORK, GQL_UPDATE_SOCIAL_NETWORK } from '@/graphql';
import { omit } from 'ramda';
import { VInput } from '@/components/Controls';

export default {
  components: {
    VInput
  },
  props: {
    socialNetwork: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    oldImage: null
  }),
  mounted() {
    this.oldImage = this.socialNetwork.image;
  },
  methods: {
    onUpload(imageSrc) {
      this.$set(this.socialNetwork, 'image', imageSrc);
    },
    uploadImage() {
      this.$openFileDialog(this.onUpload);
    },
    save() {
      const { id } = this.socialNetwork;
      this.$apollo
        .mutate({
          mutation: id ? GQL_UPDATE_SOCIAL_NETWORK : GQL_ADD_SOCIAL_NETWORK,
          variables: {
            id,
            input: omit(['__typename', 'id'], this.socialNetwork)
          }
        })
        .then(this.$closeModal)
        .catch(this.$showError);
    },
    cancel() {
      this.$set(this.socialNetwork, 'image', this.oldImage);
      this.$closeModal();
    }
  }
};
</script>

<style lang="sass" scoped>
.social-network-modal
    padding: 1rem
    max-height: 90vh
    width: 50rem
    max-width: 90vw
    &__image
        width: 20rem
</style>
