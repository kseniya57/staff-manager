import {ObjectType, InputType, Field, Int} from 'type-graphql';

@ObjectType()
export class Expense {
    @Field(type => Int)
    id: number;

    @Field()
    type: string;

    @Field()
    amount: number;

    @Field({ nullable: true })
    description: string;
}

@InputType()
export class ExpenseInput implements Partial<Expense> {
    @Field({ nullable: true })
    type: string;

    @Field({ nullable: true })
    amount: number;

    @Field({ nullable: true })
    description: string;
}

@InputType()
export class ExpenseFilter implements Partial<Expense> {
    @Field(type => Int, { nullable: true })
    id: number;

    @Field({ nullable: true })
    type: string;
}
