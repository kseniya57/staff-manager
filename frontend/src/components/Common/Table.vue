<template>
  <div>
    <div v-if="withHeader" class="df aic jcsb" v-pa="1" v-mb="1">
      <h3 v-if="title" class="ttc">{{ title }}</h3>
      <search
        v-if="searchFilters && items"
        v-mr="2"
        v-ml="2"
        class="expanded"
        v-model="filterMapping"
        :filters="searchFilters"
        @input="search"
      />
      <v-button
        v-if="modal"
        v-color="'accent'"
        type="circle"
        v-mr="2"
        @click.stop="$showModal(modal, { [modal]: defaultItem })"
      >
        <v-icon name="add" :color="'white'" />
      </v-button>
    </div>
    <v-fade-transition>
      <table v-if="items && items.length" class="table">
        <thead>
          <tr>
            <td
              v-for="cell in headers"
              :key="cell.key"
              :width="cell.width || 'auto'"
            >
              {{
                text[textKey][cell.key] ||
                  (cell.type === 'action' && text.actions[cell.key]) ||
                  cell.value
              }}
              <v-icon
                v-if="cell.sort"
                @click.stop="sort(cell.key)"
                name="import_export"
                color="light"
              ></v-icon>
            </td>
            <td v-if="canEdit || deleteQuery">
              {{ text.actions.title }}
            </td>
          </tr>
        </thead>
        <component
          :is="canDrag ? 'draggable' : 'tbody'"
          v-model="items"
          tag="tbody"
          @end="move"
        >
          <template v-for="(row, index) in items">
            <v-fade-transition :key="index">
              <tr
                :style="
                  `background-color: ${
                    getRowColor ? getRowColor(row) : '#fffff'
                  }`
                "
              >
                <td v-for="cell in headers" :key="cell.id">
                  <v-image
                    @click.stop="$showModal('image', { src: row[cell.key] })"
                    :src="row[cell.key]"
                    v-if="cell.type === 'image'"
                    :style="{ width: cell.size || '7rem' }"
                  ></v-image>
                  <template v-else-if="cell.type === 'action'">
                    <v-button
                      v-if="cell.button"
                      @click.stop="cell.action(row)"
                      :type="cell.color"
                      style="height: 2.5rem"
                    >
                      {{ text.actions[cell.value] || cell.value }}
                    </v-button>
                    <v-icon
                      v-else
                      class="action-icon"
                      @click.stop="(cell.action[index] || cell.action)(row)"
                      v-text-color="
                        cell.color ? cell.color[index] || cell.color : 'black'
                      "
                      :name="cell.value"
                    ></v-icon>
                  </template>
                  <span v-else>
                    {{
                      cell.process ? cell.process(row[cell.key]) : row[cell.key]
                    }}
                  </span>
                </td>
                <td v-if="canEdit || deleteQuery">
                  <v-icon
                    v-if="canEdit"
                    class="action-icon"
                    @click.stop="$showModal(modal, { [modal]: row })"
                    v-text-color="'info'"
                    name="edit"
                  ></v-icon>
                  <v-icon
                    v-if="deleteQuery"
                    class="action-icon"
                    @click.stop="deleteItem(row)"
                    v-text-color="'error'"
                    name="delete"
                  ></v-icon>
                </td>
              </tr>
            </v-fade-transition>
          </template>
        </component>
      </table>
    </v-fade-transition>
    <v-fade-transition v-if="!onePage">
      <pagination
        v-if="items && items.length && pagesCount"
        v-model="page"
        :count="pagesCount"
      ></pagination>
    </v-fade-transition>
  </div>
</template>

<script>
import Pagination from './Pagination';
import { Search } from '@/components/Controls';
import { GQL_COUNT } from '@/graphql';
import draggable from 'vuedraggable';
import { VFadeTransition } from '@/components/Transitions';

