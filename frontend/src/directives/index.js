import Vue from 'vue';

['size', 'circle', 'router']
  .reduce(
    (acc, module) => acc.concat(Object.values(require(`./${module}`))),
    []
  )
  .forEach(({ name, handler }) => Vue.directive(name, handler));
