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
import {skillsTable} from '../models';
import {Skill, SkillFilter, SkillInput} from '../types/skill.type';

enum Topic {
    skillAdded = 'SKILL_ADDED',
    skillUpdated = 'SKILL_UPDATED',
    skillDeleted = 'SKILL_DELETED',
}

@Resolver(type => Skill)
export class SkillResolver {
    @Authorized('READ_SKILL')
    @Query(returns => [Skill], { description: 'Get all skills' })
    async skills(
        @Arg('filter', type => SkillFilter, { nullable: true }) filter?: SkillFilter,
        @Arg('pagination', type => Pagination, { nullable: true }) pagination?: Pagination,
    ): Promise<Skill[]> {
        return skillsTable.all(filter, '*', pagination)
    }

    @Authorized('ADD_SKILL')
    @Mutation(returns => Int, { description: 'Add a skill' })
    async addSkill(
        @Arg('input', type => SkillInput) input: SkillInput,
        @PubSub(Topic.skillAdded) notifyAboutAddedSkill: Publisher<Skill>
    ): Promise<number> {
        const id = await skillsTable.insert(input);
        skillsTable.get(id).then(notifyAboutAddedSkill).catch(console.error);
        return id;
    }

    @Subscription({
        topics: Topic.skillAdded,
    })
    skillAdded(
        @Root() skill: Skill,
    ): Skill {
        return skill;
    }


    @Authorized('EDIT_SKILL')
    @Mutation(returns => Boolean, { description: 'Edit skill profile' })
    async updateSkill(
        @Arg('id', type => Int) id: number,
        @Arg('input', type => SkillInput) input: SkillInput,
        @PubSub(Topic.skillUpdated) notifyAboutUpdatedSkill: Publisher<Skill>
    ): Promise<boolean> {
        await skillsTable.update(id, input);
        skillsTable.get(id).then(notifyAboutUpdatedSkill).catch(console.error);
        return true;
    }

    @Subscription({
        topics: Topic.skillUpdated
    })
    skillUpdated(
        @Root() skill: Skill,
    ): Skill {
        return skill;
    }

    @Authorized('DELETE_SKILL')
    @Mutation(returns => Boolean, { description: 'Delete skill' })
    async deleteSkill(
        @Arg('id', type => Int) id: number,
        @PubSub(Topic.skillDeleted) notifyAboutDeletedSkill: Publisher<number>
    ): Promise<boolean> {
        const isDeleted = await skillsTable.remove(id);
        if (isDeleted) {
            notifyAboutDeletedSkill(id).catch(console.error);
        }
        return isDeleted;
    }

    @Subscription({
        topics: Topic.skillDeleted
    })
    skillDeleted(@Root() id: number): number {
        return id;
    }
}
