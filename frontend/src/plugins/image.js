import { UPLOADS_URL, DEFAULT_IMAGE } from '@/constants';

export default {
  install: Vue =>
    (Vue.prototype.$getImage = src =>
      src
        ? src.startsWith('/images')
          ? UPLOADS_URL + src
          : require(`@/assets/images/${src}`)
        : DEFAULT_IMAGE)
};
