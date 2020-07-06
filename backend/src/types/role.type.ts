import {ObjectType, InputType, Field, Int} from 'type-graphql';
import {Right} from './right.type';

@ObjectType()
export class Role {
    @Field(type => Int)
    id: number;

    @Field()
    name: string;

    @Field(type => [Right])
    rights: Right[]
}

@InputType()
export class RoleInput {
    @Field({ nullable: true })
    name: string;

    @Field(type => [Int], { nullable: true })
    rights: number[]
}

@InputType()
export class RoleFilter implements Partial<Role> {
    @Field(type => Int, { nullable: true })
    id: number;

    @Field({ nullable: true })
    name: string;
}
