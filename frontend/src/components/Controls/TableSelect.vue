<template>
  <div class="table-select__wrapper">
    <v-fade-transition>
      <table class="table" v-if="items">
        <thead>
          <tr>
            <td
              v-for="cell in headers"
              :key="cell.key"
              :width="cell.width || 'auto'"
            >
              {{ text[textKey][cell.key] || cell.value }}
            </td>
            <td width="70">
              <v-icon name="edit" v-text-color="'white'"></v-icon>
            </td>
            <td width="50">
              <v-icon name="delete" v-text-color="'white'"></v-icon>
            </td>
          </tr>
        </thead>
        <template v-for="(row, index) in items">
          <v-fade-transition :key="index">
            <tr class="table-select__item">
              <td
                v-for="cell in headers"
                :key="cell.key"
                class="table-select__cell"
              >
                <v-select
                  v-if="cell.type === 'select'"
                  v-model="row[cell.value]"
                  :initialValue="
                    cell.initialValue
                      ? cell.initialValue(row[cell.value])
                      : row[cell.value]
                      ? row[cell.value][cell.nameKey] || row[cell.value]
                      : ''
                  "
                  :items="cell.values || filters[cell.name]"
                  :closeOnSelect="true"
                  :clearOnSelect="false"
                  :nameKey="cell.nameKey"
                  inputStyle="border: none;border-radius: 0"
                  :disabled="index !== editingIndex"
                ></v-select>
                <v-input
                  v-model="row[cell.value]"
                  v-else-if="cell.type === 'input'"
                  class="table-select__control"
                  :disabled="index !== editingIndex"
                  inputStyle="border: none;border-radius: 0"
                ></v-input>
                <money-input
                  v-model="row[cell.value]"
                  v-else-if="cell.type === 'money-input'"
                  class="table-select__control"
                  :disabled="index !== editingIndex"
                  inputStyle="border: none;border-radius: 0"
                ></money-input>
                <span v-else>
                  {{
                    typeof cell.value === 'function'
                      ? cell.value(row)
                      : cell.nameKey
                      ? row[cell.value][cell.nameKey]
                      : row[cell.value]
                  }}
                </span>
              </td>
              <td class="table-select__cell">
                <v-icon
                  v-if="index !== editingIndex"
                  name="edit"
                  v-text-color="'primary'"
                  @click.stop="editingIndex = index"
                ></v-icon>
                <v-button
                  v-else
                  @click.stop="stopEditing(row)"
                  class="table-select__button"
                  style="min-width: 0"
                  >{{ text.actions.ok }}</v-button
                >
              </td>
              <td class="table-select__cell">
                <v-icon
                  name="delete"
                  v-text-color="'white'"
                  @click.stop="deleteItem(row, index)"
                ></v-icon>
              </td>
            </tr>
          </v-fade-transition>
        </template>
      </table>
    </v-fade-transition>
    <div class="add-button df aic jcc">
      <v-button
        v-color="'white'"
        v-circle="3"
        @click.stop="items.push({})"
        style="padding: 0;min-width: 0"
      >
        <v-icon name="add" size="2" v-text-color="'primary'"></v-icon>
      </v-button>
    </div>
  </div>
</template>

<script>
import { VSelect, VInput, MoneyInput } from '@/components/Controls';
import { VFadeTransition } from '@/components/Transitions';

export default {
  model: {
    prop: 'items'
  },
  props: {
    headers: Array,
    value: Array,
    textKey: String,
    items: Array
  },
  components: {
    VSelect,
    VInput,
    MoneyInput,
    VFadeTransition
  },
  data: () => ({
    filters: {},
    tmp: null,
    editingIndex: null
  }),
  mounted() {
    this.headers.forEach(item => {
      if (item.query) {
        this.$apollo.addSmartQuery('tmp', {
          query: item.query,
          variables: item.variables,
          update({ [item.name]: data }) {
            this.filters[item.name] = data;
            return data;
          }
        });
      }
    });
  },
  methods: {
    stopEditing(item) {
      this.$emit('edit', item);
      this.editingIndex = null;
    },
    deleteItem(item, index) {
      if (item.id) {
        this.$emit('delete', item.id);
      } else {
        this.$emit('input', this.items.filter((_, i) => index !== i));
      }
    }
  }
};
</script>

<style scoped lang="sass">
.table
    overflow: visible
    border-left: .2rem solid $primary
    border-bottom: 2px solid $primary
.table-select
    &__wrapper
        padding-bottom: 7rem
    &__item
        height: 4rem
    &__cell
        padding: 0
        background-color: $white
        border: $devider
        &:last-child
            background-color: $primary


.add-button
    width: 100%
    height: 6rem
    transform: translateY(0px)
    background-color: $primary
    clip-path: polygon(0 0, 50% 100%, 100% 0)
</style>