export default {
  components: {
    Search,
    Pagination,
    draggable,
    VFadeTransition
  },
  data() {
    return {
      filterMapping: {},
      dragging: false,
      pagination: {
        limit: this.limit || 50,
        offset: 0,
        order: [this.sortKey || 'id', 'asc']
      },
      searchFilter: null,
      page: 1,
      count: 0
    };
  },
  props: {
    headers: Array,
    data: Array,
    query: Object,
    updateQuery: Object,
    name: String,
    tableName: String,
    filter: Object,
    variables: Object,
    countFilter: Object,
    sortKey: String,
    itemsCount: Number,
    limit: Number,
    getRowColor: Function,
    canDrag: Boolean,
    textKey: {
      type: String,
      default() {
        return this.name;
      }
    },
    onePage: Boolean,
    update: Object,
    withHeader: Boolean,
    title: String,
    searchFilters: Array,
    modal: String,
    canEdit: Boolean,
    deleteQuery: Object,
    subscriptions: Object,
    defaultItem: Object
  },
  created() {
    if (this.subscriptions) {
      this.$addSubscriptions(
        this.subscriptions.prefix ||
          this.name.substring(0, this.name.length - 1),
        this.name,
        this.subscriptions,
        undefined,
        false,
        'items'
      );
    }
  },
  apollo: {
    items: {
      query() {
        return this.query;
      },
      variables() {
        return this.variables
          ? {
              ...this.variables,
              pagination: this.pagination,
              search: this.searchFilter
            }
          : {
              pagination: this.onePage ? null : this.pagination,
              filter: this.filter,
              search: this.searchFilter
            };
      },
      update(data) {
        return data[this.name];
      },
      skip() {
        return !this.query;
      }
    },
    count: {
      query: GQL_COUNT,
      variables() {
        return {
          table: this.tableName || this.name,
          filter: this.countFilter
        };
      },
      skip() {
        return this.onePage || this.itemsCount;
      }
    }
  },
  mounted() {
    if (this.data) {
      this.items = this.data;
    }
    if (this.update) {
      const { name, query, reset } = this.update;
      this.$apollo.addSmartSubscription(name, {
        query,
        result({ data: { [name]: data } }) {
          if (reset) {
            this.items = data;
          } else {
            // TODO: REDO IT (key can be different or ...)
            const item = this.items.find(item => item.id === data.id);
            if (item) {
              Object.assign(item, data);
            }
          }
        }
      });
    }
  },
  methods: {
    sort(key) {
      const [oldKey, oldDirection] = this.pagination.order;
      this.pagination.order = [
        key,
        oldKey === key ? (oldDirection === 'ASC' ? 'DESC' : 'ASC') : 'ASC'
      ];
      this.page = 1;
      this.$apollo.queries.items.refetch();
    },
    move({ newIndex: position }) {
      this.$apollo.mutate({
        mutation: this.updateQuery,
        variables: {
          id: this.items[position].id,
          input: {
            position
          }
        }
      });
    },
    deleteItem({ id }) {
      this.$apollo
        .mutate({
          mutation: this.deleteQuery,
          variables: {
            id
          }
        })
        .catch(this.$showError);
    },
    search(filterMapping, isFilterMode) {
      if (!isFilterMode) {
        const filters = Object.entries(filterMapping);
        this.searchFilter = filters.length
          ? filters.reduce((map, [key, value]) => {
              const normalKey = key.split(':')[0];
              if (!map[normalKey]) {
                map[normalKey] = [];
              }
              map[normalKey].push(value.id);
              return map;
            }, {})
          : null;
      }
    }
  },
  watch: {
    page() {
      this.pagination.offset = (this.page - 1) * this.pagination.limit;
      this.$apollo.queries.items.refetch();
    },
    itemsCount() {
      this.count = this.itemsCount;
    }
  },
  computed: {
    pagesCount() {
      return Math.ceil(this.count / this.pagination.limit);
    }
  }
};
</script>

<style lang="sass">
.sortable
  &-chosen
    cursor: pointer
    background-color: $light
  &-ghost
    background-color: $gray
    color: $white
.action-icon
  margin: 0 .5rem
  cursor: pointer
</style>
