import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EXPENSE_REPOSITORY } from './domain/expense-repository.interface';
import { ExpensesController } from './expenses.controller';
import { ExpensesRepository } from './expenses.repository';
import { ExpensesService } from './expenses.service';

@Module({
  imports: [PrismaModule],
  controllers: [ExpensesController],
  providers: [
    ExpensesService,
    { provide: EXPENSE_REPOSITORY, useClass: ExpensesRepository },
  ],
  exports: [ExpensesService],
})
export class ExpensesModule {}
