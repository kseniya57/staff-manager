import 'reflect-metadata';
import * as Koa from 'koa';
import * as bodyParser from 'koa-body';
import * as cors from '@koa/cors';
import * as serve from 'koa-static';
import * as Redis from 'ioredis';
import { ApolloServer } from 'apollo-server-koa';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { buildSchema } from 'type-graphql';
import { authChecker } from './guards/auth.guard';
import {UserResolver} from './resolvers/user.resolver';
import {BonusResolver} from './resolvers/bonus.resolver';
import {DepartmentResolver} from './resolvers/department.resolver';
import {ExpenseResolver} from './resolvers/expense.resolver';
import {PayrollResolver} from './resolvers/payroll.resolver';
import {PositionResolver} from './resolvers/position.resolver';
import {RightResolver} from './resolvers/right.resolver';
import {RoleResolver} from './resolvers/role.resolver';
import {SkillResolver} from './resolvers/skill.resolver';
import {SocialNetworkResolver} from './resolvers/social.resolver';
import {TagResolver} from './resolvers/tag.resolver';
import {GeneralResolver} from './resolvers/general.resolver';
import {GRAPHQL_PATH} from './constants';
import applyMiddleware from './middlewares';
import appRoutes from './controllers';
import createContext from './utils/createContext';
import {AuthResolver} from './resolvers/auth.resolver';
import {CommentResolver} from './resolvers/comment.resolver';
import {WageResolver} from './resolvers/wage.resolver';

const app = new Koa();

app.use(cors());

app.use(serve('../frontend/dist'));
app.use(serve('uploads'));

app.use(bodyParser());

app.use(appRoutes);

applyMiddleware(app);

const WEB_PORT = process.env.WEB_PORT || 4000;

const httpServer = app.listen(
    { port: WEB_PORT },
    () => console.log(`🚀 Server ready at http://localhost:${WEB_PORT}/graphql`),
);


const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = +(process.env.REDIS_PORT || 6379);

const options: Redis.RedisOptions = {
    host: REDIS_HOST,
    port: REDIS_PORT,
    retryStrategy: times => Math.max(times * 100, 3000),
  };

  export const pubSub = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options),
  });

  buildSchema({
    resolvers: [
        UserResolver,
        BonusResolver,
        DepartmentResolver,
        ExpenseResolver,
        PayrollResolver,
        PositionResolver,
        RightResolver,
        RoleResolver,
        SkillResolver,
        SocialNetworkResolver,
        TagResolver,
        GeneralResolver,
        AuthResolver,
        CommentResolver,
        WageResolver
    ],
    authChecker,
    validate: false,
    pubSub,
  }).then(schema => {
      const apolloServer = new ApolloServer({
          schema,
          context: createContext
      });

      apolloServer.applyMiddleware({ app, path: GRAPHQL_PATH });

      apolloServer.installSubscriptionHandlers(httpServer);

  });

