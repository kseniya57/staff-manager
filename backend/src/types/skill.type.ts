import {ObjectType, InputType, Field, Int} from 'type-graphql';

@ObjectType()
export class Skill {
    @Field(type => Int)
    id: number;

    @Field()
    name: string;
}

@InputType()
export class SkillInput implements Partial<Skill> {
    @Field()
    name: string;
}

@InputType()
export class SkillFilter implements Partial<Skill> {
    @Field(type => Int, { nullable: true })
    id: number;

    @Field({ nullable: true })
    name: string;
}
