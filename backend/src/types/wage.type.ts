import {InputType, Int, ObjectType} from 'type-graphql';
import {Field} from 'type-graphql/dist/decorators/Field';
import {Position} from './position.type';
import {User} from './user.type';
import {Department} from './department.type';
import {UserPositionStatus} from '../enums/user.enum';

@ObjectType()
export class Wage {
    @Field()
    id: number;

    @Field()
    departmentId: number;

    @Field(type => Department)
    department: Department;

    @Field()
    positionId: number;

    @Field(type => Position)
    position: Position;

    @Field()
    userId: number;

    @Field(type => User)
    user: User;

    @Field()
    blackSalary: number;

    @Field()
    whiteSalary: number;

    @Field({ nullable: true })
    paidWhiteSalary: number;

    @Field({ nullable: true })
    paidBlackSalary: number;

    @Field({ nullable: true })
    month: number;

    @Field({ nullable: true })
    year: number;

    @Field({ nullable: true })
    status: UserPositionStatus;
}

@InputType()
export class WageFilter {
    @Field({ nullable: true })
    departmentId: number;

    @Field({ nullable: true })
    positionId: number;

    @Field({ nullable: true })
    userId: number;
}

@InputType()
export class WageInput {
    @Field()
    departmentId: number;

    @Field()
    positionId: number;

    @Field()
    userId: number;

    @Field()
    blackSalary: number;

    @Field()
    whiteSalary: number;

    @Field({ nullable: true })
    status: UserPositionStatus;
}

@InputType()
export class WageSearchFilter {
    @Field(type => [Int], { nullable: true })
    departmentId: number[];

    @Field(type => [Int], { nullable: true })
    positionId: number[];

    @Field(type => [String], { nullable: true })
    type: string[];

    @Field(type => [String], { nullable: true })
    month: string[];

    @Field(type => [String], { nullable: true })
    year: string[];
}
