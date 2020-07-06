<template>
  <div class="box" v-ma="2" v-pa="2" v-color="'base'">
    <v-table
      :headers="headers"
      :query="GQL_EXPENSES"
      name="expenses"
      tableName="expenses"
      :withHeader="true"
      :title="text.menu.expenses"
      modal="expense"
      :canEdit="true"
      :deleteQuery="GQL_DELETE_EXPENSE"
      :subscriptions="subscriptions"
    />
  </div>
</template>

<script>
import { VTable } from '@/components/Common';
import {
  GQL_EXPENSES,
  GQL_DELETE_EXPENSE,
  GQL_EXPENSE_ADDED,
  GQL_EXPENSE_UPDATED,
  GQL_EXPENSE_DELETED
} from '@/graphql';
import { moneyFormat } from '@/filters/money';

export default {
  components: {
    VTable
  },
  data() {
    return {
      GQL_EXPENSES,
      GQL_DELETE_EXPENSE,
      headers: [
        { key: 'id', value: '#', width: '70' },
        { key: 'type', value: 'type' },
        { key: 'amount', value: 'amount', process: value => moneyFormat(value) }
      ],
      subscriptions: {
        added: GQL_EXPENSE_ADDED,
        updated: GQL_EXPENSE_UPDATED,
        deleted: GQL_EXPENSE_DELETED,
        all: GQL_EXPENSES
      }
    };
  }
};
</script>
