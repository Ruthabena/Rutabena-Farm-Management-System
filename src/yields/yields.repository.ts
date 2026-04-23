import { Injectable } from '@nestjs/common';
import { YieldRecord } from '@prisma/client';
import { buildPagination } from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateYieldRecordDto } from './dto/create-yield-record.dto';
import { ListYieldRecordsQueryDto } from './dto/list-yield-records-query.dto';
import { UpdateYieldRecordDto } from './dto/update-yield-record.dto';
import { IYieldRepository } from './domain/yield-repository.interface';

@Injectable()
export class YieldsRepository implements IYieldRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, dto: CreateYieldRecordDto): Promise<YieldRecord> {
    return this.prisma.yieldRecord.create({
      data: { tenantId, ...dto, harvestDate: new Date(dto.harvestDate) },
    });
  }

  async findMany(
    tenantId: string | undefined,
    query: ListYieldRecordsQueryDto,
  ): Promise<{ items: YieldRecord[]; total: number }> {
    const { skip, take, sortOrder } = buildPagination(query);
    const where = {
      tenantId,
      deletedAt: null,
      ...(query.farmId ? { farmId: query.farmId } : {}),
      ...(query.fieldId ? { fieldId: query.fieldId } : {}),
      ...(query.seasonId ? { seasonId: query.seasonId } : {}),
      ...(query.cropPlanId ? { cropPlanId: query.cropPlanId } : {}),
      ...(query.startDate || query.endDate
        ? {
            harvestDate: {
              ...(query.startDate ? { gte: new Date(query.startDate) } : {}),
              ...(query.endDate ? { lte: new Date(query.endDate) } : {}),
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.yieldRecord.findMany({ where, skip, take, orderBy: { harvestDate: sortOrder } }),
      this.prisma.yieldRecord.count({ where }),
    ]);

    return { items, total };
  }

  findById(id: string, tenantId: string | undefined): Promise<YieldRecord | null> {
    return this.prisma.yieldRecord.findFirst({ where: { id, tenantId, deletedAt: null } });
  }

  update(id: string, dto: UpdateYieldRecordDto): Promise<YieldRecord> {
    return this.prisma.yieldRecord.update({
      where: { id },
      data: { ...dto, ...(dto.harvestDate ? { harvestDate: new Date(dto.harvestDate) } : {}) },
    });
  }

  softDelete(id: string): Promise<YieldRecord> {
    return this.prisma.yieldRecord.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
