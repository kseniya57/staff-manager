export const router = {
  name: 'to',
  handler: (el, binding, vnode) => {
    el.addEventListener('click', () =>
      vnode.context.$router.push(binding.value)
    );
  }
};
