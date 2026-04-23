import { Injectable } from '@nestjs/common';
import { CropPlan } from '@prisma/client';
import { INSENSITIVE_MODE } from '../common/constants/prisma.constants';
import { buildPagination } from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCropPlanDto } from './dto/create-crop-plan.dto';
import { ListCropPlansQueryDto } from './dto/list-crop-plans-query.dto';
import { UpdateCropPlanDto } from './dto/update-crop-plan.dto';
import { ICropRepository } from './domain/crop-repository.interface';

@Injectable()
export class CropsRepository implements ICropRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, dto: CreateCropPlanDto): Promise<CropPlan> {
    return this.prisma.cropPlan.create({
      data: {
        tenantId,
        ...dto,
        plantingDate: dto.plantingDate ? new Date(dto.plantingDate) : undefined,
        expectedHarvestDate: dto.expectedHarvestDate ? new Date(dto.expectedHarvestDate) : undefined,
        actualHarvestDate: dto.actualHarvestDate ? new Date(dto.actualHarvestDate) : undefined,
      },
    });
  }

  async findMany(
    tenantId: string | undefined,
    query: ListCropPlansQueryDto,
  ): Promise<{ items: CropPlan[]; total: number }> {
    const { skip, take, sortOrder } = buildPagination(query);
    const where = {
      tenantId,
      deletedAt: null,
      ...(query.farmId ? { farmId: query.farmId } : {}),
      ...(query.fieldId ? { fieldId: query.fieldId } : {}),
      ...(query.seasonId ? { seasonId: query.seasonId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: INSENSITIVE_MODE } },
              { variety: { contains: query.search, mode: INSENSITIVE_MODE } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.cropPlan.findMany({ where, skip, take, orderBy: { createdAt: sortOrder } }),
      this.prisma.cropPlan.count({ where }),
    ]);

    return { items, total };
  }

  findById(id: string, tenantId: string | undefined): Promise<CropPlan | null> {
    return this.prisma.cropPlan.findFirst({ where: { id, tenantId, deletedAt: null } });
  }

  update(id: string, dto: UpdateCropPlanDto): Promise<CropPlan> {
    return this.prisma.cropPlan.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.plantingDate ? { plantingDate: new Date(dto.plantingDate) } : {}),
        ...(dto.expectedHarvestDate ? { expectedHarvestDate: new Date(dto.expectedHarvestDate) } : {}),
        ...(dto.actualHarvestDate ? { actualHarvestDate: new Date(dto.actualHarvestDate) } : {}),
      },
    });
  }

  softDelete(id: string): Promise<CropPlan> {
    return this.prisma.cropPlan.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
