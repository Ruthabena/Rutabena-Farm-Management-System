import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { buildListMeta } from '../common/prisma/prisma-query.helper';
import { requireTenantScope } from '../common/utils/tenant-scope.util';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { CreateInventoryTransactionDto } from './dto/create-inventory-transaction.dto';
import { ListInventoryItemsQueryDto } from './dto/list-inventory-items-query.dto';
import { ListInventoryTransactionsQueryDto } from './dto/list-inventory-transactions-query.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { INVENTORY_REPOSITORY, IInventoryRepository } from './domain/inventory-repository.interface';

@Injectable()
export class InventoryService {
  constructor(@Inject(INVENTORY_REPOSITORY) private readonly inventory: IInventoryRepository) {}

  createItem(dto: CreateInventoryItemDto, actor: AuthenticatedUser) {
    const tenantId = requireTenantScope(actor);
    return this.inventory.createItem(tenantId!, dto);
  }

  async listItems(actor: AuthenticatedUser, query: ListInventoryItemsQueryDto) {
    const tenantId = requireTenantScope(actor);
    const { items, total } = await this.inventory.findManyItems(tenantId, query);
    return { items, meta: buildListMeta(total, query) };
  }

  async getItem(id: string, actor: AuthenticatedUser) {
    const tenantId = requireTenantScope(actor);
    const item = await this.inventory.findItemById(id, tenantId);
    if (!item) throw new NotFoundException('Inventory item not found.');
    return item;
  }

  async updateItem(id: string, dto: UpdateInventoryItemDto, actor: AuthenticatedUser) {
    await this.getItem(id, actor);
    return this.inventory.updateItem(id, dto);
  }

  async createTransaction(dto: CreateInventoryTransactionDto, actor: AuthenticatedUser) {
    const tenantId = requireTenantScope(actor);

    return this.inventory.withTransaction(async (tx) => {
      const item = await this.inventory.findItemById(dto.inventoryItemId, tenantId!);
      if (!item) throw new NotFoundException('Inventory item not found.');
      return this.inventory.createTransactionWithStockUpdate(tenantId!, dto, tx);
    });
  }

  async listTransactions(actor: AuthenticatedUser, query: ListInventoryTransactionsQueryDto) {
    const tenantId = requireTenantScope(actor);
    const { items, total } = await this.inventory.findManyTransactions(tenantId, query);
    return { items, meta: buildListMeta(total, query) };
  }
}
