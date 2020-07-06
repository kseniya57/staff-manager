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
import {departmentsTable, wagesTable} from '../models';
import {
    Department,
    DepartmentFilter,
    DepartmentInput, DepartmentSearchFilter,
} from '../types/department.type';
import {Wage} from '../types/wage.type';
import {merge, processTimestamps, uniq, pickAllId, getLikeSearchFilter, pick} from '../utils/helpers';
import {execute} from '../utils/mysql';

enum Topic {
    departmentAdded = 'DEPARTMENT_ADDED',
    departmentUpdated = 'DEPARTMENT_UPDATED',
    departmentDeleted = 'DEPARTMENT_DELETED',
}

const mapDepartmentIdSearchFilter = pick(['positions']);
const mapDepartmentLikeSearchFilter = pick(['name']);

const departmentRelationsMapping: {[index: string]: {[index: string]: string}} = {
    positions: {
        tableName: 'wages',
        relatedField: 'positionId'
    },
};

@Resolver(type => Department)
export class DepartmentResolver {
    @Authorized('READ_DEPARTMENT')
    @Query(returns => [Department], { description: 'Get all departments' })
    async departments(
        @Arg('filter', type => DepartmentFilter, { nullable: true }) filter?: DepartmentFilter,
        @Arg('pagination', type => Pagination, { nullable: true }) pagination?: Pagination,
        @Arg('search', type => DepartmentSearchFilter, { nullable: true }) search?: DepartmentSearchFilter,
    ): Promise<Department[]> {
        let conditionString = '';
        if (search) {
            filter = Object.assign({}, filter, await this.getIdSearchFilter(search));
            conditionString = getLikeSearchFilter(mapDepartmentLikeSearchFilter(search));
        }
        // @ts-ignore
        return departmentsTable.all(
            filter,
            '*',
            pagination,
            undefined,
            undefined,
            conditionString
        ).then(processTimestamps)
    }

    async getIdSearchFilter(searchFilter: DepartmentSearchFilter): Promise<{id?: number[]}> {
        const filters = Object.entries(mapDepartmentIdSearchFilter(searchFilter));
        if (!filters.length) {
            return {}
        }
        const id = await Promise.all(filters.map(([key, ids]) => execute(`
            SELECT departmentId id FROM ${departmentRelationsMapping[key].tableName}
            WHERE ${departmentRelationsMapping[key].relatedField} IN (?)
        `, [ids])
        // @ts-ignore
            .then(pickAllId))).then(merge).then(uniq);
        // @ts-ignore
        return { id }
    }

    @Authorized('READ_DEPARTMENT')
    @Query(returns => Department, { description: 'Get department' })
    async department(
        @Arg('id', type => Int) id: number,
    ): Promise<Department> {
        // @ts-ignore
        return departmentsTable.get(id).then(processTimestamps)
    }

    @Authorized('ADD_DEPARTMENT')
    @Mutation(returns => Int, { description: 'Add a department' })
    async addDepartment(
        @Arg('input', type => DepartmentInput) input: DepartmentInput,
        @PubSub(Topic.departmentAdded) notifyAboutAddedDepartment: Publisher<Department>
    ): Promise<number> {
        const id = await departmentsTable.insert(input);
        // @ts-ignore
        departmentsTable.get(id).then(processTimestamps).then(notifyAboutAddedDepartment).catch(console.error);
        return id;
    }

    @Subscription({
        topics: Topic.departmentAdded,
    })
    departmentAdded(
        @Root() department: Department,
    ): Department {
        return department;
    }


    @Authorized('EDIT_DEPARTMENT')
    @Mutation(returns => Boolean, { description: 'Edit department profile' })
    async updateDepartment(
        @Arg('id', type => Int) id: number,
        @Arg('input', type => DepartmentInput) input: DepartmentInput,
        @PubSub(Topic.departmentUpdated) notifyAboutUpdatedDepartment: Publisher<Department>
    ): Promise<boolean> {
        await departmentsTable.update(id, input);
        // @ts-ignore
        departmentsTable.get(id).then(processTimestamps).then(notifyAboutUpdatedDepartment).catch(console.error);
        return true;
    }

    @Subscription({
        topics: Topic.departmentUpdated
    })
    departmentUpdated(
        @Root() department: Department,
    ): Department {
        return department;
    }

    @Authorized('DELETE_DEPARTMENT')
    @Mutation(returns => Boolean, { description: 'Delete department' })
    async deleteDepartment(
        @Arg('id', type => Int) id: number,
        @PubSub(Topic.departmentDeleted) notifyAboutDeletedDepartment: Publisher<number>
    ): Promise<boolean> {
        const isDeleted = await departmentsTable.remove(id);
        if (isDeleted) {
            notifyAboutDeletedDepartment(id).catch(console.error);
        }
        return isDeleted;
    }

    @Subscription({
        topics: Topic.departmentDeleted
    })
    departmentDeleted(@Root() id: number): number {
        return id;
    }

    @FieldResolver()
    wages(@Root() department: Department): Promise<Wage[]> {
        return wagesTable.all({ departmentId: department.id })
    }
}
