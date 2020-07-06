import {Field, Int, ObjectType, InputType} from 'type-graphql';
import {Comment} from './comment.type';
import {Tag} from './tag.type';
import {Expense} from './expense.type';
import {Bonus} from './bonus.type';
import {Right} from './right.type';
import {Wage} from './wage.type';
import {SocialNetwork} from './social.type';

@ObjectType()
export class User {
    @Field(type => Int)
    id: number;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    firstName: string;

    @Field({ nullable: true })
    middleName?: string;

    @Field({ nullable: true })
    lastName: string;

    @Field({ nullable: true })
    name: string; // firstName + middleName + lastName

    @Field({ nullable: true })
    phone: string;

    @Field()
    experience: number;

    @Field()
    level: number;

    @Field({ nullable: true })
    card: string;

    @Field()
    joinedAt: string;

    @Field()
    createdAt: string;

    @Field()
    isRemote: boolean;

    @Field({ nullable: true })
    bio: string;

    @Field({ nullable: true })
    avatar?: string;

    @Field(type => [Right])
    rights: Right[];

    @Field(type => [String])
    roles: string[];

    @Field(type => [UserSocialNetwork])
    socialNetworks: UserSocialNetwork[];

    @Field(type => [String])
    skills: string[];

    @Field(type => [Comment])
    comments: Comment[];

    @Field(type => [Tag])
    tags: Tag[];

    @Field(type => [Expense])
    expenses: Expense[];

    @Field(type => [Bonus])
    bonuses: Bonus[];

    @Field(type => [Wage])
    wages: Wage[]
}

@InputType()
export class UserFilter {
    @Field(type => Int, { nullable: true })
    id: number;

    @Field({ nullable: true })
    email: string;

    @Field()
    firstName: string;

    @Field({ nullable: true })
    middleName?: string;

    @Field({ nullable: true })
    lastName: string;

    @Field({ nullable: true })
    name: string; // firstName + middleName + lastName

    @Field({ nullable: true })
    phone: string;

    @Field(type => [Int], { nullable: true })
    positions: number[];

    @Field(type => [Int], { nullable: true })
    tags: number[];

    @Field(type => [Int], { nullable: true })
    skills: number[];

    @Field({ nullable: true })
    experience: number;

    @Field({ nullable: true })
    level: number;
}

@InputType()
export class UserInput {
    @Field({ nullable: true })
    email: string;

    @Field({ nullable: true })
    phone: string;

    @Field({ nullable: true })
    firstName: string;

    @Field({ nullable: true })
    middleName?: string;

    @Field({ nullable: true })
    lastName: string;

    @Field({ nullable: true })
    position: number;

    @Field({ nullable: true })
    experience: number;

    @Field({ nullable: true })
    level: number;

    @Field(type => [Int], { nullable: true })
    rights: number[];

    @Field(type => [Int], { nullable: true })
    roles: number[];

    @Field({ nullable: true })
    isRemote: boolean;

    @Field({ nullable: true })
    bio: string;

    @Field({ nullable: true })
    avatar: string;

    @Field({ nullable: true })
    socialNetworks: string;

    @Field(type => [Int], { nullable: true })
    tags: number[];

    @Field(type => [Int], { nullable: true })
    skills: number[];

    @Field({ nullable: true })
    card: string;
}

@ObjectType()
export class UserSocialNetwork extends SocialNetwork {
    @Field({ nullable: true })
    nickname: string;
}

@InputType()
export class UserSocialNetworkInput {
    @Field()
    id: number;

    @Field({ nullable: true })
    nickname: string;
}

@InputType()
export class UserSearchFilter {
    @Field(type => [Int], { nullable: true })
    departments: number[];

    @Field(type => [Int], { nullable: true })
    positions: number[];

    @Field(type => [Int], { nullable: true })
    tags: number[];

    @Field(type => [Int], { nullable: true })
    skills: number[];

    @Field(type => [String], { nullable: true })
    email: string[];

    @Field(type => [String], { nullable: true })
    firstName: string[];

    @Field(type => [String], { nullable: true })
    lastName: string[];
}
