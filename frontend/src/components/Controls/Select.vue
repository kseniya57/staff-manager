<template>
  <dropdown class="select" width="100%">
    <template slot="activator" scope="{ toggle, active }">
      <div class="form-group">
        <span class="label" v-if="label">{{ label }}</span>
        <input
          v-bind="$attrs"
          :value="value"
          @input="e => (editable ? (value = e.target.value) : false)"
          class="select__input input"
          :style="inputStyle"
          @keydown.exact="checkTouch"
          @keydown.down="changeActive(1, active, toggle)"
          @keydown.up="changeActive(-1, active, toggle)"
          @keydown.enter="
            active
              ? select(filteredItems[activeIndex], toggle)
              : checkEnter(value)
          "
          :disabled="disabled"
        />
      </div>
    </template>
    <template slot="content" scope="{ toggle }" v-if="!disabled">
      <div class="select__content" ref="content">
        <span
          v-for="(option, index) in filteredItems"
          :class="
            `select__option pointer dif aic ${activeIndex === index &&
              'active'}`
          "
          :key="option.processedName"
          @click.stop="select(option, toggle)"
        >
          <v-icon v-if="option.icon" :name="option.icon" v-mr="1"></v-icon>
          <v-image
            v-else-if="option[imageField]"
            v-circle="1.5"
            :src="option[imageField]"
            v-mr="1"
          ></v-image>
          <span>{{ option.processedName }}</span>
        </span>
      </div>
    </template>
  </dropdown>
</template>

<script>
import Dropdown from '@/components/Common/Dropdown';
import scrollTo from '@/utils/scrollTo';

export default {
  components: {
    Dropdown
  },
  props: {
    items: { default: () => [] },
    initialValue: { default: '' },
    closeOnSelect: { default: true },
    clearOnSelect: { default: false },
    filter: { default: true },
    imageField: { default: 'image' },
    inputStyle: String,
    nameKey: { default: 'name' },
    disabled: { default: false },
    label: String,
    getName: Function,
    editable: { default: true },
    onEnter: Function
  },
  mounted() {
    this.value = this.initialValue;
    if (this.value) {
      this.showAll = true;
    }
  },
  data: () => ({
    activeIndex: -1,
    value: '',
    showAll: false
  }),
  computed: {
    processedItems() {
      return this.items.map(item =>
        Object.assign(item, { processedName: this.itemName(item) })
      );
    },
    filteredItems() {
      if (this.showAll) {
        return this.processedItems;
      }
      const lowerCasedValue = this.value.toLowerCase();
      return this.processedItems.filter(item =>
        item.processedName.toLowerCase().startsWith(lowerCasedValue)
      );
    }
  },
  methods: {
    changeActive(direction, isOpen, toggle) {
      if (!isOpen) {
        toggle();
      }
      const length = this.items.length;
      this.activeIndex = (length + this.activeIndex + direction) % length;
      scrollTo(this.$refs.content.children[this.activeIndex]);
    },
    select(item, close) {
      if (item) {
        this.$emit('input', item.key || item);
        this.value = item.processedName;
      } else if (this.onEnter) {
        this.onEnter(this.value);
      }
      this.closeOnSelect && close && close();
      if (this.clearOnSelect) {
        this.value = '';
      }
      this.showAll = true;
    },
    checkTouch() {
      if (this.value === '') {
        this.showAll = false;
      }
    },
    itemName(item) {
      return this.getName ? this.getName(item) : item[this.nameKey] || item;
    },
    checkEnter(value) {
      if (this.onEnter) {
        this.onEnter(value);
        this.value = '';
        this.currentFilter = null;
      }
    }
  }
};
</script>

<style lang="sass" scoped>
.select
    &__content
        max-height: 12rem
        overflow-y: auto
        border-radius: .4rem

    &__option
        background-color: $white
        color: $text-color--base
        height: 4rem
        padding: 0 .5rem
        transition: $default-transition
        width: 100%

        &:not(:last-child)
            border-bottom: $devider

        &.active
            background-color: $gray
            color: $white
</style>
