import { InventoryItem, InventoryTransaction, Prisma } from '@prisma/client';
import { CreateInventoryItemDto } from '../dto/create-inventory-item.dto';
import { CreateInventoryTransactionDto } from '../dto/create-inventory-transaction.dto';
import { ListInventoryItemsQueryDto } from '../dto/list-inventory-items-query.dto';
import { ListInventoryTransactionsQueryDto } from '../dto/list-inventory-transactions-query.dto';
import { UpdateInventoryItemDto } from '../dto/update-inventory-item.dto';

export const INVENTORY_REPOSITORY = 'INVENTORY_REPOSITORY';

export interface IInventoryRepository {
  createItem(tenantId: string, dto: CreateInventoryItemDto): Promise<InventoryItem>;
  findManyItems(tenantId: string | undefined, query: ListInventoryItemsQueryDto): Promise<{ items: InventoryItem[]; total: number }>;
  findItemById(id: string, tenantId: string | undefined): Promise<InventoryItem | null>;
  updateItem(id: string, dto: UpdateInventoryItemDto): Promise<InventoryItem>;
  createTransactionWithStockUpdate(
    tenantId: string,
    dto: CreateInventoryTransactionDto,
    tx: Prisma.TransactionClient,
  ): Promise<InventoryTransaction>;
  findManyTransactions(tenantId: string | undefined, query: ListInventoryTransactionsQueryDto): Promise<{ items: InventoryTransaction[]; total: number }>;
  withTransaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>;
}
