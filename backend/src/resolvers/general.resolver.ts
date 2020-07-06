import {
    Resolver,
    Query,
    Arg,
    Int
} from 'type-graphql';
import {execute, selectFormat} from '../utils/mysql';
import GraphQLObject from '../graphql/Object';

@Resolver()
export class GeneralResolver {
    @Query(returns => Int)
    count(
        @Arg('table', type => String) table: string,
        @Arg('filter', type => GraphQLObject, { nullable: true }) filter?: {[index: string]: any}
    ): Promise<number> {
        return execute(
            `SELECT count(1) count FROM ?? WHERE ${selectFormat(filter)}`,
            [table]
        ).then((result: [{ count: number }]) => result[0].count);
    }
}
