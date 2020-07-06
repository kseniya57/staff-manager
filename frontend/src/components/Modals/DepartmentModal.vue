<template>
  <div class="box department-modal df fdc ais" v-color="'white'">
    <v-input
      v-model="department.name"
      :label="text.departments.name"
      v-mb="2"
    ></v-input>
    <v-fade-transition>
      <table-select
        v-if="department.id || department.name"
        :headers="headers"
        v-model="wages"
        @delete="deleteWage"
        @edit="updateWage"
        textKey="wages"
        style="overflow-y: auto"
      ></table-select>
    </v-fade-transition>
    <div class="df aic jcc">
      <v-button @click.stop="save" v-color="'accent'" v-mr="1">{{
        text.actions.ok
      }}</v-button>
      <v-button @click.stop="$closeModal" v-color="'gray'">{{
        text.actions.cancel
      }}</v-button>
    </div>
  </div>
</template>

<script>
import {
  GQL_ADD_DEPARTMENT,
  GQL_UPDATE_DEPARTMENT,
  GQL_DEPARTMENT,
  GQL_DELETE_WAGE,
  GQL_UPDATE_WAGE,
  GQL_ADD_WAGE,
  GQL_POSITIONS,
  GQL_USERS
} from '@/graphql';
import { VInput, TableSelect } from '@/components/Controls';
import { VFadeTransition } from '@/components/Transitions';
import { moneyFormat } from '@/filters/money';

export default {
  components: {
    VInput,
    TableSelect,
    VFadeTransition
  },
  props: {
    department: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    wages: [],
    headers: [
      {
        key: 'position',
        value: 'position',
        type: 'select',
        query: GQL_POSITIONS,
        name: 'positions',
        nameKey: 'name'
      },
      {
        key: 'user',
        value: 'user',
        type: 'select',
        query: GQL_USERS,
        name: 'users',
        nameKey: 'name'
      },
      { key: 'blackSalary', value: 'blackSalary', type: 'money-input' },
      { key: 'whiteSalary', value: 'whiteSalary', type: 'money-input' },
      {
        key: 'salary',
        value: row =>
          moneyFormat((row.blackSalary || 0) + (row.whiteSalary || 0)),
        type: 'text'
      }
    ]
  }),
  apollo: {
    wages: {
      query: GQL_DEPARTMENT,
      variables() {
        return { id: this.department.id };
      },
      update: ({ department }) => department.wages,
      skip() {
        return !this.department.id;
      }
    }
  },
  methods: {
    save() {
      this.updateDepartment().then(this.$closeModal);
      this.$closeModal();
    },
    updateDepartment() {
      const { id, name } = this.department;
      return this.$apollo
        .mutate({
          mutation: id ? GQL_UPDATE_DEPARTMENT : GQL_ADD_DEPARTMENT,
          variables: {
            id,
            input: { name }
          }
        })
        .catch(this.$showError);
    },
    cancel() {
      this.$closeModal();
    },
    deleteWage(id) {
      this.$apollo.mutate({
        mutation: GQL_DELETE_WAGE,
        variables: {
          id
        }
      });
    },
    async updateWage(wage) {
      const { id, user, position, blackSalary, whiteSalary } = wage;
      if (!this.department.id) {
        this.department.id = (await this.updateDepartment()).data.addDepartment;
      }
      if (this.department.id && position.id) {
        this.$apollo
          .mutate({
            mutation: id ? GQL_UPDATE_WAGE : GQL_ADD_WAGE,
            variables: {
              id,
              input: {
                departmentId: this.department.id,
                positionId: position.id,
                userId: user.id || null,
                blackSalary,
                whiteSalary
              }
            }
          })
          .catch(this.$showError);
      } else {
        this.$showError(
          this.department.id
            ? 'Отдел еще не сохранен'
            : 'Выберите должность из списка'
        );
      }
    }
  }
};
</script>

<style lang="sass" scoped>
.department-modal
    padding: 2rem
    max-height: 90vh
    width: 120rem
    max-width: 90vw
</style>
