export const circle = {
  name: 'circle',
  handler: (el, binding) => {
    el.style.width = `${binding.value}rem`;
    el.style.height = `${binding.value}rem`;
    el.style.borderRadius = `50%`;
  }
};
