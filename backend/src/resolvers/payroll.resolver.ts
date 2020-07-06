import {
    Arg,
    Authorized, Ctx, FieldResolver,
    Int,
    Mutation,
    Publisher,
    PubSub,
    Query,
    Resolver,
    Root,
    Subscription,
} from 'type-graphql';
import {Pagination} from '../types/pagination.type';
import {departmentsTable, payrollsTable, positionsTable, usersTable} from '../models';
import {Payroll, PayrollFilter, PayrollInput} from '../types/payroll.type';
import {Context} from '../interfaces/context.interface';
import {processTimestamps} from '../utils/helpers';
import {Wage, WageSearchFilter} from '../types/wage.type';
import {Position} from '../types/position.type';
import {Department} from '../types/department.type';

enum Topic {
    payrollAdded = 'PAYROLL_ADDED',
    payrollUpdated = 'PAYROLL_UPDATED',
    payrollDeleted = 'PAYROLL_DELETED',
}

@Resolver(type => Payroll)
export class PayrollResolver {
    @Authorized('READ_PAYROLL')
    @Query(returns => [Payroll], { description: 'Get all payrolls' })
    async payrolls(
        @Arg('filter', type => PayrollFilter, { nullable: true }) filter?: PayrollFilter,
        @Arg('pagination', type => Pagination, { nullable: true }) pagination?: Pagination,
        @Arg('search', type => WageSearchFilter, { nullable: true }) search?: WageSearchFilter,
    ): Promise<Payroll[]> {
        // @ts-ignore
        return payrollsTable.all(
            Object.assign({}, filter, search),
            'wages.userId, wages.positionId, wages.departmentId, wages.blackSalary, wages.whiteSalary, payrolls.*',
            pagination,
            {
                wages: 'wages.id = payrolls.wageId'
        }).then(processTimestamps)
    }

    @Authorized('ADD_PAYROLL')
    @Mutation(returns => Int, { description: 'Add a payroll' })
    async addPayroll(
        @Arg('input', type => PayrollInput) input: PayrollInput,
        @PubSub(Topic.payrollAdded) notifyAboutAddedPayroll: Publisher<Payroll>,
        @Ctx() ctx: Context
    ): Promise<number> {
        const id = await payrollsTable.insert(Object.assign(input, { createdBy: ctx.session.userId }));
        // @ts-ignore
        payrollsTable.get(id).then(processTimestamps).then(notifyAboutAddedPayroll).catch(console.error);
        return id;
    }

    @Subscription({
        topics: Topic.payrollAdded,
    })
    payrollAdded(
        @Root() payroll: Payroll,
    ): Payroll {
        return payroll;
    }


    @Authorized('EDIT_PAYROLL')
    @Mutation(returns => Boolean, { description: 'Edit payroll profile' })
    async updatePayroll(
        @Arg('id', type => Int) id: number,
        @Arg('input', type => PayrollInput) input: PayrollInput,
        @PubSub(Topic.payrollUpdated) notifyAboutUpdatedPayroll: Publisher<Payroll>
    ): Promise<boolean> {
        await payrollsTable.update(id, input);
        // @ts-ignore
        payrollsTable.get(id).then(processTimestamps).then(notifyAboutUpdatedPayroll).catch(console.error);
        return true;
    }

    @Subscription({
        topics: Topic.payrollUpdated
    })
    payrollUpdated(
        @Root() payroll: Payroll,
    ): Payroll {
        return payroll;
    }

    @Authorized('DELETE_PAYROLL')
    @Mutation(returns => Boolean, { description: 'Delete payroll' })
    async deletePayroll(
        @Arg('id', type => Int) id: number,
        @PubSub(Topic.payrollDeleted) notifyAboutDeletedPayroll: Publisher<number>
    ): Promise<boolean> {
        const isDeleted = await payrollsTable.remove(id);
        if (isDeleted) {
            notifyAboutDeletedPayroll(id).catch(console.error);
        }
        return isDeleted;
    }

    @Subscription({
        topics: Topic.payrollDeleted
    })
    payrollDeleted(@Root() id: number): number {
        return id;
    }

    @FieldResolver()
    user(@Root() payroll: Payroll) {
        return usersTable.get(payroll.userId, 'id, firstName, middleName, lastName, email')
    }

    @FieldResolver()
    createdBy(@Root() payroll: Payroll) {
        return usersTable.get(payroll.createdBy, 'id, firstName, middleName, lastName, email')
    }

    @FieldResolver()
    position(@Root() wage: Wage): Promise<Position> {
        return positionsTable.get(wage.positionId)
    }

    @FieldResolver()
    department(@Root() wage: Wage): Promise<Department> {
        return departmentsTable.get(wage.departmentId)
    }
}
