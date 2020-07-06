<template>
  <div class="df fdc">
    <div class="expanded comments-box df fdc">
      <div
        class="comment"
        v-for="comment in comments"
        :key="comment.id"
        v-mb="1"
        @contextmenu="
          e => $showContextMenu(e, 'actions', getActionsMenuData(comment))
        "
      >
        <div class="df aic jcsb" v-mb="0.5">
          <div class="df aic">
            <v-image
              v-circle="2"
              :src="comment.createdBy.avatar"
              v-mr="0.5"
            ></v-image>
            <span class="text--black">{{
              comment.createdBy.name || comment.createdBy.email
            }}</span>
          </div>
          <span class="text--xxs">{{ comment.createdAt }}</span>
        </div>
        <div class="comment__content" v-mb="1">{{ comment.content }}</div>
        <rating :value="comment.rating" />
      </div>
    </div>
    <div class="editor-box">
      <div class="editor-box__controls df jcsb aic" v-mb="0.5">
        <rating v-model="comment.rating" />
        <v-button @click.stop="saveComment">{{ text.actions.ok }}</v-button>
      </div>
      <v-textarea v-model="comment.content"></v-textarea>
    </div>
  </div>
</template>

<script>
import { VTextarea, Rating } from '@/components/Controls';
import {
  GQL_ADD_COMMENT,
  GQL_UPDATE_COMMENT,
  GQL_DELETE_COMMENT,
  GQL_COMMENT_ADDED,
  GQL_COMMENT_UPDATED,
  GQL_COMMENT_DELETED,
  GQL_COMMENTS
} from '@/graphql';
export default {
  props: ['userId'],
  components: {
    VTextarea,
    Rating
  },
  data: () => ({
    comment: {},
    comments: []
  }),
  created() {
    this.$addSubscriptions(
      'comment',
      'comments',
      {
        added: GQL_COMMENT_ADDED,
        updated: GQL_COMMENT_UPDATED,
        deleted: GQL_COMMENT_DELETED,
        all: GQL_COMMENTS
      },
      { filter: { userId: this.userId } },
      true
    );
  },
  methods: {
    saveComment() {
      const { id, content, rating } = this.comment;
      this.$apollo
        .mutate({
          mutation: id ? GQL_UPDATE_COMMENT : GQL_ADD_COMMENT,
          variables: {
            id,
            input: { userId: this.userId, content, rating }
          }
        })
        .then(() => {
          this.comment = {};
        })
        .catch(this.$showError);
    },
    deleteComment(id) {
      this.$apollo
        .mutate({
          mutation: GQL_DELETE_COMMENT,
          variables: {
            id
          }
        })
        .catch(this.$showError);
    },
    getActionsMenuData(comment) {
      return {
        actions: [
          {
            name: 'edit',
            icon: 'edit',
            action: () => (this.comment = comment)
          },
          {
            name: 'delete',
            icon: 'delete',
            action: () => this.deleteComment(comment.id)
          }
        ]
      };
    }
  }
};
</script>

<style scoped lang="sass">
.editor-box
    overflow-y: auto
    height: 11rem

.comments-box
    padding: 1rem
    overflow-y: auto

.comment
    background-color: $white
    width: 49%
    word-break: break-all
    border: $devider
    border-radius: 1rem
    padding: 1rem
    &:nth-child(2n)
        align-self: flex-end
</style>
