<template>
  <div class="box" v-ma="2" v-pa="2" v-color="'base'">
    <v-table
      :headers="headers"
      :query="GQL_DEPARTMENTS"
      name="departments"
      tableName="departments"
      :withHeader="true"
      :title="text.menu.departments"
      modal="department"
      :canEdit="true"
      :deleteQuery="GQL_DELETE_DEPARTMENT"
      :searchFilters="searchFilters"
      :subscriptions="subscriptions"
    />
  </div>
</template>

<script>
import { VTable } from '@/components/Common';
import {
  GQL_DEPARTMENTS,
  GQL_DELETE_DEPARTMENT,
  GQL_POSITIONS,
  GQL_DEPARTMENT_ADDED,
  GQL_DEPARTMENT_UPDATED,
  GQL_DEPARTMENT_DELETED
} from '@/graphql';

export default {
  components: {
    VTable
  },
  data() {
    return {
      GQL_DEPARTMENTS,
      GQL_DELETE_DEPARTMENT,
      headers: [
        { key: 'id', value: '#', width: '70' },
        { key: 'name', value: 'name' },
        { key: 'createdAt', value: 'createdAt' }
      ],
      subscriptions: {
        added: GQL_DEPARTMENT_ADDED,
        updated: GQL_DEPARTMENT_UPDATED,
        deleted: GQL_DEPARTMENT_DELETED,
        all: GQL_DEPARTMENTS
      }
    };
  },
  computed: {
    searchFilters() {
      const { filters } = this.text;

      return [
        {
          icon: 'work',
          name: filters.positions,
          value: 'positions',
          query: GQL_POSITIONS,
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
