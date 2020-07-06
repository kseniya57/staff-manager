<template>
  <v-fade-transition>
    <div v-if="isOpen" class="modal df aic jcc">
      <v-icon
        name="close"
        class="modal__close pointer"
        size="lg"
        @click.stop="close"
      ></v-icon>
      <div @click.stop="() => null">
        <v-fade-transition>
          <component
            v-if="currentModal"
            :is="modals[currentModal.name]"
            v-bind="currentModal.data"
          />
        </v-fade-transition>
      </div>
    </div>
  </v-fade-transition>
</template>

<script>
import Vue from 'vue';
import {
  ImageModal,
  UserModal,
  SocialNetworkModal,
  BonusModal,
  DepartmentModal,
  PositionModal,
  ExpenseModal,
  PayrollModal,
  RightModal,
  RoleModal
} from '@/components/Modals';
import closeable from '@/mixins/closeable';
import { VFadeTransition } from '@/components/Transitions';

export default {
  components: {
    ImageModal,
    UserModal,
    VFadeTransition
  },
  mixins: [closeable],
  data: () => ({
    openedModals: {},
    currentModal: null,
    data: null,
    modals: {
      image: ImageModal,
      user: UserModal,
      socialNetwork: SocialNetworkModal,
      bonus: BonusModal,
      department: DepartmentModal,
      position: PositionModal,
      expense: ExpenseModal,
      payroll: PayrollModal,
      right: RightModal,
      role: RoleModal
    }
  }),
  created() {
    Vue.prototype.$showModal = this.show;
    Vue.prototype.$closeModal = this.close;
  },
  methods: {
    show(name, data = {}) {
      this.$set(this.openedModals, name, data);
      this.openedModals[name] = {
        name,
        data
      };
      if (this.currentModal) {
        this.currentModal = null;
        setTimeout(() => {
          this.currentModal = this.openedModals[name];
        }, 280);
      } else {
        this.currentModal = this.openedModals[name];
      }
    },
    // close last modal
    close() {
      this.$delete(this.openedModals, this.lastModal.name);
      this.currentModal = null;
      if (this.isOpen) {
        setTimeout(() => {
          this.currentModal = this.lastModal;
        }, 280);
      }
    }
  },
  computed: {
    openedModalNames() {
      return Object.keys(this.openedModals);
    },
    isOpen() {
      return this.openedModalNames.length;
    },
    lastModalName() {
      return this.openedModalNames[this.isOpen - 1];
    },
    lastModal() {
      return this.openedModals[this.lastModalName];
    }
  }
};
</script>

<style lang="sass" scoped>
.modal
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: rgba(#000000, .9)

    &__close
        position: absolute
        top: 1rem
        right: 1rem

        &:hover
            color: $white !important
</style>
