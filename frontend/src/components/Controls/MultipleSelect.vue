<template>
  <div
    class="items-input df fww"
    v-color="'white'"
    @keydown.delete="removeLast"
    v-if="allItems.length"
  >
    <div
      v-for="item in items"
      v-mr="1"
      v-mb="1"
      class="items-input__item dif aic jcc"
      v-color="'gray'"
      :key="item.id"
    >
      <v-image
        v-if="imageKey && item[imageKey]"
        v-circle="2.5"
        :src="item[imageKey]"
        v-mr="0.5"
      ></v-image>
      <span v-text-color="'white'">{{ item[nameKey] }}</span>
      <v-icon
        name="close"
        class="dif aic jcc pointer"
        v-circle="1.3"
        v-ml="1"
        size="xxs"
        v-color="'white'"
        @click.stop="remove(item.id)"
      ></v-icon>
    </div>
    <v-select
      v-if="filteredItems.length"
      v-model="searchText"
      @input="add"
      :items="filteredItems"
      :closeOnSelect="true"
      :clearOnSelect="true"
      :imageField="imageKey"
      :nameKey="nameKey"
    ></v-select>
  </div>
</template>

<script>
import { VSelect } from '@/components/Controls';

export default {
  model: {
    prop: 'items',
    event: 'input'
  },
  props: {
    query: Object,
    name: String,
    data: Array,
    variables: Object,
    items: { required: true },
    imageKey: String,
    nameKey: { default: 'name' }
  },
  components: {
    VSelect
  },
  data() {
    return {
      allItems: [],
      searchText: ''
    };
  },
  mounted() {
    if (this.data) {
      this.allItems = this.data;
    }
  },
  apollo: {
    allItems: {
      query() {
        return this.query;
      },
      variables() {
        return this.variables;
      },
      update(data) {
        return data[this.name];
      },
      skip() {
        return !this.query;
      }
    }
  },
  methods: {
    add(item) {
      this.$emit('input', this.items.concat(item));
    },
    remove(id) {
      this.$emit('input', this.items.filter(item => item.id !== id));
    },
    removeLast() {
      if (!this.searchText.length) {
        if (this.items.length) {
          this.remove(this.items[this.items.length - 1].id);
        }
      }
    }
  },
  computed: {
    filteredItems() {
      return this.allItems.filter(
        item => !this.items.find(u => u.id === item.id)
      );
    }
  },
  watch: {
    data() {
      this.allItems = this.data;
    }
  }
};
</script>

<style lang="sass" scoped>
.items-input
    border-radius: .6rem
    padding: 1rem
    &__item
        height: 3.5rem
        border-radius: .6rem
        padding: 0 .5rem
</style>
