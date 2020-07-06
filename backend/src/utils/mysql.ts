import { createPool, format } from 'mysql';
import { promisify } from 'util';
import { dbConfig } from '../config';
import {Pagination} from '../types/pagination.type';
import {JoinConfig} from '../interfaces/db.interface';
import {JoinType} from '../enums/db.enum';

export const pool = createPool(dbConfig);

export const selectFormat = (conditionsMap?: Object, conditionsConfig: {[index: string]: string} = {}, start = '1') =>
    conditionsMap && typeof conditionsMap === 'object' && Object.keys(conditionsMap).length
    ? Object
        .entries(conditionsMap)
        .reduce((acc, [key, condition]) => `${acc} AND ${format(
            Array.isArray(condition) 
                ? `${key} ${conditionsConfig[key] || ''} IN (${condition.length ? '?' : 'NULL'})`
                : [undefined, null].includes(condition) 
                    ? `${key} IS NULL`
                    : `${key} ${conditionsConfig[key] || '='} ?`, 
            [condition]
        )}`, start)
    : 1;

export const buildPaginationCondition = (pagination?: Pagination) => pagination
    ? `
        ${pagination.order ? ` ORDER BY ${
                // @ts-ignore
                (Array.isArray(pagination.order[0]) ? pagination.order : [pagination.order])
                    .map((item: string[]) => `${item[0]} ${item[1] || 'ASC'}`)
                    .join(', ')
        }`: ''}
        ${pagination.limit ? ` LIMIT ${pagination.offset || 0}, ${pagination.limit}`: ''}
      `
    : '';

export const buildJoinCondition = (joinConfig?: {[index: string]: string | JoinConfig}) => joinConfig
    ? Object
        .entries(joinConfig)
        .reduce(
            (acc, [name, config]) =>
                // @ts-ignore
                acc + ` ${config.type || JoinType.inner} JOIN ${name} ON ${config.on || config}`
            , ''
        )
    : '';

export const execute: Function = promisify(pool.query.bind(pool));
