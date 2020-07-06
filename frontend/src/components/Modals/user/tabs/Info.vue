<template>
  <div v-if="user">
    <account-box
      class="asc"
      :settings="false"
      :user="user"
      @update="({ avatar }) => $set(user, 'avatar', avatar)"
      v-mb="2"
    />
    <div v-mb="2" class="df">
      <v-input
        v-model="user.lastName"
        :label="text.users.lastName"
        v-mx="0.5"
      />
      <v-input
        v-model="user.firstName"
        :label="text.users.firstName"
        v-mx="0.5"
      />
      <v-input
        v-model="user.middleName"
        :label="text.users.middleName"
        v-mx="0.5"
      />
    </div>
    <div v-mb="2" class="df">
      <v-input v-model="user.email" :label="text.users.email" v-mx="0.5" />
      <v-input v-model="user.phone" :label="text.users.phone" v-mx="0.5" />
      <v-input v-model="user.card" :label="text.users.card" v-mx="0.5" />
    </div>
    <v-textarea
      :label="text.users.bio"
      v-model="user.bio"
      v-mb="2"
    ></v-textarea>
    <tag-input
      v-if="user.tags"
      v-model="user.tags"
      v-mb="2"
      :label="text.users.tags"
      :query="GQL_TAGS"
      :mutation="GQL_ADD_TAG"
      type="Tag"
      storeKey="tags"
    >
    </tag-input>
    <tag-input
      v-if="user.skills"
      v-model="user.skills"
      v-mb="2"
      :label="text.users.skills"
      :query="GQL_SKILLS"
      :mutation="GQL_ADD_SKILL"
      type="Skill"
      storeKey="skills"
    >
    </tag-input>
    <div v-if="user.socialNetworks" class="df jcc aic" v-mb="2">
      <div
        v-for="network in user.socialNetworks"
        :key="network.id"
        v-mx="1"
        class="df aic jcc fdc"
      >
        <a
          :href="`${network.link}/${network.nickname || ''}`"
          target="_blank"
          v-mb="1"
        >
          <v-image :src="network.image" v-circle="3"></v-image>
        </a>
        <v-input
          v-model="network.nickname"
          inputStyle="height: 3rem;text-align: center"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AccountBox from '@/components/AccountBox';
import { VInput, VTextarea, TagInput } from '@/components/Controls';
import { GQL_SKILLS, GQL_ADD_SKILL, GQL_TAGS, GQL_ADD_TAG } from '@/graphql';
export default {
  model: {
    prop: 'user',
    event: 'input'
  },
  data: () => ({
    GQL_ADD_SKILL,
    GQL_SKILLS,
    GQL_TAGS,
    GQL_ADD_TAG
  }),
  props: ['user'],
  components: {
    AccountBox,
    VInput,
    VTextarea,
    TagInput
  }
};
</script>

<style scoped></style>
