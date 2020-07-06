import {rightsTable} from '../models';
import {merge} from './helpers';
import {Right} from '../types/right.type';

export default (userId: number, selector = '*'): Promise<Right[]> => Promise.all([
    // specific rights for user
    rightsTable.all({ userId }, selector, undefined, {
        users_rights: 'users_rights.rightId = rights.id',
    }),
    // rights for user roles
    rightsTable.all(undefined, '*', undefined, {
        roles_rights: 'roles_rights.rightId = rights.id'
    }, undefined, `roleId in (SELECT roleId from users_roles WHERE userId = ${userId})`)
]).then(merge)
