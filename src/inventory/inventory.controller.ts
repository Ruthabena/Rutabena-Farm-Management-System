import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { TenantScoped } from '../common/decorators/tenant-scoped.decorator';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { CreateInventoryTransactionDto } from './dto/create-inventory-transaction.dto';
import { ListInventoryItemsQueryDto } from './dto/list-inventory-items-query.dto';
import { ListInventoryTransactionsQueryDto } from './dto/list-inventory-transactions-query.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { InventoryService } from './inventory.service';

@ApiTags('Inventory')
@ApiBearerAuth('bearer')
@TenantScoped()
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('items')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.ACCOUNTANT)
  createItem(@Body() dto: CreateInventoryItemDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.inventoryService.createItem(dto, actor);
  }

  @Get('items')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.ACCOUNTANT, UserRole.FIELD_OFFICER)
  listItems(@CurrentUser() actor: AuthenticatedUser, @Query() query: ListInventoryItemsQueryDto) {
    return this.inventoryService.listItems(actor, query);
  }

  @Get('items/:id')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.ACCOUNTANT, UserRole.FIELD_OFFICER)
  getItem(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.inventoryService.getItem(id, actor);
  }

  @Patch('items/:id')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.ACCOUNTANT)
  updateItem(@Param('id') id: string, @Body() dto: UpdateInventoryItemDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.inventoryService.updateItem(id, dto, actor);
  }

  @Post('transactions')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.ACCOUNTANT, UserRole.FIELD_OFFICER)
  createTransaction(
    @Body() dto: CreateInventoryTransactionDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.inventoryService.createTransaction(dto, actor);
  }

  @Get('transactions')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.ACCOUNTANT, UserRole.FIELD_OFFICER)
  listTransactions(
    @CurrentUser() actor: AuthenticatedUser,
    @Query() query: ListInventoryTransactionsQueryDto,
  ) {
    return this.inventoryService.listTransactions(actor, query);
  }
}
