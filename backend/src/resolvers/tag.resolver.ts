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
import {tagsTable} from '../models';
import {Tag, TagFilter, TagInput} from '../types/tag.type';

enum Topic {
    tagAdded = 'TAG_ADDED',
    tagUpdated = 'TAG_UPDATED',
    tagDeleted = 'TAG_DELETED',
}

@Resolver(type => Tag)
export class TagResolver {
    @Authorized('READ_TAG')
    @Query(returns => [Tag], { description: 'Get all tags' })
    async tags(
        @Arg('filter', type => TagFilter, { nullable: true }) filter?: TagFilter,
        @Arg('pagination', type => Pagination, { nullable: true }) pagination?: Pagination,
    ): Promise<Tag[]> {
        return tagsTable.all(filter, '*', pagination)
    }

    @Authorized('ADD_TAG')
    @Mutation(returns => Int, { description: 'Add a tag' })
    async addTag(
        @Arg('input', type => TagInput) input: TagInput,
        @PubSub(Topic.tagAdded) notifyAboutAddedTag: Publisher<Tag>
    ): Promise<number> {
        const id = await tagsTable.insert(Object.assign({ color: 'primary' }, input));
        tagsTable.get(id).then(notifyAboutAddedTag).catch(console.error);
        return id;
    }

    @Subscription({
        topics: Topic.tagAdded,
    })
    tagAdded(
        @Root() tag: Tag,
    ): Tag {
        return tag;
    }


    @Authorized('EDIT_TAG')
    @Mutation(returns => Boolean, { description: 'Edit tag profile' })
    async updateTag(
        @Arg('id', type => Int) id: number,
        @Arg('input', type => TagInput) input: TagInput,
        @PubSub(Topic.tagUpdated) notifyAboutUpdatedTag: Publisher<Tag>
    ): Promise<boolean> {
        await tagsTable.update(id, input);
        tagsTable.get(id).then(notifyAboutUpdatedTag).catch(console.error);
        return true;
    }

    @Subscription({
        topics: Topic.tagUpdated
    })
    tagUpdated(
        @Root() tag: Tag,
    ): Tag {
        return tag;
    }

    @Authorized('DELETE_TAG')
    @Mutation(returns => Boolean, { description: 'Delete tag' })
    async deleteTag(
        @Arg('id', type => Int) id: number,
        @PubSub(Topic.tagDeleted) notifyAboutDeletedTag: Publisher<number>
    ): Promise<boolean> {
        const isDeleted = await tagsTable.remove(id);
        if (isDeleted) {
            notifyAboutDeletedTag(id).catch(console.error);
        }
        return isDeleted;
    }

    @Subscription({
        topics: Topic.tagDeleted
    })
    tagDeleted(@Root() id: number): number {
        return id;
    }
}
