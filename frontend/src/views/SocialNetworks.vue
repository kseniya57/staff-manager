<template>
  <div class="box" v-ma="2" v-pa="2" v-color="'base'">
    <v-table
      :headers="headers"
      :query="GQL_SOCIAL_NETWORKS"
      name="socialNetworks"
      tableName="social_networks"
      :withHeader="true"
      :title="text.menu.socialNetworks"
      modal="socialNetwork"
      :canEdit="true"
      :deleteQuery="GQL_DELETE_SOCIAL_NETWORK"
      :subscriptions="subscriptions"
    />
  </div>
</template>

<script>
import { VTable } from '@/components/Common';
import {
  GQL_SOCIAL_NETWORKS,
  GQL_DELETE_SOCIAL_NETWORK,
  GQL_SOCIAL_NETWORK_ADDED,
  GQL_SOCIAL_NETWORK_UPDATED,
  GQL_SOCIAL_NETWORK_DELETED
} from '@/graphql';

export default {
  components: {
    VTable
  },
  data() {
    return {
      GQL_SOCIAL_NETWORKS,
      GQL_DELETE_SOCIAL_NETWORK,
      headers: [
        { key: 'id', value: '#', width: '70' },
        { key: 'name', value: 'name' },
        { key: 'link', value: 'link' },
        { key: 'image', value: 'image', type: 'image' }
      ],
      subscriptions: {
        added: GQL_SOCIAL_NETWORK_ADDED,
        updated: GQL_SOCIAL_NETWORK_UPDATED,
        deleted: GQL_SOCIAL_NETWORK_DELETED,
        all: GQL_SOCIAL_NETWORKS
      }
    };
  }
};
</script>
