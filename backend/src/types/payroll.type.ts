import {ObjectType, InputType, Field, Int} from 'type-graphql';
import {PayrollType} from '../enums/payroll.enum';
import {User} from './user.type';
import {Position} from './position.type';
import {Department} from './department.type';

@ObjectType()
export class Payroll {
    @Field(type => Int)
    id: number;

    @Field()
    amount: number;

    @Field()
    type: PayrollType;

    @Field()
    userId: number;

    @Field(type => User)
    user: User;

    @Field(type => User)
    createdBy: User;

    @Field({ nullable: true })
    departmentId: number;

    @Field({ nullable: true })
    positionId: number;

    @Field(type => Department)
    department: Department;

    @Field(type => Position)
    position: Position;

    @Field()
    createdAt: string;

    @Field()
    month: number;

    @Field()
    year: number;
}

@InputType()
export class PayrollInput implements Partial<Payroll> {
    @Field({ nullable: true })
    amount: number;

    @Field({ nullable: true })
    type: PayrollType;

    @Field()
    wageId: number;

    @Field()
    month: number;

    @Field()
    year: number;
}

@InputType()
export class PayrollFilter implements Partial<Payroll> {
    @Field(type => Int, { nullable: true })
    id: number;

    @Field({ nullable: true })
    type: PayrollType;

    @Field({ nullable: true })
    userId: number;

    @Field({ nullable: true })
    departmentId: number;

    @Field({ nullable: true })
    positionId: number;

    @Field({ nullable: true })
    createdAt: string;

    @Field({ nullable: true })
    month: number;

    @Field({ nullable: true })
    year: number;
}
