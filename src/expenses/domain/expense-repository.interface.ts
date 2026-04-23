import { Expense } from '@prisma/client';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { ListExpensesQueryDto } from '../dto/list-expenses-query.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';

export const EXPENSE_REPOSITORY = 'EXPENSE_REPOSITORY';

export interface IExpenseRepository {
  create(tenantId: string, dto: CreateExpenseDto): Promise<Expense>;
  findMany(tenantId: string | undefined, query: ListExpensesQueryDto): Promise<{ items: Expense[]; total: number }>;
  findById(id: string, tenantId: string | undefined): Promise<Expense | null>;
  update(id: string, dto: UpdateExpenseDto): Promise<Expense>;
  softDelete(id: string): Promise<Expense>;
}
