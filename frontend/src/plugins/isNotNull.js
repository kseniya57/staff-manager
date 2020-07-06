window.isNotNull = value => !!value || value === 0;

export default {
  install: Vue => (Vue.prototype.isNotNull = isNotNull)
};
