import { Injectable } from '@nestjs/common';
import { FarmActivity } from '@prisma/client';
import { INSENSITIVE_MODE } from '../common/constants/prisma.constants';
import { buildPagination } from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ListActivitiesQueryDto } from './dto/list-activities-query.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { IActivityRepository } from './domain/activity-repository.interface';

@Injectable()
export class ActivitiesRepository implements IActivityRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, dto: CreateActivityDto): Promise<FarmActivity> {
    return this.prisma.farmActivity.create({
      data: {
        tenantId,
        ...dto,
        scheduledDate: new Date(dto.scheduledDate),
        completedDate: dto.completedDate ? new Date(dto.completedDate) : undefined,
      },
    });
  }

  async findMany(
    tenantId: string | undefined,
    query: ListActivitiesQueryDto,
  ): Promise<{ items: FarmActivity[]; total: number }> {
    const { skip, take, sortOrder } = buildPagination(query);
    const where = {
      tenantId,
      deletedAt: null,
      ...(query.farmId ? { farmId: query.farmId } : {}),
      ...(query.fieldId ? { fieldId: query.fieldId } : {}),
      ...(query.seasonId ? { seasonId: query.seasonId } : {}),
      ...(query.cropPlanId ? { cropPlanId: query.cropPlanId } : {}),
      ...(query.activityType ? { activityType: query.activityType } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.search ? { notes: { contains: query.search, mode: INSENSITIVE_MODE } } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.farmActivity.findMany({ where, skip, take, orderBy: { scheduledDate: sortOrder } }),
      this.prisma.farmActivity.count({ where }),
    ]);

    return { items, total };
  }

  findById(id: string, tenantId: string | undefined): Promise<FarmActivity | null> {
    return this.prisma.farmActivity.findFirst({ where: { id, tenantId, deletedAt: null } });
  }

  update(id: string, dto: UpdateActivityDto): Promise<FarmActivity> {
    return this.prisma.farmActivity.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.scheduledDate ? { scheduledDate: new Date(dto.scheduledDate) } : {}),
        ...(dto.completedDate ? { completedDate: new Date(dto.completedDate) } : {}),
      },
    });
  }

  softDelete(id: string): Promise<FarmActivity> {
    return this.prisma.farmActivity.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
