import {dateFormat} from './formatter';
import {format} from 'mysql';

export const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const pick = <T>(key: string | string[]) => (obj: {[index: string]: any}) => typeof key === 'string'
    ? obj[key] as T
    : key.reduce((map, item) => obj[item] ? Object.assign(
        map,
        {[item]: obj[item]}
        ) : map, {});

export const pickAll = <T>(field: string) => (array: Array<{[index: string]: any}>): T[] => array.map(item => item[field]);

export const merge = <T>(arrays: T[][]): T[] => arrays.reduce((acc, item) => acc.concat(item), []);

export const uniq = (array: Array<string | number>): Array<string | number> => Object.keys(array.reduce((map, item) => Object.assign(map, {[item]: 1}), {}));

interface ObjectWithTimestamps {
        createdAt: string | number
}

export const processTimestamps = <T extends ObjectWithTimestamps>(array: T[] | T, momentFormat?: string): T[] | T => Array.isArray(array) ? array.map(item => Object.assign(
   item,
   { createdAt: dateFormat(item.createdAt, momentFormat) }
)) : Object.assign(
    array,
    { createdAt: dateFormat(array.createdAt, momentFormat) }
);

export const omit = (keys: string[], obj: {[index: string]: any}) => Object.entries(obj).reduce((map, [key, value]) => keys.includes(key) ? map : Object.assign(map, {[key]: value}), {});

export const getMonthAndYear = ({ month, year }: {[index: string]: any}) => {
        const date = new Date();
        return {
                month: month || month === 0 ? month : date.getMonth(),
                year: year || date.getFullYear()
        }
};

export const pickAllId = pickAll('id');

export const getLikeSearchFilter = (filter: Object) => Object.entries(filter).map(([key, value]) => value.map((item: string) => format(`${key} LIKE ?`, [`%${item}%`])).join(' OR ')).join(' OR ');
