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
import {socialNetworksTable} from '../models';
import {SocialNetwork, SocialNetworkFilter, SocialNetworkInput} from '../types/social.type';

enum Topic {
    socialNetworkAdded = 'SOCIAL_NETWORK_ADDED',
    socialNetworkUpdated = 'SOCIAL_NETWORK_UPDATED',
    socialNetworkDeleted = 'SOCIAL_NETWORK_DELETED',
}

@Resolver(type => SocialNetwork)
export class SocialNetworkResolver {
    @Authorized('READ_SOCIAL_NETWORK')
    @Query(returns => [SocialNetwork], { description: 'Get all socialNetworks' })
    async socialNetworks(
        @Arg('filter', type => SocialNetworkFilter, { nullable: true }) filter?: SocialNetworkFilter,
        @Arg('pagination', type => Pagination, { nullable: true }) pagination?: Pagination,
    ): Promise<SocialNetwork[]> {
        return socialNetworksTable.all(filter, '*', pagination)
    }

    @Authorized('ADD_SOCIAL_NETWORK')
    @Mutation(returns => Int, { description: 'Add a socialNetwork' })
    async addSocialNetwork(
        @Arg('input', type => SocialNetworkInput) input: SocialNetworkInput,
        @PubSub(Topic.socialNetworkAdded) notifyAboutAddedSocialNetwork: Publisher<SocialNetwork>
    ): Promise<number> {
        const id = await socialNetworksTable.insert(input);
        socialNetworksTable.get(id).then(notifyAboutAddedSocialNetwork).catch(console.error);
        return id;
    }

    @Subscription({
        topics: Topic.socialNetworkAdded,
    })
    socialNetworkAdded(
        @Root() socialNetwork: SocialNetwork,
    ): SocialNetwork {
        return socialNetwork;
    }


    @Authorized('EDIT_SOCIAL_NETWORK')
    @Mutation(returns => Boolean, { description: 'Edit socialNetwork profile' })
    async updateSocialNetwork(
        @Arg('id', type => Int) id: number,
        @Arg('input', type => SocialNetworkInput) input: SocialNetworkInput,
        @PubSub(Topic.socialNetworkUpdated) notifyAboutUpdatedSocialNetwork: Publisher<SocialNetwork>
    ): Promise<boolean> {
        await socialNetworksTable.update(id, input);
        socialNetworksTable.get(id).then(notifyAboutUpdatedSocialNetwork).catch(console.error);
        return true;
    }

    @Subscription({
        topics: Topic.socialNetworkUpdated
    })
    socialNetworkUpdated(
        @Root() socialNetwork: SocialNetwork,
    ): SocialNetwork {
        return socialNetwork;
    }

    @Authorized('DELETE_SOCIAL_NETWORK')
    @Mutation(returns => Boolean, { description: 'Delete socialNetwork' })
    async deleteSocialNetwork(
        @Arg('id', type => Int) id: number,
        @PubSub(Topic.socialNetworkDeleted) notifyAboutDeletedSocialNetwork: Publisher<number>
    ): Promise<boolean> {
        const isDeleted = await socialNetworksTable.remove(id);
        if (isDeleted) {
            notifyAboutDeletedSocialNetwork(id).catch(console.error);
        }
        return isDeleted;
    }

    @Subscription({
        topics: Topic.socialNetworkDeleted
    })
    socialNetworkDeleted(@Root() id: number): number {
        return id;
    }
}
