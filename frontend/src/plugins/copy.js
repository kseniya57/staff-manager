const copy = text => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('style', 'position: absolute; top: -100vh;');
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  //textarea.remove();
};

export default {
  install: Vue => (Vue.prototype.$copy = copy)
};
