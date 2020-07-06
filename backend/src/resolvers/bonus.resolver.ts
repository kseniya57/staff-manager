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
import {bonusesTable} from '../models';
import {Bonus, BonusFilter, BonusInput} from '../types/bonus.type';

enum Topic {
    bonusAdded = 'BONUS_ADDED',
    bonusUpdated = 'BONUS_UPDATED',
    bonusDeleted = 'BONUS_DELETED',
}

@Resolver(type => Bonus)
export class BonusResolver {
    @Authorized('READ_BONUS')
    @Query(returns => [Bonus], { description: 'Get all bonuses' })
    async bonuses(
        @Arg('filter', type => BonusFilter, { nullable: true }) filter?: BonusFilter,
        @Arg('pagination', type => Pagination, { nullable: true }) pagination?: Pagination,
    ): Promise<Bonus[]> {
        return bonusesTable.all(filter, '*', pagination)
    }

    @Authorized('ADD_BONUS')
    @Mutation(returns => Int, { description: 'Add a bonus' })
    async addBonus(
        @Arg('input', type => BonusInput) input: BonusInput,
        @PubSub(Topic.bonusAdded) notifyAboutAddedBonus: Publisher<Bonus>
    ): Promise<number> {
        const id = await bonusesTable.insert(input);
        bonusesTable.get(id).then(notifyAboutAddedBonus).catch(console.error);
        return id;
    }

    @Subscription({
        topics: Topic.bonusAdded,
    })
    bonusAdded(
        @Root() bonus: Bonus,
    ): Bonus {
        return bonus;
    }


    @Authorized('EDIT_BONUS')
    @Mutation(returns => Boolean, { description: 'Edit bonus profile' })
    async updateBonus(
        @Arg('id', type => Int) id: number,
        @Arg('input', type => BonusInput) input: BonusInput,
        @PubSub(Topic.bonusUpdated) notifyAboutUpdatedBonus: Publisher<Bonus>
    ): Promise<boolean> {
        await bonusesTable.update(id, input);
        bonusesTable.get(id).then(notifyAboutUpdatedBonus).catch(console.error);
        return true;
    }

    @Subscription({
        topics: Topic.bonusUpdated
    })
    bonusUpdated(
        @Root() bonus: Bonus,
    ): Bonus {
        return bonus;
    }

    @Authorized('DELETE_BONUS')
    @Mutation(returns => Boolean, { description: 'Delete bonus' })
    async deleteBonus(
        @Arg('id', type => Int) id: number,
        @PubSub(Topic.bonusDeleted) notifyAboutDeletedBonus: Publisher<number>
    ): Promise<boolean> {
        const isDeleted = await bonusesTable.remove(id);
        if (isDeleted) {
            notifyAboutDeletedBonus(id).catch(console.error);
        }
        return isDeleted;
    }

    @Subscription({
        topics: Topic.bonusDeleted
    })
    bonusDeleted(@Root() id: number): number {
        return id;
    }
}
