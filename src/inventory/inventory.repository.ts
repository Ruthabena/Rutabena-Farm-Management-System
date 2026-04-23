import { Injectable } from '@nestjs/common';
import { InventoryItem, InventoryTransaction, InventoryTransactionType, Prisma } from '@prisma/client';
import { INSENSITIVE_MODE } from '../common/constants/prisma.constants';
import { buildPagination } from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { CreateInventoryTransactionDto } from './dto/create-inventory-transaction.dto';
import { ListInventoryItemsQueryDto } from './dto/list-inventory-items-query.dto';
import { ListInventoryTransactionsQueryDto } from './dto/list-inventory-transactions-query.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { IInventoryRepository } from './domain/inventory-repository.interface';

@Injectable()
export class InventoryRepository implements IInventoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  createItem(tenantId: string, dto: CreateInventoryItemDto): Promise<InventoryItem> {
    return this.prisma.inventoryItem.create({
      data: { tenantId, ...dto, quantityOnHand: dto.quantityOnHand ?? 0 },
    });
  }

  async findManyItems(
    tenantId: string | undefined,
    query: ListInventoryItemsQueryDto,
  ): Promise<{ items: InventoryItem[]; total: number }> {
    const { skip, take, sortOrder } = buildPagination(query);
    const where = {
      tenantId,
      deletedAt: null,
      ...(query.itemType ? { itemType: query.itemType } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: INSENSITIVE_MODE } },
              { sku: { contains: query.search, mode: INSENSITIVE_MODE } },
              { supplier: { contains: query.search, mode: INSENSITIVE_MODE } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.inventoryItem.findMany({ where, skip, take, orderBy: { createdAt: sortOrder } }),
      this.prisma.inventoryItem.count({ where }),
    ]);

    return { items, total };
  }

  findItemById(id: string, tenantId: string | undefined): Promise<InventoryItem | null> {
    return this.prisma.inventoryItem.findFirst({ where: { id, tenantId, deletedAt: null } });
  }

  updateItem(id: string, dto: UpdateInventoryItemDto): Promise<InventoryItem> {
    return this.prisma.inventoryItem.update({ where: { id }, data: dto });
  }

  async createTransactionWithStockUpdate(
    tenantId: string,
    dto: CreateInventoryTransactionDto,
    tx: Prisma.TransactionClient,
  ): Promise<InventoryTransaction> {
    const delta =
      dto.transactionType === InventoryTransactionType.STOCK_OUT ? -dto.quantity : dto.quantity;

    const transaction = await tx.inventoryTransaction.create({
      data: { tenantId, ...dto, transactionDate: new Date(dto.transactionDate) },
    });

    await tx.inventoryItem.update({
      where: { id: dto.inventoryItemId },
      data: { quantityOnHand: { increment: delta } },
    });

    return transaction;
  }

  async findManyTransactions(
    tenantId: string | undefined,
    query: ListInventoryTransactionsQueryDto,
  ): Promise<{ items: InventoryTransaction[]; total: number }> {
    const { skip, take, sortOrder } = buildPagination(query);
    const where = {
      tenantId,
      deletedAt: null,
      ...(query.inventoryItemId ? { inventoryItemId: query.inventoryItemId } : {}),
      ...(query.transactionType ? { transactionType: query.transactionType } : {}),
      ...(query.search ? { notes: { contains: query.search, mode: INSENSITIVE_MODE } } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.inventoryTransaction.findMany({ where, skip, take, orderBy: { transactionDate: sortOrder } }),
      this.prisma.inventoryTransaction.count({ where }),
    ]);

    return { items, total };
  }

  withTransaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}
