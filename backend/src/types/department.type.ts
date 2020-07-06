import {ObjectType, InputType, Field, Int} from 'type-graphql';
import {Wage} from './wage.type';

@ObjectType()
export class Department {
    @Field(type => Int)
    id: number;

    @Field()
    name: string;

    @Field()
    createdAt: string;

    @Field(type => [Wage])
    wages: Wage[];
}

@InputType()
export class DepartmentInput {
    @Field({ nullable: true })
    name: string;
}

@InputType()
export class DepartmentFilter implements Partial<Department> {
    @Field(type => Int, { nullable: true })
    id: number;

    @Field({ nullable: true })
    name: string;
}

@InputType()
export class DepartmentSearchFilter {
    @Field(type => [Int], { nullable: true })
    positions: number[];

    @Field(type => [String], { nullable: true })
    name: string[];
}
