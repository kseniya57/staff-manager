import {
    Arg,
    Authorized, Ctx, FieldResolver,
    Int,
    Mutation,
    Publisher,
    PubSub,
    Query,
    Resolver,
    Root,
    Subscription,
} from 'type-graphql';
import {Pagination} from '../types/pagination.type';
import {commentsTable, usersTable} from '../models';
import {Comment, CommentFilter, CommentInput} from '../types/comment.type';
import {Context} from '../interfaces/context.interface';
import {User} from '../types/user.type';
import {processTimestamps} from '../utils/helpers';

enum Topic {
    commentAdded = 'EXPENSE_ADDED',
    commentUpdated = 'EXPENSE_UPDATED',
    commentDeleted = 'EXPENSE_DELETED',
}

@Resolver(of => Comment)
export class CommentResolver {
    @Authorized('READ_COMMENT')
    @Query(returns => [Comment], { description: 'Get all comments' })
    async comments(
        @Arg('filter', type => CommentFilter, { nullable: true }) filter?: CommentFilter,
        @Arg('pagination', type => Pagination, { nullable: true }) pagination?: Pagination,
    ): Promise<Comment[]> {
        // @ts-ignore
        return commentsTable.all(filter, '*', pagination).then(processTimestamps)
    }

    @Authorized('ADD_COMMENT')
    @Mutation(returns => Int, { description: 'Add a comment' })
    async addComment(
        @Arg('input', type => CommentInput) input: CommentInput,
        @PubSub(Topic.commentAdded) notifyAboutAddedComment: Publisher<Comment>,
        @Ctx() ctx: Context
    ): Promise<number> {
        const id = await commentsTable.insert(Object.assign(input, { createdBy: ctx.session.userId }));
        // @ts-ignore
        commentsTable.get(id).then(processTimestamps).then(notifyAboutAddedComment).catch(console.error);
        return id;
    }

    @Subscription({
        topics: Topic.commentAdded,
    })
    commentAdded(
        @Root() comment: Comment,
    ): Comment {
        return comment;
    }


    @Authorized('EDIT_COMMENT')
    @Mutation(returns => Boolean, { description: 'Edit comment profile' })
    async updateComment(
        @Arg('id', type => Int) id: number,
        @Arg('input', type => CommentInput) input: CommentInput,
        @PubSub(Topic.commentUpdated) notifyAboutUpdatedComment: Publisher<Comment>,
        @Ctx() ctx: Context
    ): Promise<boolean> {
        const params: {[index: string]: number} = { id };
        if (!(ctx.session.ALL_INCLUSIVE || ctx.session.rights.includes('EDIT_COMMENTS'))) {
            params.createdBy = ctx.session.userId
        }
        const isUpdated = await commentsTable.update(params, input);
        if (isUpdated) {
            // @ts-ignore
            commentsTable.get(id).then(processTimestamps).then(notifyAboutUpdatedComment).catch(console.error);
        } else if (params.createdBy) {
            throw new Error('You are not allowed to edit comments created by other users')
        }
        return isUpdated;
    }

    @Subscription({
        topics: Topic.commentUpdated
    })
    commentUpdated(
        @Root() comment: Comment,
    ): Comment {
        return comment;
    }

    @Authorized('DELETE_COMMENT')
    @Mutation(returns => Boolean, { description: 'Delete comment' })
    async deleteComment(
        @Arg('id', type => Int) id: number,
        @PubSub(Topic.commentDeleted) notifyAboutDeletedComment: Publisher<number>,
        @Ctx() ctx: Context
    ): Promise<boolean> {
        const params: {[index: string]: number} = { id };
        if (!(ctx.session.ALL_INCLUSIVE || ctx.session.rights.includes('DELETE_COMMENTS'))) {
            params.createdBy = ctx.session.userId
        }
        const isDeleted = await commentsTable.remove(params);
        if (isDeleted) {
            notifyAboutDeletedComment(id).catch(console.error);
        } else if (params.createdBy) {
            throw new Error('You are not allowed to delete comments created by other users')
        }
        return isDeleted;
    }

    @Subscription({
        topics: Topic.commentDeleted
    })
    commentDeleted(@Root() id: number): number {
        return id;
    }

    @FieldResolver()
    createdBy(@Root() comment: Comment): Promise<User> {
        return usersTable.get({ id: comment.createdBy })
    }
}
