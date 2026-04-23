import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { INVENTORY_REPOSITORY } from './domain/inventory-repository.interface';
import { InventoryController } from './inventory.controller';
import { InventoryRepository } from './inventory.repository';
import { InventoryService } from './inventory.service';

@Module({
  imports: [PrismaModule],
  controllers: [InventoryController],
  providers: [
    InventoryService,
    { provide: INVENTORY_REPOSITORY, useClass: InventoryRepository },
  ],
  exports: [InventoryService],
})
export class InventoryModule {}
