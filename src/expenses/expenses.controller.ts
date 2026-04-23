import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { TenantScoped } from '../common/decorators/tenant-scoped.decorator';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ListExpensesQueryDto } from './dto/list-expenses-query.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';

@ApiTags('Expenses')
@ApiBearerAuth('bearer')
@TenantScoped()
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @Roles(UserRole.TENANT_OWNER, UserRole.ACCOUNTANT, UserRole.FARM_MANAGER)
  create(@Body() dto: CreateExpenseDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.expensesService.create(dto, actor);
  }

  @Get()
  @Roles(UserRole.TENANT_OWNER, UserRole.ACCOUNTANT, UserRole.FARM_MANAGER)
  findAll(@CurrentUser() actor: AuthenticatedUser, @Query() query: ListExpensesQueryDto) {
    return this.expensesService.findAll(actor, query);
  }

  @Get(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.ACCOUNTANT, UserRole.FARM_MANAGER)
  findOne(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.expensesService.findOne(id, actor);
  }

  @Patch(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.ACCOUNTANT)
  update(@Param('id') id: string, @Body() dto: UpdateExpenseDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.expensesService.update(id, dto, actor);
  }

  @Patch(':id/delete')
  @Roles(UserRole.TENANT_OWNER, UserRole.ACCOUNTANT)
  remove(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.expensesService.remove(id, actor);
  }
}
