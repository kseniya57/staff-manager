import {JoinType} from '../enums/db.enum';

export interface JoinConfig {
    on: string;
    type?: JoinType;
}
