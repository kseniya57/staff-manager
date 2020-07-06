export default {
  created() {
    const remoteClickListener = e => {
      if (this.isOpen && (e.which || e.button) === 1) {
        this.close();
      }
    };
    const escapeHandler = e => {
      if (this.isOpen && e.key === 'Escape') {
        this.close();
      }
    };
    document.addEventListener('click', remoteClickListener);
    document.addEventListener('keydown', escapeHandler);

    this.$once('hook:destroyed', () => {
      document.removeEventListener('click', remoteClickListener);
      document.removeEventListener('keydown', escapeHandler);
    });
  }
};
