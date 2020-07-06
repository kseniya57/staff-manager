import {
    Arg,
    Authorized,
    FieldResolver,
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
import {
    bonusesTable,
    commentsTable,
    expensesTable,
    rolesTable,
    skillsTable,
    socialNetworksTable,
    tagsTable,
    userBonusTable,
    userExpenseTable,
    userRightTable,
    userRoleTable,
    userSkillTable,
    userSocialNetworkTable,
    usersTable,
    userTagTable,
    wagesTable
} from '../models';
import {
    User,
    UserFilter,
    UserInput,
    UserSocialNetworkInput,
    UserSocialNetwork,
    UserSearchFilter
} from '../types/user.type';
import {merge, omit, pickAll, processTimestamps, uniq, pickAllId, pick, getLikeSearchFilter} from '../utils/helpers';
import {Comment} from '../types/comment.type';
import {Tag} from '../types/tag.type';
import {Expense} from '../types/expense.type';
import {Bonus} from '../types/bonus.type';
import {Right} from '../types/right.type';
import {JoinType} from '../enums/db.enum';
import getUserRights from '../utils/getUserRights';
import {Wage} from '../types/wage.type';
import {format} from 'mysql';
import {execute} from '../utils/mysql';

enum Topic {
    userAdded = 'USER_ADDED',
    userUpdated = 'USER_UPDATED',
    userDeleted = 'USER_DELETED',
}

const mapUserSearchFilter = pick(['departments', 'positions', 'tags', 'skills']);
const mapUserLikeSearchFilter = pick(['email', 'firstName', 'lastName']);

const userRelationsMapping: {[index: string]: {[index: string]: string}} = {
    departments: {
        tableName: 'wages',
        relatedField: 'departmentId'
    },
    positions: {
        tableName: 'wages',
        relatedField: 'positionId'
    },
    tags: {
        tableName: 'users_tags',
        relatedField: 'tagId'
    },
    skills: {
        tableName: 'users_skills',
        relatedField: 'skillId'
    }
};

@Resolver(type => User)
export class UserResolver {

    @Authorized('READ_USER')
    @Query(returns => User, { description: 'Get user by id' })
    async user(
        @Arg('id', type => Int) id: number,
    ): Promise<User> {
        return usersTable.get(id, '*')
    }

    @Authorized('READ_USER')
    @Query(returns => [User], { description: 'Get all users' })
    async users(
        @Arg('filter', type => UserFilter, { nullable: true }) filter?: UserFilter,
        @Arg('pagination', type => Pagination, { nullable: true }) pagination?: Pagination,
        @Arg('search', type => UserSearchFilter, { nullable: true }) search?: UserSearchFilter,
    ): Promise<User[]> {
        let conditionString = '';
        if (search) {
            filter = Object.assign({}, filter, await this.getIdSearchFilter(search));
            conditionString = getLikeSearchFilter(mapUserLikeSearchFilter(search));
        }
        return usersTable.all(
            filter,
            'id, email, firstName, middleName, lastName, phone, avatar',
            pagination,
            undefined,
            undefined,
            conditionString
        )
    }

    async getIdSearchFilter(searchFilter: UserSearchFilter): Promise<{id?: number[]}> {
        const filters = Object.entries(mapUserSearchFilter(searchFilter));
        if (!filters.length) {
            return {}
        }
        const id = await Promise.all(filters.map(([key, ids]) => execute(`
            SELECT userId id FROM ${userRelationsMapping[key].tableName}
            WHERE ${userRelationsMapping[key].relatedField} IN (?)
        `, [ids])
        // @ts-ignore
            .then(pickAllId))).then(merge).then(uniq);
        return { id };
    }

    @FieldResolver()
    name(@Root() user: User) {
        return `${user.lastName || ''} ${user.firstName || ''} ${user.middleName || ''}`
    }

    @Authorized('ADD_USER')
    @Mutation(returns => Int, { description: 'Add a user' })
    async addUser(
        @Arg('input', type => UserInput) input: UserInput,
        @PubSub(Topic.userAdded) notifyAboutAddedUser: Publisher<User>
    ): Promise<number> {
        const id = await usersTable.insert(omit(['tags', 'skills', 'socialNetworks'], input));
        await this.editSocialNetworks(id, input.socialNetworks ? JSON.parse(input.socialNetworks) : undefined);
        await Promise.all([
            this.editTags(id, input.tags),
            this.editSkills(id, input.skills)
        ]);
        usersTable.get(id).then(notifyAboutAddedUser).catch(console.error);
        return id;
    }

    @Subscription({
        topics: Topic.userAdded,
    })
    userAdded(
        @Root() user: User,
    ): User {
        return user;
    }


    @Authorized('EDIT_USER')
    @Mutation(returns => Boolean, { description: 'Edit user profile' })
    async updateUser(
        @Arg('id', type => Int) id: number,
        @Arg('input', type => UserInput) input: UserInput,
        @PubSub(Topic.userUpdated) notifyAboutUpdatedUser: Publisher<User>
    ): Promise<boolean> {
        await Promise.all([
            usersTable.update(id, omit(['tags', 'skills', 'socialNetworks'], input)),
            this.editSocialNetworks(id, input.socialNetworks ? JSON.parse(input.socialNetworks) : undefined),
            this.editTags(id, input.tags),
            this.editSkills(id, input.skills)
        ]);
        usersTable.get(id).then(notifyAboutUpdatedUser).catch(console.error);
        return true;
    }

    @Subscription({
        topics: Topic.userUpdated
    })
    userUpdated(
        @Root() user: User,
    ): User {
        return user;
    }

    @Authorized('DELETE_USER')
    @Mutation(returns => Boolean, { description: 'Delete user' })
    async deleteUser(
        @Arg('id', type => Int) id: number,
        @PubSub(Topic.userDeleted) notifyAboutDeletedUser: Publisher<number>
    ): Promise<boolean> {
        const isDeleted = await usersTable.remove(id);
        if (isDeleted) {
            notifyAboutDeletedUser(id).catch(console.error);
        }
        return isDeleted;
    }

    @Subscription({
        topics: Topic.userDeleted
    })
    userDeleted(@Root() id: number): number {
        return id;
    }

    @FieldResolver()
    roles(@Root() user: User): Promise<string[]> {
        return rolesTable.all({ userId: user.id }, 'name', undefined, {
            users_roles: 'users_roles.roleId = roles.id',
        }).then(pickAll<string>('name'))
    }

    @FieldResolver()
    rights(@Root() user: User): Promise<Right[]> {
        return getUserRights(user.id)
    }

    @FieldResolver()
    socialNetworks(@Root() user: User): Promise<UserSocialNetwork[]> {
        return socialNetworksTable.all<UserSocialNetwork>(undefined, 'id, name, nickname, link, image', undefined, {
            users_social_networks: {
                on: 'users_social_networks.networkId = social_networks.id',
                type: JoinType.left
            }
        }, undefined, format('(userId IS NULL OR userId = ?)', [user.id]))
    }

    @FieldResolver()
    skills(@Root() user: User): Promise<string[]> {
        return skillsTable.all({ userId: user.id }, 'name', undefined, {
            users_skills: 'users_skills.skillId = skills.id',
        }).then(pickAll<string>('name'))
    }

    @FieldResolver()
    comments(@Root() user: User): Promise<Comment[]> {
        // @ts-ignore
        return commentsTable.all({ userId: user.id }).then(processTimestamps);
    }

    @FieldResolver()
    tags(@Root() user: User): Promise<Tag[]> {
        return tagsTable.all({ userId: user.id }, '*', undefined, {
            users_tags: 'users_tags.tagId = tags.id',
        })
    }

    @FieldResolver()
    expenses(@Root() user: User): Promise<Expense[]> {
        return expensesTable.all({ userId: user.id }, 'type, amount', undefined, {
            users_expenses: 'users_expenses.expenseId = expenses.id'
        })
    }

    @FieldResolver()
    bonuses(@Root() user: User): Promise<Bonus[]> {
        return bonusesTable.all({ userId: user.id }, 'name, amount', undefined, {
            users_bonuses: 'users_bonuses.bonusId = bonuses.id'
        })
    }

    async editSocialNetworks(userId: number, socialNetworks?: UserSocialNetworkInput[]) {
        if (!socialNetworks) { return }
        await userSocialNetworkTable.remove({ userId });
        await Promise.all(socialNetworks.map(({ id: networkId, nickname }) => userSocialNetworkTable.insert({ userId, networkId, nickname })))
    }

    async editTags(userId: number, tags?: number[]) {
        if (!tags) { return }
        await userTagTable.remove({ userId });
        await Promise.all(tags.map((tagId) => userTagTable.insert({ userId, tagId })))
    }

    async editSkills(userId: number, skills?: number[]) {
        if (!skills) { return }
        await userSkillTable.remove({ userId });
        await Promise.all(skills.map((skillId) => userSkillTable.insert({ userId, skillId })))
    }

    @Authorized('ADD_USER_BONUS')
    @Mutation(returns => Int, { description: 'Add bonus to user' })
    async addUserBonus(
        @Arg('userId', type => Int) userId: number,
        @Arg('bonusId', type => Int) bonusId: number,
    ): Promise<number> {
        return userBonusTable.insert({ userId, bonusId})
    }

    @Authorized('DELETE_USER_BONUS')
    @Mutation(returns => Boolean, { description: 'Delete user\'s bonus' })
    async deleteUserBonus(
        @Arg('userId', type => Int) userId: number,
        @Arg('bonusId', type => Int) bonusId: number,
    ): Promise<boolean> {
        return userBonusTable.remove({ userId, bonusId})
    }

    @Authorized('ADD_USER_EXPENSE')
    @Mutation(returns => Int, { description: 'Buy something for the user' })
    async addUserExpense(
        @Arg('userId', type => Int) userId: number,
        @Arg('expenseId', type => Int) expenseId: number,
    ): Promise<number> {
        return userExpenseTable.insert({ userId, expenseId })
    }

    @Authorized('DELETE_USER_EXPENSE')
    @Mutation(returns => Boolean, { description: 'Delete user\'s expense' })
    async deleteUserExpense(
        @Arg('id', type => Int) id: number,
    ): Promise<boolean> {
        return userExpenseTable.remove(id)
    }

    @Authorized('EDIT_USER_RIGHT')
    @Mutation(returns => Boolean, { description: 'Edit users\'s rights' })
    async editRights(
        @Arg('userId', type => Int) userId: number,
        @Arg('rights', type => [Int]) rights: number[],
    ): Promise<boolean> {
        await userRightTable.remove({ userId });
        await Promise.all(rights.map(rightId => userRightTable.insert({ rightId, userId })));
        return true
    }

    @Authorized('EDIT_USER_ROLE')
    @Mutation(returns => Boolean, { description: 'Edit user\'s roles' })
    async editRoles(
        @Arg('userId', type => Int) userId: number,
        @Arg('roles', type => [Int]) roles: number[],
    ): Promise<boolean> {
        await userRoleTable.remove({ userId });
        await Promise.all(roles.map(roleId => userRoleTable.insert({ roleId, userId })));
        return true
    }

    @FieldResolver()
    wages(@Root() user: User): Promise<Wage[]> {
        return wagesTable.all({ userId: user.id })
    }
}
