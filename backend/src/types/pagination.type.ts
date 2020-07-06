import {Field, InputType} from 'type-graphql';

@InputType()
export class Pagination {
    @Field({ nullable: true })
    limit?: number;

    @Field({ nullable: true })
    offset?: number;

    @Field(type => [String], { nullable: true })
    order?: string[];
}
