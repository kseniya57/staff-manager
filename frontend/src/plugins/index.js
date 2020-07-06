import Vue from 'vue';

['apollo', 'isNotNull', 'image', 'copy', 'subscriptions']
  .map(module => require(`./${module}`).default)
  .forEach(plugin => Vue.use(plugin));
