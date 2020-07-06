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
import {positionsTable, wagesTable} from '../models';
import {Position, PositionFilter, PositionInput, PositionSearchFilter} from '../types/position.type';
import {moneyFormat} from '../utils/formatter';
import {Wage} from '../types/wage.type';
import {execute} from '../utils/mysql';
import {getLikeSearchFilter, merge, pick, pickAllId, uniq} from '../utils/helpers';

enum Topic {
    positionAdded = 'POSITION_ADDED',
    positionUpdated = 'POSITION_UPDATED',
    positionDeleted = 'POSITION_DELETED',
}

const mapPositionIdSearchFilter = pick(['departments']);
const mapPositionLikeSearchFilter = pick(['name']);

const positionRelationsMapping: {[index: string]: {[index: string]: string}} = {
    departments: {
        tableName: 'wages',
        relatedField: 'departmentId'
    },
};

@Resolver(type => Position)
export class PositionResolver {

    static process(positions: Position[]): Position[] {
        return positions.map(position => Object.assign(position, {
            minSalary: moneyFormat(position.minSalary),
            maxSalary: moneyFormat(position.maxSalary),
        }))
    }

    @Authorized('READ_POSITION')
    @Query(returns => [Position], { description: 'Get all positions' })
    async positions(
        @Arg('filter', type => PositionFilter, { nullable: true }) filter?: PositionFilter,
        @Arg('pagination', type => Pagination, { nullable: true }) pagination?: Pagination,
        @Arg('search', type => PositionSearchFilter, { nullable: true }) search?: PositionSearchFilter,
    ): Promise<Position[]> {
        let conditionString = '';
        if (search) {
            filter = Object.assign({}, filter, await this.getIdSearchFilter(search));
            conditionString = getLikeSearchFilter(mapPositionLikeSearchFilter(search));
        }
        return positionsTable.all(
            filter,
            '*',
            pagination,
            undefined,
            undefined,
            conditionString
        )
    }

    async getIdSearchFilter(searchFilter: PositionSearchFilter): Promise<{id?: number[]}> {
        const filters = Object.entries(mapPositionIdSearchFilter(searchFilter));
        if (!filters.length) {
            return {}
        }
        const id = await Promise.all(filters.map(([key, ids]) => execute(`
            SELECT positionId id FROM ${positionRelationsMapping[key].tableName}
            WHERE ${positionRelationsMapping[key].relatedField} IN (?)
        `, [ids])
        // @ts-ignore
            .then(pickAllId))).then(merge).then(uniq);
        // @ts-ignore
        return { id }
    }

    @Authorized('ADD_POSITION')
    @Mutation(returns => Int, { description: 'Add a position' })
    async addPosition(
        @Arg('input', type => PositionInput) input: PositionInput,
        @PubSub(Topic.positionAdded) notifyAboutAddedPosition: Publisher<Position>
    ): Promise<number> {
        const id = await positionsTable.insert(input);
        positionsTable.get(id).then(notifyAboutAddedPosition).catch(console.error);
        return id;
    }

    @Subscription({
        topics: Topic.positionAdded,
    })
    positionAdded(
        @Root() position: Position,
    ): Position {
        return position;
    }


    @Authorized('EDIT_POSITION')
    @Mutation(returns => Boolean, { description: 'Edit position profile' })
    async updatePosition(
        @Arg('id', type => Int) id: number,
        @Arg('input', type => PositionInput) input: PositionInput,
        @PubSub(Topic.positionUpdated) notifyAboutUpdatedPosition: Publisher<Position>
    ): Promise<boolean> {
        await positionsTable.update(id, input);
        positionsTable.get(id).then(notifyAboutUpdatedPosition).catch(console.error);
        return true;
    }

    @Subscription({
        topics: Topic.positionUpdated
    })
    positionUpdated(
        @Root() position: Position,
    ): Position {
        return position;
    }

    @Authorized('DELETE_POSITION')
    @Mutation(returns => Boolean, { description: 'Delete position' })
    async deletePosition(
        @Arg('id', type => Int) id: number,
        @PubSub(Topic.positionDeleted) notifyAboutDeletedPosition: Publisher<number>
    ): Promise<boolean> {
        const isDeleted = await positionsTable.remove(id);
        if (isDeleted) {
            notifyAboutDeletedPosition(id).catch(console.error);
        }
        return isDeleted;
    }

    @Subscription({
        topics: Topic.positionDeleted
    })
    positionDeleted(@Root() id: number): number {
        return id;
    }

    @FieldResolver()
    wages(@Root() position: Position): Promise<Wage[]> {
        return wagesTable.all({ positionId: position.id })
    }
}
