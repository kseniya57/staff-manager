<template>
  <div class="box" v-ma="2" v-pa="2" v-color="'base'">
    <v-table
      :headers="headers"
      :query="GQL_PAYROLLS"
      name="payrolls"
      tableName="payrolls"
      :withHeader="true"
      :title="text.menu.payrolls"
      modal="payroll"
      :subscriptions="subscriptions"
      :searchFilters="searchFilters"
    />
  </div>
</template>

<script>
import { VTable } from '@/components/Common';
import {
  GQL_PAYROLLS,
  GQL_PAYROLL_ADDED,
  GQL_PAYROLL_UPDATED,
  GQL_PAYROLL_DELETED,
  GQL_POSITIONS,
  GQL_DEPARTMENTS
} from '@/graphql';
import { moneyFormat } from '@/filters/money';

export default {
  components: {
    VTable
  },
  data() {
    return {
      GQL_PAYROLLS,
      headers: [
        { key: 'id', value: '#', width: '70' },
        { key: 'createdAt', value: 'createdAt' },
        {
          key: 'amount',
          value: 'amount',
          process: value => moneyFormat(value)
        },
        {
          key: 'month',
          value: 'month',
          process: value =>
            isNotNull(value) ? this.text.months[value].name : null
        },
        { key: 'year', value: 'year' },
        {
          key: 'type',
          value: 'type',
          process: value => this.text.payrolls.types[value]
        }
      ],
      subscriptions: {
        added: GQL_PAYROLL_ADDED,
        updated: GQL_PAYROLL_UPDATED,
        deleted: GQL_PAYROLL_DELETED,
        all: GQL_PAYROLLS
      }
    };
  },
  computed: {
    searchFilters() {
      const { filters, months } = this.text;

      return [
        {
          icon: 'event',
          name: filters.month,
          value: 'month',
          values: months.map(({ value, name }) => ({ id: value, name })),
          type: 'array'
        },
        {
          icon: 'calendar_today',
          name: filters.year,
          value: 'year',
          type: 'like'
        },
        {
          icon: 'work',
          name: filters.positions,
          storeKey: 'positions',
          value: 'positionId',
          query: GQL_POSITIONS,
          type: 'array'
        },
        {
          icon: 'group_work',
          name: filters.departments,
          storeKey: 'departments',
          value: 'departmentId',
          query: GQL_DEPARTMENTS,
          type: 'array'
        },
        {
          icon: 'invert_colors',
          name: filters.type,
          value: 'type',
          values: Object.entries(this.text.payrolls.types).map(
            ([id, name]) => ({
              id,
              name
            })
          ),
          type: 'array'
        }
      ];
    }
  }
};
</script>
