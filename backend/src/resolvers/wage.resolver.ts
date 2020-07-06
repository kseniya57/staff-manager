import {
    Arg,
    Authorized, FieldResolver,
    Int,
    Mutation,
    Query,
    Resolver,
    Root,
} from 'type-graphql';
import {Pagination} from '../types/pagination.type';
import {departmentsTable, payrollsTable, positionsTable, usersTable, wagesTable} from '../models';
import {Wage, WageFilter, WageInput, WageSearchFilter} from '../types/wage.type';
import {User} from '../types/user.type';
import {Position} from '../types/position.type';
import {Department} from '../types/department.type';
import {getMonthAndYear, pick} from '../utils/helpers';
import {PayrollType} from '../enums/payroll.enum';
import {PayrollFilter} from '../types/payroll.type';

const mapWageFilter = pick(['departmentId', 'positionId', 'userId', 'type', 'month', 'year']);

@Resolver(of => Wage)
export class WageResolver {
    @Authorized('READ_WAGE')
    @Query(returns => [Wage], { description: 'Get all tags' })
    async wages(
        @Arg('filter', type => WageFilter, { nullable: true }) filter?: WageFilter,
        @Arg('pagination', type => Pagination, { nullable: true }) pagination?: Pagination,
        @Arg('search', type => WageSearchFilter, { nullable: true }) search?: WageSearchFilter,
    ): Promise<Wage[]> {
        return wagesTable.all(mapWageFilter(Object.assign({}, filter, search)), undefined, pagination);
    }

    @FieldResolver()
    user(@Root() wage: Wage): Promise<User> {
        return usersTable.get(wage.userId)
    }

    @FieldResolver()
    position(@Root() wage: Wage): Promise<Position> {
        return positionsTable.get(wage.positionId)
    }

    @FieldResolver()
    department(@Root() wage: Wage): Promise<Department> {
        return departmentsTable.get(wage.departmentId)
    }

    @FieldResolver()
    paidBlackSalary(@Root() wage: Wage, @Arg('filter', type => PayrollFilter, { nullable: true }) filter?: PayrollFilter) {
        const { month, year } = getMonthAndYear(filter || {});
        return payrollsTable.get<{ amount: number }>({ wageId: wage.id, month, year, type: PayrollType.blackSalary}, 'SUM(amount) amount').then(({ amount }) => amount || 0);
    }

    @FieldResolver()
    async paidWhiteSalary(@Root() wage: Wage, @Arg('filter', type => PayrollFilter, { nullable: true }) filter?: PayrollFilter) {
        const { month, year } = getMonthAndYear(filter || {});
        return payrollsTable.get<{ amount: number }>({ wageId: wage.id, month, year, type: PayrollType.whiteSalary}, 'SUM(amount) amount').then(({ amount }) => amount || 0);
    }

    @Authorized('ADD_WAGE')
    @Mutation(returns => Int, { description: 'Add wage' })
    async addWage(
        @Arg('input', type => WageInput) wage: WageInput,
    ): Promise<number> {
        return wagesTable.insert(wage)
    }

    @Authorized('EDIT_WAGE')
    @Mutation(returns => Boolean)
    async updateWage(
        @Arg('id', type => Int) id: number,
        @Arg('input', type => WageInput) wage: WageInput,
    ): Promise<boolean> {
        return wagesTable.update(id, wage)
    }

    @Authorized('DELETE_WAGE')
    @Mutation(returns => Boolean, { description: 'Delete wage' })
    async deleteWage(
        @Arg('id', type => Int) id: number,
    ): Promise<boolean> {
        return wagesTable.remove(id)
    }
}
