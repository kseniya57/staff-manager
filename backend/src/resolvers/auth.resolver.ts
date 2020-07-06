import {
    Arg,
    Mutation,
    Query,
    Resolver,
} from 'type-graphql';
import {compare} from 'bcrypt'
import {sign, verify} from 'jsonwebtoken'
import {usersTable} from '../models';
import {AuthInput, AuthOutput} from '../types/auth.type';
import {JWT_SECRET, NODE_ENV} from '../constants';

@Resolver()
export class AuthResolver {
    @Mutation(returns => AuthOutput)
    async login(
        @Arg('input', type => AuthInput) input: AuthInput,
    ): Promise<AuthOutput> {
        const user = await usersTable.get({ email: input.email }, 'id, email, password, firstName, middleName, lastName, avatar');
        const isValid = input.password && user.password && await compare(input.password, user.password);

        if (!isValid && NODE_ENV !== 'development') {
            throw new Error('Incorrect password');
        }

        const token = sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });

        return {
            token,
            user,
        };
    }

    @Query(returns => AuthOutput)
    async check(@Arg('token', type => String) token: string): Promise<AuthOutput> {
        const userData = (await verify(token, JWT_SECRET)) as { id: number };

        return userData && userData.id ? {
            token,
            user: await usersTable.get(userData.id),
        } : {};

    }
}
