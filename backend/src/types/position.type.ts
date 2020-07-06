import {ObjectType, InputType, Field, Int} from 'type-graphql';
import {Wage} from './wage.type';

@ObjectType()
export class Position {
    @Field(type => Int)
    id: number;

    @Field()
    name: string;

    @Field()
    minSalary: number;

    @Field()
    maxSalary: number;

    @Field({ nullable: true })
    description: string;

    @Field(type => [Wage])
    wages: Wage[]
}

@InputType()
export class PositionInput implements Partial<Position> {
    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    minSalary: number;

    @Field({ nullable: true })
    maxSalary: number;

    @Field({ nullable: true })
    description: string;
}

@InputType()
export class PositionFilter implements Partial<Position> {
    @Field(type => Int, { nullable: true })
    id: number;

    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    minSalary: number;

    @Field({ nullable: true })
    maxSalary: number;
}

@InputType()
export class PositionSearchFilter {
    @Field(type => [Int], { nullable: true })
    departments: number[];

    @Field(type => [String], { nullable: true })
    name: string[];
}
