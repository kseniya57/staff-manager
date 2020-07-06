const createSizeBinding = (name, ...props) => ({
  name,
  handler: (el, binding) => {
    props.forEach(prop => (el.style[prop] = `${binding.value}rem`));
  }
});

export const mb = createSizeBinding('mb', 'marginBottom');
export const mr = createSizeBinding('mr', 'marginRight');
export const ml = createSizeBinding('ml', 'marginLeft');
export const ma = createSizeBinding('ma', 'margin');
export const mx = createSizeBinding('mx', 'marginRight', 'marginLeft');
export const my = createSizeBinding('my', 'marginTop', 'marginBottom');
export const pb = createSizeBinding('pb', 'paddingBottom');
export const pr = createSizeBinding('pr', 'paddingRight');
export const pl = createSizeBinding('pl', 'paddingLeft');
export const px = createSizeBinding('px', 'paddingRight', 'paddingLeft');
export const py = createSizeBinding('py', 'paddingTop', 'paddingBottom');
export const pa = createSizeBinding('pa', 'padding');
