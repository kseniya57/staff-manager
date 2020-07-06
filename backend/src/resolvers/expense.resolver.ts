import {
    Arg,
    Authorized,
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
import {expensesTable} from '../models';
import {Expense, ExpenseFilter, ExpenseInput} from '../types/expense.type';

enum Topic {
    expenseAdded = 'EXPENSE_ADDED',
    expenseUpdated = 'EXPENSE_UPDATED',
    expenseDeleted = 'EXPENSE_DELETED',
}

@Resolver(type => Expense)
export class ExpenseResolver {
    @Authorized('READ_EXPENSE')
    @Query(returns => [Expense], { description: 'Get all expenses' })
    async expenses(
        @Arg('filter', type => ExpenseFilter, { nullable: true }) filter?: ExpenseFilter,
        @Arg('pagination', type => Pagination, { nullable: true }) pagination?: Pagination,
    ): Promise<Expense[]> {
        return expensesTable.all(filter, '*', pagination)
    }

    @Authorized('ADD_EXPENSE')
    @Mutation(returns => Int, { description: 'Add a expense' })
    async addExpense(
        @Arg('input', type => ExpenseInput) input: ExpenseInput,
        @PubSub(Topic.expenseAdded) notifyAboutAddedExpense: Publisher<Expense>
    ): Promise<number> {
        const id = await expensesTable.insert(input);
        expensesTable.get(id).then(notifyAboutAddedExpense).catch(console.error);
        return id;
    }

    @Subscription({
        topics: Topic.expenseAdded,
    })
    expenseAdded(
        @Root() expense: Expense,
    ): Expense {
        return expense;
    }


    @Authorized('EDIT_EXPENSE')
    @Mutation(returns => Boolean, { description: 'Edit expense profile' })
    async updateExpense(
        @Arg('id', type => Int) id: number,
        @Arg('input', type => ExpenseInput) input: ExpenseInput,
        @PubSub(Topic.expenseUpdated) notifyAboutUpdatedExpense: Publisher<Expense>
    ): Promise<boolean> {
        await expensesTable.update(id, input);
        expensesTable.get(id).then(notifyAboutUpdatedExpense).catch(console.error);
        return true;
    }

    @Subscription({
        topics: Topic.expenseUpdated
    })
    expenseUpdated(
        @Root() expense: Expense,
    ): Expense {
        return expense;
    }

    @Authorized('DELETE_EXPENSE')
    @Mutation(returns => Boolean, { description: 'Delete expense' })
    async deleteExpense(
        @Arg('id', type => Int) id: number,
        @PubSub(Topic.expenseDeleted) notifyAboutDeletedExpense: Publisher<number>
    ): Promise<boolean> {
        const isDeleted = await expensesTable.remove(id);
        if (isDeleted) {
            notifyAboutDeletedExpense(id).catch(console.error);
        }
        return isDeleted;
    }

    @Subscription({
        topics: Topic.expenseDeleted
    })
    expenseDeleted(@Root() id: number): number {
        return id;
    }
}
