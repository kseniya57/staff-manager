import Vue from 'vue';

['Image', 'Icon', 'Button'].forEach(module =>
  Vue.component(`v-${module.toLowerCase()}`, require(`./${module}`).default)
);
