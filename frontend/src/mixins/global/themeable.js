import theme from '@/libs/theme';

export default {
  data: () => theme,
  directives: {
    ...[['color', 'backgroundColor'], ['text-color', 'color']].reduce(
      (map, [directive, prop]) =>
        Object.assign(map, {
          [directive]: {
            bind(el, binding) {
              el.style[prop] = theme.colors[binding.value] || binding.value;
            },
            update(el, binding) {
              el.style[prop] = theme.colors[binding.value] || binding.value;
            }
          }
        }),
      {}
    )
  }
};
