<template>
  <div>
    <table-select
      :headers="headers"
      v-model="wages"
      @delete="deleteWage"
      @edit="updateWage"
      textKey="wages"
      style="overflow-y: auto"
    ></table-select>
  </div>
</template>

<script>
import {
  GQL_DEPARTMENTS,
  GQL_POSITIONS,
  GQL_DELETE_WAGE,
  GQL_UPDATE_WAGE,
  GQL_ADD_WAGE,
  // GQL_WAGE_ADDED,
  // GQL_WAGE_UPDATED,
  // GQL_WAGE_DELETED,
  GQL_WAGES
} from '@/graphql';
import { TableSelect } from '@/components/Controls';
import { moneyFormat } from '@/filters/money';

export default {
  props: ['userId'],
  components: {
    TableSelect
  },
  data: () => ({
    wages: []
  }),
  apollo: {
    wages: {
      query: GQL_WAGES,
      variables() {
        return { filter: { userId: this.userId } };
      }
    }
  },
  computed: {
    headers() {
      const statuses = Object.entries(this.text.wages.statuses).map(
        ([value, name]) => ({ name, value })
      );
      return [
        {
          key: 'department',
          value: 'department',
          type: 'select',
          query: GQL_DEPARTMENTS,
          name: 'departments',
          nameKey: 'name'
        },
        {
          key: 'position',
          value: 'position',
          type: 'select',
          query: GQL_POSITIONS,
          name: 'positions',
          nameKey: 'name'
        },
        {
          key: 'status',
          value: 'status',
          type: 'select',
          values: statuses,
          initialValue: value => this.text.wages.statuses[value],
          nameKey: 'name'
        },
        { key: 'blackSalary', value: 'blackSalary', type: 'money-input' },
        { key: 'whiteSalary', value: 'whiteSalary', type: 'money-input' },
        {
          key: 'salary',
          value: row =>
            moneyFormat((row.blackSalary || 0) + (row.whiteSalary || 0)),
          type: 'text'
        },
        {
          key: 'paidSalary',
          value: row =>
            moneyFormat(
              (row.paidBlackSalary || 0) + (row.paidWhiteSalary || 0)
            ),
          type: 'text'
        },
        {
          key: 'remainingSalary',
          value: row =>
            moneyFormat(
              (row.blackSalary || 0) +
                (row.whiteSalary || 0) -
                ((row.paidBlackSalary || 0) + (row.paidWhiteSalary || 0))
            ),
          type: 'text'
        }
      ];
    }
  },
  // TODO: if we will add subscriptions for wages then delete apollo: { wages ... } and uncomment this
  // created() {
  //   this.$addSubscriptions('wage', 'wages', {
  //     added: GQL_WAGE_ADDED,
  //     updated: GQL_WAGE_UPDATED,
  //     deleted: GQL_WAGE_DELETED,
  //     all: GQL_WAGES
  //   }, { filter: { userId: this.userId } }, true)
  // },
  methods: {
    deleteWage(id) {
      this.$apollo
        .mutate({
          mutation: GQL_DELETE_WAGE,
          variables: {
            id
          }
        })
        .catch(this.$showError);
    },
    async updateWage(wage) {
      const { id, department, position, blackSalary, whiteSalary } = wage;
      if (department.id && position.id) {
        this.$apollo
          .mutate({
            mutation: id ? GQL_UPDATE_WAGE : GQL_ADD_WAGE,
            variables: {
              id,
              input: {
                departmentId: department.id,
                positionId: position.id,
                userId: this.userId,
                blackSalary,
                whiteSalary
              }
            }
          })
          .catch(this.$showError);
      } else {
        this.$showError('Выберите отдел и должность');
      }
    }
  }
};
</script>

<style scoped></style>
