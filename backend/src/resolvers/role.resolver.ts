import {
    Arg,
    Authorized, FieldResolver,
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
import {rightsTable, rolesTable, roleRightTable} from '../models';
import {Role, RoleFilter, RoleInput} from '../types/role.type';
import {Right} from '../types/right.type';
import { pick } from '../utils/helpers';

const pickName = pick(['name']);

enum Topic {
    roleAdded = 'ROLE_ADDED',
    roleUpdated = 'ROLE_UPDATED',
    roleDeleted = 'ROLE_DELETED',
}

@Resolver(type => Role)
export class RoleResolver {
    @Authorized('READ_ROLE')
    @Query(returns => [Role], { description: 'Get all roles' })
    async roles(
        @Arg('filter', type => RoleFilter, { nullable: true }) filter?: RoleFilter,
        @Arg('pagination', type => Pagination, { nullable: true }) pagination?: Pagination,
    ): Promise<Role[]> {
        return rolesTable.all(filter, '*', pagination)
    }

    @Authorized('READ_ROLE')
    @Query(returns => Role, { description: 'Get role' })
    async role(
        @Arg('id', type => Int) id: number,
    ): Promise<Role> {
        return rolesTable.get(id, '*')
    }

    @Authorized('ADD_ROLE')
    @Mutation(returns => Int, { description: 'Add a role' })
    async addRole(
        @Arg('input', type => RoleInput) input: RoleInput,
        @PubSub(Topic.roleAdded) notifyAboutAddedRole: Publisher<Role>
    ): Promise<number> {
        const roleId = await rolesTable.insert(pickName(input));
        await this.editRights(roleId, input.rights);
        rolesTable.get(roleId).then(notifyAboutAddedRole).catch(console.error);
        return roleId;
    }

    @Subscription({
        topics: Topic.roleAdded,
    })
    roleAdded(
        @Root() role: Role,
    ): Role {
        return role;
    }


    @Authorized('EDIT_ROLE')
    @Mutation(returns => Boolean, { description: 'Edit role profile' })
    async updateRole(
        @Arg('id', type => Int) id: number,
        @Arg('input', type => RoleInput) input: RoleInput,
        @PubSub(Topic.roleUpdated) notifyAboutUpdatedRole: Publisher<Role>
    ): Promise<boolean> {
        await this.editRights(id, input.rights);
        await rolesTable.update(id, input);
        rolesTable.get(id).then(notifyAboutUpdatedRole).catch(console.error);
        return true;
    }

    async editRights(roleId: number, rights?: number[]) {
        if (!rights) { return }
        await roleRightTable.remove({ roleId });
        await Promise.all(rights.map(rightId => roleRightTable.insert({ roleId, rightId })))
    }

    @Subscription({
        topics: Topic.roleUpdated
    })
    roleUpdated(
        @Root() role: Role,
    ): Role {
        return role;
    }

    @Authorized('DELETE_ROLE')
    @Mutation(returns => Boolean, { description: 'Delete role' })
    async deleteRole(
        @Arg('id', type => Int) id: number,
        @PubSub(Topic.roleDeleted) notifyAboutDeletedRole: Publisher<number>
    ): Promise<boolean> {
        const isDeleted = await rolesTable.remove(id);
        if (isDeleted) {
            notifyAboutDeletedRole(id).catch(console.error);
        }
        return isDeleted;
    }

    @Subscription({
        topics: Topic.roleDeleted
    })
    roleDeleted(@Root() id: number): number {
        return id;
    }

    @FieldResolver()
    rights(@Root() role: Role): Promise<Right[]> {
        return rightsTable.all({ roleId: role.id }, '*', undefined, {
            roles_rights: 'roles_rights.rightId = rights.id',
        })
    }
}
