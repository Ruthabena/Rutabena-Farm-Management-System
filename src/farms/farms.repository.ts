import { Injectable } from '@nestjs/common';
import { Farm, Prisma } from '@prisma/client';
import { INSENSITIVE_MODE } from '../common/constants/prisma.constants';
import { buildListMeta } from '../common/prisma/prisma-query.helper';
import { buildPagination } from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { ListFarmsQueryDto } from './dto/list-farms-query.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { IFarmRepository } from './domain/farm-repository.interface';

@Injectable()
export class FarmsRepository implements IFarmRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, dto: CreateFarmDto): Promise<Farm> {
    const { metadata, ...rest } = dto;
    return this.prisma.farm.create({
      data: { tenantId, ...rest, ...(metadata !== undefined ? { metadata: metadata as Prisma.InputJsonValue } : {}) },
    });
  }

  async findMany(
    tenantId: string | undefined,
    query: ListFarmsQueryDto,
  ): Promise<{ items: Farm[]; total: number }> {
    const { skip, take, sortOrder } = buildPagination(query);
    const where = {
      tenantId,
      deletedAt: null,
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: INSENSITIVE_MODE } },
              { code: { contains: query.search, mode: INSENSITIVE_MODE } },
              { city: { contains: query.search, mode: INSENSITIVE_MODE } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.farm.findMany({ where, skip, take, orderBy: { createdAt: sortOrder } }),
      this.prisma.farm.count({ where }),
    ]);

    return { items, total };
  }

  findById(id: string, tenantId: string | undefined): Promise<Farm | null> {
    return this.prisma.farm.findFirst({ where: { id, tenantId, deletedAt: null } });
  }

  update(id: string, dto: UpdateFarmDto): Promise<Farm> {
    const { metadata, ...rest } = dto;
    return this.prisma.farm.update({
      where: { id },
      data: { ...rest, ...(metadata !== undefined ? { metadata: metadata as Prisma.InputJsonValue } : {}) },
    });
  }

  softDelete(id: string): Promise<Farm> {
    return this.prisma.farm.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
