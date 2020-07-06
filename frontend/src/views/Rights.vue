<template>
  <div class="box" v-ma="2" v-pa="2" v-color="'base'">
    <v-table
      :headers="headers"
      :query="GQL_RIGHTS"
      name="rights"
      tableName="rights"
      :withHeader="true"
      :title="text.menu.rights"
      modal="right"
      :canEdit="true"
      :deleteQuery="GQL_DELETE_RIGHT"
      :subscriptions="subscriptions"
    />
  </div>
</template>

<script>
import { VTable } from '@/components/Common';
import {
  GQL_RIGHTS,
  GQL_DELETE_RIGHT,
  GQL_RIGHT_ADDED,
  GQL_RIGHT_UPDATED,
  GQL_RIGHT_DELETED
} from '@/graphql';

export default {
  components: {
    VTable
  },
  data() {
    return {
      GQL_RIGHTS,
      GQL_DELETE_RIGHT,
      headers: [
        { key: 'id', value: '#', width: '70' },
        { key: 'name', value: 'name' },
        { key: 'description', value: 'description' }
      ],
      subscriptions: {
        added: GQL_RIGHT_ADDED,
        updated: GQL_RIGHT_UPDATED,
        deleted: GQL_RIGHT_DELETED,
        all: GQL_RIGHTS
      }
    };
  }
};
</script>
