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
      :variables="variables"
      :defaultItem="{ user }"
    />
  </div>
</template>

<script>
import { VTable } from '@/components/Common';
import {
  GQL_PAYROLLS,
  GQL_PAYROLL_ADDED,
  GQL_PAYROLL_UPDATED,
  GQL_PAYROLL_DELETED
} from '@/graphql';
import { moneyFormat } from '@/filters/money';

export default {
  props: ['user'],
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
            isNotNull(value) ? this.text.months[value].name : undefined
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
      },
      variables: { filter: { userId: this.userId } }
    };
  }
};
</script>
