<template>
  <div class="account-box df fdc aic jcc">
    <div
      class="account-box__image-container"
      @contextmenu="$showContextMenu($event, 'actions', { actions })"
      @click.stop="$showModal('image', { src: user.avatar })"
      v-mb="1"
      v-circle="8"
    >
      <v-image
        class="account-box__image"
        :src="user.avatar"
        v-circle="8"
      ></v-image>
      <div class="account-box__image-overlay df aic jcc">
        <v-icon name="zoom_out_map" color="white" size="lg"></v-icon>
      </div>
    </div>
    <v-icon
      v-if="settings"
      name="settings"
      class="account-box__settings-icon"
      @click.stop="$showModal('user', { id: user.id })"
      color="accent"
    ></v-icon>
    <span class="text--bold">{{ user.name }}</span>
  </div>
</template>

<script>
export default {
  props: { user: Object, settings: { default: true } },
  computed: {
    // Computed because file dialog may be not initialized yet and then openFileDialog is undefined
    actions() {
      return [
        {
          name: 'upload',
          icon: 'cloud_upload',
          action: () => this.$openFileDialog(this.onUpload)
        },
        {
          name: 'delete',
          icon: 'delete',
          action: () => this.$emit('update', { avatar: null })
        }
      ];
    }
  },
  methods: {
    onUpload(avatar) {
      this.$emit('update', { avatar });
    }
  }
};
</script>

<style lang="sass" scoped>
.account-box
    padding: 2rem 0
    border-bottom: $devider
    position: relative

    &__image
        box-shadow: $default-shadow

        &-container
            position: relative
            overflow: hidden
            cursor: pointer

        &-overlay
            position: absolute
            top: 0
            bottom: 0
            left: 0
            right: 0
            background-color: rgba($dark, .2)
            opacity: 0
            transition: $default-transition

            &:hover
                opacity: 1

    &__settings-icon
        cursor: pointer
        font-size: 2.5rem
        position: absolute
        top: 8rem
        right: calc((#{$sidebar-width} - 7rem) / 2)
</style>
