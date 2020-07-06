<template>
  <div class="box" v-ma="2" v-pa="2" v-color="'base'">
    <v-table
      :headers="headers"
      :query="GQL_USERS"
      name="users"
      :withHeader="true"
      :title="text.menu.users"
      :searchFilters="searchFilters"
      modal="user"
      :subscriptions="subscriptions"
    />
  </div>
</template>

<script>
import { VTable } from '@/components/Common';
import {
  GQL_USERS,
  GQL_POSITIONS,
  GQL_DEPARTMENTS,
  GQL_TAGS,
  GQL_SKILLS,
  GQL_USER_ADDED,
  GQL_USER_UPDATED,
  GQL_USER_DELETED
} from '@/graphql';

export default {
  components: {
    VTable
  },
  data() {
    return {
      GQL_USERS,
      headers: [
        { key: 'id', value: '#', width: '70', sort: true },
        { key: 'avatar', value: 'avatar', type: 'image' },
        { key: 'name', value: 'name' },
        { key: 'email', value: 'E-Mail', sort: true },
        { key: 'phone', value: 'phone' },
        {
          key: 'salary',
          value: 'salary',
          type: 'action',
          button: true,
          color: 'transparent',
          action: user => this.$showModal('payroll', { payroll: { user } })
        },
        {
          key: 'open',
          value: 'open',
          type: 'action',
          button: true,
          color: 'transparent',
          action: user => this.$showModal('user', { id: user.id })
        }
      ],
      subscriptions: {
        added: GQL_USER_ADDED,
        updated: GQL_USER_UPDATED,
        deleted: GQL_USER_DELETED,
        all: GQL_USERS
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
          icon: 'group_work',
          name: filters.departments,
          value: 'departments',
          query: GQL_DEPARTMENTS,
          type: 'array'
        },
        {
          icon: 'label',
          name: filters.tags,
          value: 'tags',
          query: GQL_TAGS,
          type: 'array'
        },
        {
          icon: 'extension',
          name: filters.skills,
          value: 'skills',
          query: GQL_SKILLS,
          type: 'array'
        },
        {
          icon: 'email',
          name: filters.email,
          value: 'email',
          type: 'like'
        },
        {
          icon: 'face',
          name: filters.firstName,
          value: 'firstName',
          type: 'like'
        },
        {
          icon: 'face',
          name: filters.lastName,
          value: 'lastName',
          type: 'like'
        }
      ];
    }
  }
};
</script>
