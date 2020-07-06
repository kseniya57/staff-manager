import {
    Arg,
    Authorized,
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
import {rightsTable} from '../models';
import {Right, RightFilter, RightInput} from '../types/right.type';

enum Topic {
    rightAdded = 'RIGHT_ADDED',
    rightUpdated = 'RIGHT_UPDATED',
    rightDeleted = 'RIGHT_DELETED',
}

@Resolver(type => Right)
export class RightResolver {
    @Authorized('READ_RIGHT')
    @Query(returns => [Right], { description: 'Get all rights' })
    async rights(
        @Arg('filter', type => RightFilter, { nullable: true }) filter?: RightFilter,
        @Arg('pagination', type => Pagination, { nullable: true }) pagination?: Pagination,
    ): Promise<Right[]> {
        return rightsTable.all(filter, '*', pagination)
    }

    @Authorized('ADD_RIGHT')
    @Mutation(returns => Int, { description: 'Add a right' })
    async addRight(
        @Arg('input', type => RightInput) input: RightInput,
        @PubSub(Topic.rightAdded) notifyAboutAddedRight: Publisher<Right>
    ): Promise<number> {
        const id = await rightsTable.insert(input);
        rightsTable.get(id).then(notifyAboutAddedRight).catch(console.error);
        return id;
    }

    @Subscription({
        topics: Topic.rightAdded,
    })
    rightAdded(
        @Root() right: Right,
    ): Right {
        return right;
    }


    @Authorized('EDIT_RIGHT')
    @Mutation(returns => Boolean, { description: 'Edit right profile' })
    async updateRight(
        @Arg('id', type => Int) id: number,
        @Arg('input', type => RightInput) input: RightInput,
        @PubSub(Topic.rightUpdated) notifyAboutUpdatedRight: Publisher<Right>
    ): Promise<boolean> {
        await rightsTable.update(id, input);
        rightsTable.get(id).then(notifyAboutUpdatedRight).catch(console.error);
        return true;
    }

    @Subscription({
        topics: Topic.rightUpdated
    })
    rightUpdated(
        @Root() right: Right,
    ): Right {
        return right;
    }

    @Authorized('DELETE_RIGHT')
    @Mutation(returns => Boolean, { description: 'Delete right' })
    async deleteRight(
        @Arg('id', type => Int) id: number,
        @PubSub(Topic.rightDeleted) notifyAboutDeletedRight: Publisher<number>
    ): Promise<boolean> {
        const isDeleted = await rightsTable.remove(id);
        if (isDeleted) {
            notifyAboutDeletedRight(id).catch(console.error);
        }
        return isDeleted;
    }

    @Subscription({
        topics: Topic.rightDeleted
    })
    rightDeleted(@Root() id: number): number {
        return id;
    }
}
