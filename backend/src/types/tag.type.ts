import {ObjectType, InputType, Field, Int} from 'type-graphql';

@ObjectType()
export class Tag {
    @Field(type => Int)
    id: number;

    @Field()
    name: string;

    @Field({ nullable: true })
    color: string;
}

@InputType()
export class TagInput implements Partial<Tag> {
    @Field()
    name: string;

    @Field({ nullable: true })
    color: string;
}

@InputType()
export class TagFilter implements Partial<Tag> {
    @Field(type => Int, { nullable: true })
    id: number;

    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    color: string;
}
