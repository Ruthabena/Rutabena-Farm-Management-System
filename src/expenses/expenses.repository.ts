import { Injectable } from '@nestjs/common';
import { Expense } from '@prisma/client';
import { INSENSITIVE_MODE } from '../common/constants/prisma.constants';
import { buildPagination } from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ListExpensesQueryDto } from './dto/list-expenses-query.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { IExpenseRepository } from './domain/expense-repository.interface';

@Injectable()
export class ExpensesRepository implements IExpenseRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, dto: CreateExpenseDto): Promise<Expense> {
    return this.prisma.expense.create({
      data: { tenantId, ...dto, paymentDate: new Date(dto.paymentDate) },
    });
  }

  async findMany(
    tenantId: string | undefined,
    query: ListExpensesQueryDto,
  ): Promise<{ items: Expense[]; total: number }> {
    const { skip, take, sortOrder } = buildPagination(query);
    const where = {
      tenantId,
      deletedAt: null,
      ...(query.farmId ? { farmId: query.farmId } : {}),
      ...(query.fieldId ? { fieldId: query.fieldId } : {}),
      ...(query.seasonId ? { seasonId: query.seasonId } : {}),
      ...(query.cropPlanId ? { cropPlanId: query.cropPlanId } : {}),
      ...(query.category ? { category: query.category } : {}),
      ...(query.startDate || query.endDate
        ? {
            paymentDate: {
              ...(query.startDate ? { gte: new Date(query.startDate) } : {}),
              ...(query.endDate ? { lte: new Date(query.endDate) } : {}),
            },
          }
        : {}),
      ...(query.search
        ? {
            OR: [
              { description: { contains: query.search, mode: INSENSITIVE_MODE } },
              { vendor: { contains: query.search, mode: INSENSITIVE_MODE } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.expense.findMany({ where, skip, take, orderBy: { paymentDate: sortOrder } }),
      this.prisma.expense.count({ where }),
    ]);

    return { items, total };
  }

  findById(id: string, tenantId: string | undefined): Promise<Expense | null> {
    return this.prisma.expense.findFirst({ where: { id, tenantId, deletedAt: null } });
  }

  update(id: string, dto: UpdateExpenseDto): Promise<Expense> {
    return this.prisma.expense.update({
      where: { id },
      data: { ...dto, ...(dto.paymentDate ? { paymentDate: new Date(dto.paymentDate) } : {}) },
    });
  }

  softDelete(id: string): Promise<Expense> {
    return this.prisma.expense.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
