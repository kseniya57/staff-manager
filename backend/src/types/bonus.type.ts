import {ObjectType, InputType, Field, Int} from 'type-graphql';

@ObjectType()
export class Bonus {
    @Field(type => Int)
    id: number;

    @Field()
    name: string;

    @Field()
    amount: number;

    @Field()
    description: string;

    @Field()
    createdAt: string;

    @Field()
    updatedAt: string;
}

@InputType()
export class BonusInput implements Partial<Bonus> {
    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    amount: number;

    @Field({ nullable: true })
    description: string;
}

@InputType()
export class BonusFilter implements Partial<Bonus> {
    @Field(type => Int, { nullable: true })
    id: number;

    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    amount: number;
}
