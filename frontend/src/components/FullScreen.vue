<template>
  <div>
    <v-icon @click.stop="open" name="fullscreen" v-if="isFull"></v-icon>
    <v-icon v-else @click.stop="close" name="fullscreen_exit"></v-icon>
  </div>
</template>

<script>
const documentElement = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
  if (documentElement.requestFullscreen) {
    documentElement.requestFullscreen();
  } else if (documentElement.mozRequestFullScreen) {
    /* Firefox */
    documentElement.mozRequestFullScreen();
  } else if (documentElement.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    documentElement.webkitRequestFullscreen();
  } else if (documentElement.msRequestFullscreen) {
    /* IE/Edge */
    documentElement.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
}

export default {
  data: () => ({
    isFull: true
  }),
  methods: {
    open() {
      this.isFull = false;
      openFullscreen();
    },
    close() {
      this.isFull = true;
      closeFullscreen();
    }
  }
};
</script>
