import {ObjectType, InputType, Field, Int} from 'type-graphql';

@ObjectType()
export class Right {
    @Field(type => Int)
    id: number;

    @Field()
    name: string;

    @Field({ nullable: true })
    description: string;
}

@InputType()
export class RightInput implements Partial<Right> {
    @Field()
    name: string;

    @Field({ nullable: true })
    description: string;
}

@InputType()
export class RightFilter implements Partial<Right> {
    @Field(type => Int, { nullable: true })
    id: number;

    @Field({ nullable: true })
    name: string;
}
