<template>
  <div>
    <span class="label" v-if="label">{{ label }}</span>
    <div class="tag-input df fww aifs">
      <tag
        v-for="(tag, name) in tagsMap"
        :key="name"
        v-mr="0.2"
        v-mb="0.2"
        :tag="tag"
        @remove="removeTag(name)"
      />
      <dropdown width="100%" v-ml="0.5">
        <input
          class="tag-input__input input"
          slot="activator"
          v-model="newTag"
          @keydown.enter="addTag({ name: newTag })"
          @keydown.delete="removeTagOnBackspace"
        />
        <div
          slot="content"
          class="tag-input__options-list"
          v-if="filteredTags.length"
        >
          <tag
            v-for="tag in filteredTags"
            :key="tag.name"
            :removable="false"
            @click.stop="addTag(tag)"
            :tag="tag"
            v-mb="0.2"
            v-mr="0.2"
            class="pointer"
          />
        </div>
      </dropdown>
    </div>
  </div>
</template>

<script>
import Dropdown from '@/components/Common/Dropdown';
import Tag from '@/components/Common/Tag';
import { prop, indexBy, assoc, dissoc } from 'ramda';

export default {
  props: {
    value: { required: true },
    nameKey: {
      default: 'name'
    },
    label: String,
    query: Object,
    mutation: Object,
    type: String,
    storeKey: {
      default: 'tags'
    }
  },
  data: () => ({
    newTag: null,
    tags: []
  }),
  components: {
    Dropdown,
    Tag
  },
  mounted() {
    this.$apollo.addSmartQuery('tags', {
      query: this.query,
      update({ [this.storeKey]: tags }) {
        return tags;
      }
    });
  },
  computed: {
    tagsMap() {
      return indexBy(prop(this.nameKey), this.value);
    },
    filteredTags() {
      return this.tags.filter(tag => !this.tagsMap[tag.name]);
    }
  },
  methods: {
    update(tagsMap) {
      this.$emit('input', Object.values(tagsMap));
    },
    addTag(tag) {
      if (tag.name && tag.name.length && !this.tagsMap[tag.name]) {
        this.update(assoc(name, tag, this.tagsMap));
        this.newTag = null;

        if (tag.id) return;

        this.$apollo
          .mutate({
            mutation: this.mutation,
            variables: { input: tag },
            update: (store, { data: { [`add${this.type}`]: addTag } }) => {
              Object.assign(tag, {
                id: addTag,
                __typename: this.type
              });
              this.tagsMap[tag.name] = tag;
              this.update(this.tagsMap);

              const data = store.readQuery({ query: this.query });
              data.tags.push(tag);
              store.writeQuery({ query: this.query, data });
            }
          })
          .catch(() => {
            this.newTag = tag.name;
          });
      }
    },
    removeTag(tag) {
      this.update(dissoc(tag, this.tagsMap));
    },
    removeTagOnBackspace(e) {
      const keys = Object.keys(this.tagsMap);
      if (!e.target.value && keys.length) {
        this.update(dissoc(keys[keys.length - 1], this.value));
      }
    }
  }
};
</script>

<style lang="sass" scoped>
.tag-input
    padding: 1rem
    min-height: 5.5rem
    border-radius: .6rem
    background-color: $white
    border: $devider

    &__input
        height: 2.5rem
        font-size: 1rem
        border-radius: 1rem

    &__options-list
        padding: .3rem
</style>
