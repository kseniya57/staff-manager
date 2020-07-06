import Vue from 'vue';

['themeable', 'multilingual'].forEach(module =>
  Vue.mixin(require(`./${module}`).default)
);
