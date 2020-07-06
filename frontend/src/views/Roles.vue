<template>
  <div class="box" v-ma="2" v-pa="2" v-color="'base'">
    <v-table
      :headers="headers"
      :query="GQL_ROLES"
      name="roles"
      tableName="roles"
      :withHeader="true"
      :title="text.menu.roles"
      modal="role"
      :canEdit="true"
      :deleteQuery="GQL_DELETE_ROLE"
      :subscriptions="subscriptions"
    />
  </div>
</template>

<script>
import { VTable } from '@/components/Common';
import {
  GQL_ROLES,
  GQL_DELETE_ROLE,
  GQL_ROLE_ADDED,
  GQL_ROLE_UPDATED,
  GQL_ROLE_DELETED
} from '@/graphql';

export default {
  components: {
    VTable
  },
  data() {
    return {
      GQL_ROLES,
      GQL_DELETE_ROLE,
      headers: [
        { key: 'id', value: '#', width: '70' },
        { key: 'name', value: 'name' }
      ],
      subscriptions: {
        added: GQL_ROLE_ADDED,
        updated: GQL_ROLE_UPDATED,
        deleted: GQL_ROLE_DELETED,
        all: GQL_ROLES
      }
    };
  }
};
</script>
