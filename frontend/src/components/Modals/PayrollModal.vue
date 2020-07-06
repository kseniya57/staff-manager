<template>
  <div class="box payroll-modal df fdc ais" v-color="'white'">
    <v-select
      v-model="payroll.user"
      :initialValue="getUserName(payroll.user)"
      :items="users"
      :closeOnSelect="true"
      :clearOnSelect="false"
      :label="text.payrolls.user"
      imageField="avatar"
      v-mb="2"
      :getName="getUserName"
    ></v-select>
    <v-fade-transition>
      <v-select
        v-if="wages && wages.length"
        v-model="payroll.wage"
        :initialValue="getWageName(wages[0])"
        :items="wages"
        :closeOnSelect="true"
        :clearOnSelect="false"
        :label="text.payrolls.wage"
        v-mb="2"
        :getName="getWageName"
        @input="changePaidSalaryInfo"
      ></v-select>
    </v-fade-transition>
    <v-select
      v-model="payroll.type"
      v-if="payroll.type"
      :initialValue="payroll.type.name"
      :items="types"
      :closeOnSelect="true"
      :clearOnSelect="false"
      :label="text.payrolls.type"
      v-mb="2"
      @input="changePaidSalaryInfo"
    ></v-select>
    <v-fade-transition>
      <div class="df" v-if="payroll.wage" v-mb="2">
        <money-input
          v-mr="1"
          :label="text.wages.paidSalary"
          :value="paidSalary"
          :disabled="true"
        >
        </money-input>
        <money-input
          :label="text.wages.remainingSalary"
          :value="remainingSalary"
          :disabled="true"
        >
        </money-input>
      </div>
    </v-fade-transition>
    <v-fade-transition>
      <money-input
        v-if="this.payroll.wage && this.remainingSalary > 0"
        v-model="payroll.amount"
        :label="text.payrolls.amount"
        v-mb="2"
        :max="this.remainingSalary"
      ></money-input>
    </v-fade-transition>
    <div class="df aifs" v-mb="2">
      <v-select
        v-if="payroll.month"
        v-model="payroll.month"
        :initialValue="payroll.month.name"
        :items="text.months"
        :closeOnSelect="true"
        :clearOnSelect="false"
        :label="text.payrolls.month"
        class="expanded"
        v-mr="1"
      ></v-select>
      <v-input
        v-model="payroll.year"
        :label="text.payrolls.year"
        type="number"
        class="expanded"
      />
    </div>
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
  GQL_ADD_PAYROLL,
  GQL_UPDATE_PAYROLL,
  GQL_USERS,
  GQL_WAGES
} from '@/graphql';
import { VInput, VSelect, MoneyInput } from '@/components/Controls';
import { VFadeTransition } from '@/components/Transitions';
import { capitalize } from '@/utils/helpers';

export default {
  components: {
    VInput,
    VSelect,
    MoneyInput,
    VFadeTransition
  },
  props: {
    payroll: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      users: [],
      paidSalary: 0,
      remainingSalary: 0,
      wages: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (isNotNull(this.payroll.month)) {
        this.$set(this.payroll, 'month', this.text.months[this.payroll.month]);
      } else {
        const date = new Date();
        this.$set(this.payroll, 'month', this.text.months[date.getMonth()]);
        this.$set(this.payroll, 'year', date.getFullYear());
      }
      const { type } = this.payroll;
      this.$set(
        this.payroll,
        'type',
        type
          ? (this.payroll.type = this.types.find(
              type => type.value === type
            )[0])
          : this.types[0]
      );
    });
  },
  apollo: {
    users: GQL_USERS,
    wages: {
      query: GQL_WAGES,
      fetchPolicy: 'no-cache',
      variables() {
        return {
          filter: { userId: this.payroll.user.id },
          payrollFilter: {
            month: +this.payroll.month.value,
            year: +this.payroll.year
          }
        };
      },
      update({ wages }) {
        this.$set(this.payroll, 'wage', wages.length ? wages[0] : null);
        this.$set(this.payroll.user, 'wages', wages);
        this.$set(this.payroll, 'type', this.types[0]);
        this.changePaidSalaryInfo();
        return wages;
      },
      skip() {
        return !this.payroll.user || !this.payroll.month;
      }
    }
  },
  methods: {
    save() {
      const { id, amount, type, month, year, wage } = this.payroll;
      if (!wage) {
        this.$showError('Выберите отдел и должность');
        return;
      }
      if (amount > 0) {
        this.$apollo
          .mutate({
            mutation: id ? GQL_UPDATE_PAYROLL : GQL_ADD_PAYROLL,
            variables: {
              id,
              input: {
                amount,
                type: type.value,
                wageId: wage.id,
                month: +month.value,
                year: +year
              }
            }
          })
          .then(this.$closeModal)
          .catch(this.$showError);
      } else {
        this.$showError('Сумма должна быть больше 0');
      }
    },
    cancel() {
      this.$closeModal();
    },
    getWageName(wage) {
      return wage
        ? `${wage.department.name}, ${wage.position.name}${
            wage.whiteSalary > 0 ? ` | ${wage.whiteSalary} ₽ (б)` : ''
          }${wage.blackSalary > 0 ? `| ${wage.blackSalary} ₽ (ч) ` : ''}`
        : '';
    },
    getUserName(user) {
      return user ? `${user.name} (${user.email})` : undefined;
    },
    changePaidSalaryInfo() {
      const { wage } = this.payroll;
      if (wage) {
        this.paidSalary = wage[this.paidTypes[this.payroll.type.value]];
        this.remainingSalary = wage[this.payroll.type.value] - this.paidSalary;
        this.$set(this.payroll, 'amount', this.remainingSalary);
      }
    },
    refresh() {
      this.$apollo.queries.wages.refresh();
    }
  },
  computed: {
    types() {
      return Object.entries(this.text.payrolls.types).map(([value, name]) => ({
        value,
        name
      }));
    },
    paidTypes() {
      return Object.keys(this.text.payrolls.types).reduce(
        (map, key) => Object.assign(map, { [key]: `paid${capitalize(key)}` }),
        {}
      );
    }
  }
};
</script>

<style lang="sass" scoped>
.payroll-modal
    padding: 1rem
    max-height: 90vh
    width: 50rem
    max-width: 90vw
</style>
