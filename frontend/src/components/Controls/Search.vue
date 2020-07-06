<template>
  <div class="search df fww" @keydown.delete="removeLastFilter">
    <div
      v-for="(value, key) in filterMapping"
      class="search__tag df aic"
      :key="key"
    >
      <span>{{ text.filters[key.split(':')[0]] }}</span>
      <span
        v-if="isNotNull(value)"
        class="dif aic"
        @click.stop="
          e => $showContextMenu(e, 'actions', alternativeValuesMenu(key))
        "
      >
        {{ process(key, value) }}
        <v-icon
          name="delete"
          v-ml="0.5"
          size="sm"
          class="pointer dif aic jcc"
          v-circle="2"
          @click.stop="removeFilter(key)"
        ></v-icon>
      </span>
    </div>
    <v-select
      slot="activator"
      v-model="searchText"
      @input="add"
      :items="options"
      :closeOnSelect="!isFilterMode"
      :clearOnSelect="true"
      input-style="border: none; height: 3.5rem"
      :onEnter="add"
    />
  </div>
</template>

<script>
import { VSelect } from '@/components/Controls';
import { dissoc } from 'ramda';

export default {
  props: {
    filterMapping: Object,
    filters: Array,
    nameKey: { default: 'name' }
  },
  model: {
    prop: 'filterMapping'
  },
  components: {
    VSelect
  },
  data: () => ({
    values: {},
    filterMode: true,
    currentFilter: null,
    searchText: '',
    activeIndex: -1,
    searchOptions: {},
    content: '',
    tmp: null
  }),
  mounted() {
    this.filters.forEach(item => {
      if (item.query) {
        this.$apollo.addSmartQuery('tmp', {
          query: item.query,
          variables: item.variables,
          update({ [item.storeKey || item.value]: data }) {
            this.$set(this.values, item.value, data);
            return data;
          }
        });
      } else if (item.values) {
        this.$set(this.values, item.value, item.values);
      }
    });
  },
  computed: {
    isFilterMode() {
      return this.filterMode || !this.currentFilter;
    },
    options() {
      return this.isFilterMode
        ? this.filters.filter(
            filter =>
              !this.filterMapping[filter.value] &&
              (filter.type === 'like' || this.getValuesForFilter(filter).length)
          )
        : this.getValuesForFilter(this.currentFilter);
    }
  },
  methods: {
    add(option) {
      const isFilterMode = this.isFilterMode;
      if (typeof option === 'string') {
        if (isFilterMode || this.currentFilter.type !== 'like') {
          return;
        }
        option = { id: option, name: option };
      }
      let [name, value] = isFilterMode
        ? [this.getName(option, true), null]
        : [this.getName(this.currentFilter), option];
      this.$emit(
        'input',
        {
          ...this.filterMapping,
          [name]: isFilterMode
            ? value
            : this.getActualValue(this.currentFilter, value)
        },
        isFilterMode
      );
      if (isFilterMode) {
        this.currentFilter = option;
        this.filterMode = false;
      } else {
        this.filterMode = true;
      }
      this.searchText = '';
    },
    getName(item, isIncrement = false) {
      if (['array', 'like'].includes(item.type)) {
        item.index = (item.index || 0) + (isIncrement ? 1 : 0);
        return `${item.value}:${item.index}`;
      }
      return item.value;
    },
    getValuesForFilter({ value, process, type }) {
      let values = this.values[value];

      if (!values) {
        return [];
      }

      if (process) {
        values = values.map(process);
      }

      const existingFilters =
        type === 'array' &&
        Object.entries(this.filterMapping).reduce((acc, [k, v]) => {
          if (k.startsWith(value)) {
            acc.push(v);
          }
          return acc;
        }, []);

      return existingFilters
        ? values.filter(
            value =>
              !existingFilters.find(filter => filter && filter.id === value.id)
          )
        : values;
    },
    removeFilter(key) {
      this.$emit('input', dissoc(key, this.filterMapping));
    },
    removeLastFilter() {
      if (!this.searchText.length) {
        const keys = Object.keys(this.filterMapping);
        if (keys.length) {
          this.removeFilter(keys[keys.length - 1]);
          this.currentFilter = null;
        }
      }
    },
    process(key, value) {
      const actualKey = key.split(':')[0];
      const process = (this.filters.find(f => f.value === actualKey) || {})
        .process;
      return process ? process(value) : value[this.nameKey] || value;
    },
    alternativeValuesMenu(key) {
      const filter = this.filters.find(f => f.value === key);
      return {
        actions: this.getValuesForFilter(filter).map(item => ({
          name: item,
          icon: filter.icon,
          action: () =>
            this.$emit('input', {
              ...this.filterMapping,
              [key]: this.getActualValue(filter, item)
            })
        }))
      };
    },
    getActualValue(filter, value) {
      return filter.process
        ? this.values[filter.value].find(v => filter.process(v) === value)
        : value;
    }
  }
};
</script>

<style lang="sass" scoped>
.search
    background-color: $white
    padding: .5rem
    border-radius: .6rem
    border: $devider
    min-height: 4.5rem

    &__option
        padding: .5rem
        transition: $default-transition

        &:not(:last-child)
            border-bottom: $devider

        &:hover
            font-weight: bold

            i
                color: $primary !important

        &.active
            background-color: rgba($primary, .1)

    &__tag
        color: $white
        border-radius: .5rem
        overflow: hidden
        margin: .5rem

        span
            padding: 1rem
            height: 3.8rem
            background-color: $gray
            transition: $default-transition

            &:hover
                background-color: darken($gray, 10%)

            &:last-child
                border-left: $devider

        i
            background-color: $white
            color: $gray

            &:hover
                color: $dark !important
</style>
