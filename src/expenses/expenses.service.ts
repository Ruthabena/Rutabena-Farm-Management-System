import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { buildListMeta } from '../common/prisma/prisma-query.helper';
import { requireTenantScope } from '../common/utils/tenant-scope.util';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ListExpensesQueryDto } from './dto/list-expenses-query.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { EXPENSE_REPOSITORY, IExpenseRepository } from './domain/expense-repository.interface';

@Injectable()
export class ExpensesService {
  constructor(@Inject(EXPENSE_REPOSITORY) private readonly expenses: IExpenseRepository) {}

  create(dto: CreateExpenseDto, actor: AuthenticatedUser) {
    const tenantId = requireTenantScope(actor);
    return this.expenses.create(tenantId!, dto);
  }

  async findAll(actor: AuthenticatedUser, query: ListExpensesQueryDto) {
    const tenantId = requireTenantScope(actor);
    const { items, total } = await this.expenses.findMany(tenantId, query);
    return { items, meta: buildListMeta(total, query) };
  }

  async findOne(id: string, actor: AuthenticatedUser) {
    const tenantId = requireTenantScope(actor);
    const expense = await this.expenses.findById(id, tenantId);
    if (!expense) throw new NotFoundException('Expense not found.');
    return expense;
  }

  async update(id: string, dto: UpdateExpenseDto, actor: AuthenticatedUser) {
    await this.findOne(id, actor);
    return this.expenses.update(id, dto);
  }

  async remove(id: string, actor: AuthenticatedUser) {
    await this.findOne(id, actor);
    return this.expenses.softDelete(id);
  }
}
