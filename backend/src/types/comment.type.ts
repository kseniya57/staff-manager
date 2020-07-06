import {ObjectType, InputType, Field, Int} from 'type-graphql';
import {User} from './user.type';

@ObjectType()
export class Comment {
    @Field(type => Int)
    id: number;

    @Field()
    content: string;

    @Field(type => User)
    user: User;

    @Field(type => User)
    createdBy: User;

    @Field()
    rating: number;

    @Field()
    createdAt: string;
}

@InputType()
export class CommentInput implements Partial<Comment> {
    @Field()
    content: string;

    @Field()
    userId: number;

    @Field({ nullable: true })
    rating: number;
}

@InputType()
export class CommentFilter {
    @Field(type => Int, { nullable: true })
    id: number;

    @Field(type => Int, { nullable: true })
    userId: number;

    @Field(type => Int, { nullable: true })
    createdBy: number;

    @Field({ nullable: true })
    rating: number;
}
