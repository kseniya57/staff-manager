<template>
  <div class="box" v-ma="2" v-pa="2" v-color="'base'">
    <v-table
      :headers="headers"
      :query="GQL_POSITIONS"
      name="positions"
      tableName="positions"
      :withHeader="true"
      :title="text.menu.positions"
      modal="position"
      :canEdit="true"
      :deleteQuery="GQL_DELETE_POSITION"
      :searchFilters="searchFilters"
      :subscriptions="subscriptions"
    />
  </div>
</template>

<script>
import { VTable } from '@/components/Common';
import {
  GQL_POSITIONS,
  GQL_DELETE_POSITION,
  GQL_DEPARTMENTS,
  GQL_POSITION_ADDED,
  GQL_POSITION_UPDATED,
  GQL_POSITION_DELETED
} from '@/graphql';
import { moneyFormat } from '@/filters/money';

export default {
  components: {
    VTable
  },
  data() {
    return {
      GQL_POSITIONS,
      GQL_DELETE_POSITION,
      headers: [
        { key: 'id', value: '#', width: '70' },
        { key: 'name', value: 'name' },
        {
          key: 'minSalary',
          value: 'minSalary',
          process: value => moneyFormat(value)
        },
        {
          key: 'maxSalary',
          value: 'maxSalary',
          process: value => moneyFormat(value)
        }
      ],
      subscriptions: {
        added: GQL_POSITION_ADDED,
        updated: GQL_POSITION_UPDATED,
        deleted: GQL_POSITION_DELETED,
        all: GQL_POSITIONS
      }
    };
  },
  computed: {
    searchFilters() {
      const { filters } = this.text;

      return [
        {
          icon: 'group_work',
          name: filters.departments,
          value: 'departments',
          query: GQL_DEPARTMENTS,
          type: 'array'
        },
        {
          icon: 'grade',
          name: filters.name,
          value: 'name',
          type: 'like'
        }
      ];
    }
  }
};
</script>
