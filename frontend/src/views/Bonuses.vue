<template>
  <div class="box" v-ma="2" v-pa="2" v-color="'base'">
    <v-table
      :headers="headers"
      :query="GQL_BONUSES"
      name="bonuses"
      tableName="bonuses"
      :withHeader="true"
      :title="text.menu.bonuses"
      modal="bonus"
      :canEdit="true"
      :deleteQuery="GQL_DELETE_BONUS"
      :subscriptions="subscriptions"
    />
  </div>
</template>

<script>
import { VTable } from '@/components/Common';
import {
  GQL_BONUSES,
  GQL_DELETE_BONUS,
  GQL_BONUS_ADDED,
  GQL_BONUS_UPDATED,
  GQL_BONUS_DELETED
} from '@/graphql';
import { moneyFormat } from '@/filters/money';

export default {
  components: {
    VTable
  },
  data() {
    return {
      GQL_BONUSES,
      GQL_DELETE_BONUS,
      headers: [
        { key: 'id', value: '#', width: '70' },
        { key: 'name', value: 'name' },
        { key: 'amount', value: 'amount', process: value => moneyFormat(value) }
      ],
      subscriptions: {
        added: GQL_BONUS_ADDED,
        updated: GQL_BONUS_UPDATED,
        deleted: GQL_BONUS_DELETED,
        all: GQL_BONUSES,
        prefix: 'bonus'
      }
    };
  }
};
</script>
