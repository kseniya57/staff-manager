import {Pagination} from '../types/pagination.type';
import {execute, selectFormat} from '../utils/mysql';
import {buildJoinCondition, buildPaginationCondition} from '../utils/mysql';
import {JoinConfig} from '../interfaces/db.interface';

const idOrFilter = (id?: number | Object) => id ? (typeof id === 'object' ? id : {id}) : undefined;

export class Table<T> {
    private readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    raw(query: string, filter?: any, pagination?: Pagination, config?: {[index: string]: string}): Promise<T[]> {
        return execute(`
            ${query.replace('$name', this.name)}
            WHERE ${selectFormat(filter, config)} ${buildPaginationCondition(pagination)}
        `)
    }

    paginate(query: string, pagination?: Pagination): Promise<T[]> {
        return execute(`
            ${query}
            ${buildPaginationCondition(pagination)}
        `)
    }

    all<U = T>(
        filter?: Object,
        selector: string = '*',
        pagination?: Pagination,
        joinConfig?: { [index: string]: string | JoinConfig},
        filterConfig?: {[index: string]: string},
        conditionString?: string
    ): Promise<U[]> {
        return execute(`
            SELECT ${selector} 
            FROM ${this.name}
            ${buildJoinCondition(joinConfig)}
            WHERE ${conditionString ? `${conditionString} AND` : ''} 
            ${selectFormat(filter, filterConfig)}
            ${buildPaginationCondition(pagination)}
        `)
    }

    get<U = T>(
        id: number | Object,
        selector: string = '*',
        pagination?: Pagination,
        joinConfig?: { [index: string]: string | JoinConfig},
        filterConfig?: {[index: string]: string}
    ): Promise<U> {
        return execute(`
            SELECT ${selector}
            FROM ${this.name} 
            ${buildJoinCondition(joinConfig)}
            WHERE ${selectFormat(idOrFilter(id), filterConfig)}
            ${buildPaginationCondition(pagination)}
            LIMIT 1
        `).then((result: U[]) => result[0]);
    }

    async remove(id: number | {[index: string]: any}): Promise<boolean> {
        const { affectedRows } = await execute(`
            DELETE FROM ${this.name}
            WHERE ${selectFormat(idOrFilter(id))}`);
        return affectedRows > 0;
    }

    async update(filter: any, params: Object): Promise<boolean> {
        const { changedRows } = await execute(`
            UPDATE ??
            SET ?
            WHERE ${selectFormat(idOrFilter(filter))}
        `, [this.name, params]);
        return changedRows > 0;
    }

    async insert(params: Object): Promise<number> {
        const { insertId } = await execute('INSERT INTO ?? SET ?', [this.name, params]);
        return insertId;
    }

    async replace(params: Object): Promise<boolean> {
        const { affectedRows } = await execute('REPLACE INTO ?? SET ?', [this.name, params]);
        return affectedRows > 0;
    }
}
