<template>
  <div class="box" v-ma="2" v-pa="1" v-color="'base'">
    <v-table
      :headers="headers"
      :query="GQL_EXPENSES"
      name="expenses"
      tableName="expenses"
      :deleteQuery="GQL_DELETE_EXPENSE"
    />
  </div>
</template>

<script>
import { VTable } from '@/components/Common';
import { GQL_EXPENSES, GQL_DELETE_EXPENSE } from '@/graphql';
import { moneyFormat } from '@/filters/money';
// TODO: add filter by userId or get from user
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
      ]
    };
  }
};
</script>
