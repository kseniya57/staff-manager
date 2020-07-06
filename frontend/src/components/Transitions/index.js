import {
  createSimpleTransition,
  createJavaScriptTransition
} from '@/utils/helpers';

import ExpandTransitionGenerator from './expand';

export const VFadeTransition = createSimpleTransition('fade-transition');
export const VScaleTransition = createSimpleTransition('scale-transition');
export const VScrollXTransition = createSimpleTransition('scroll-x-transition');
export const VScrollXReverseTransition = createSimpleTransition(
  'scroll-x-reverse-transition'
);
export const VScrollYTransition = createSimpleTransition('scroll-y-transition');
export const VScrollYReverseTransition = createSimpleTransition(
  'scroll-y-reverse-transition'
);
export const VSlideXTransition = createSimpleTransition('slide-x-transition');
export const VSlideXReverseTransition = createSimpleTransition(
  'slide-x-reverse-transition'
);
export const VSlideYTransition = createSimpleTransition('slide-y-transition');
export const VSlideYReverseTransition = createSimpleTransition(
  'slide-y-reverse-transition'
);

export const VExpandTransition = createJavaScriptTransition(
  'expand-transition',
  ExpandTransitionGenerator()
);
export const VExpandXTransition = createJavaScriptTransition(
  'expand-x-transition',
  ExpandTransitionGenerator('', true)
);

export RouterTransition from './RouterTransition';
