function mergeTransitions(transitions, array) {
  if (Array.isArray(transitions)) return transitions.concat(array);
  if (transitions) array.push(transitions);
  return array;
}

export function createSimpleTransition(name, origin = 'top center 0', mode) {
  return {
    name,

    functional: true,

    props: {
      group: {
        type: Boolean,
        default: false
      },
      hideOnLeave: {
        type: Boolean,
        default: false
      },
      leaveAbsolute: {
        type: Boolean,
        default: false
      },
      mode: {
        type: String,
        default: mode
      },
      origin: {
        type: String,
        default: origin
      }
    },

    render(h, context) {
      const tag = `transition${context.props.group ? '-group' : ''}`;
      context.data = context.data || {};
      context.data.props = {
        name,
        mode: context.props.mode
      };
      context.data.on = context.data.on || {};
      if (!Object.isExtensible(context.data.on)) {
        context.data.on = { ...context.data.on };
      }

      const ourBeforeEnter = [];
      const ourLeave = [];
      const absolute = el => (el.style.position = 'absolute');

      ourBeforeEnter.push(el => {
        el.style.transformOrigin = context.props.origin;
        el.style.webkitTransformOrigin = context.props.origin;
      });

      if (context.props.leaveAbsolute) ourLeave.push(absolute);
      if (context.props.hideOnLeave) {
        ourLeave.push(el => (el.style.display = 'none'));
      }

      const { beforeEnter, leave } = context.data.on;

      // Type says Function | Function[] but
      // will only work if provided a function
      context.data.on.beforeEnter = () =>
        mergeTransitions(beforeEnter, ourBeforeEnter);
      context.data.on.leave = mergeTransitions(leave, ourLeave);

      return h(tag, context.data, context.children);
    }
  };
}

export function createJavaScriptTransition(name, functions, mode = 'in-out') {
  return {
    name,

    functional: true,

    props: {
      mode: {
        type: String,
        default: mode
      }
    },

    render(h, context) {
      const data = {
        props: {
          ...context.props,
          name
        },
        on: functions
      };

      return h('transition', data, context.children);
    }
  };
}

export function upperFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const capitalize = str =>
  str.replace(/^\w/, letter => letter.toUpperCase());
