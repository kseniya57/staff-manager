import {ObjectType} from 'type-graphql';
import {InputType} from 'type-graphql/dist/decorators/InputType';
import {Field} from 'type-graphql/dist/decorators/Field';

@ObjectType()
export class SocialNetwork {
    @Field({ nullable: true })
    id: number;

    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    image: string;

    @Field({ nullable: true })
    link: string;
}

@InputType()
export class SocialNetworkInput implements Partial<SocialNetwork> {
    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    image: string;

    @Field({ nullable: true })
    link: string;
}

@InputType()
export class SocialNetworkFilter implements Partial<SocialNetwork> {
    @Field({ nullable: true })
    name: string;
}
