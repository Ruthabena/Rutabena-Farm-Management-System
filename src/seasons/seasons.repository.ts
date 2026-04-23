import { Injectable } from '@nestjs/common';
import { Season } from '@prisma/client';
import { INSENSITIVE_MODE } from '../common/constants/prisma.constants';
import { buildPagination } from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSeasonDto } from './dto/create-season.dto';
import { ListSeasonsQueryDto } from './dto/list-seasons-query.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { ISeasonRepository } from './domain/season-repository.interface';

@Injectable()
export class SeasonsRepository implements ISeasonRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, dto: CreateSeasonDto): Promise<Season> {
    return this.prisma.season.create({
      data: {
        tenantId,
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async findMany(
    tenantId: string | undefined,
    query: ListSeasonsQueryDto,
  ): Promise<{ items: Season[]; total: number }> {
    const { skip, take, sortOrder } = buildPagination(query);
    const where = {
      tenantId,
      deletedAt: null,
      ...(query.farmId ? { farmId: query.farmId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.startDate || query.endDate
        ? {
            startDate: {
              ...(query.startDate ? { gte: new Date(query.startDate) } : {}),
              ...(query.endDate ? { lte: new Date(query.endDate) } : {}),
            },
          }
        : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: INSENSITIVE_MODE } },
              { code: { contains: query.search, mode: INSENSITIVE_MODE } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.season.findMany({ where, skip, take, orderBy: { createdAt: sortOrder } }),
      this.prisma.season.count({ where }),
    ]);

    return { items, total };
  }

  findById(id: string, tenantId: string | undefined): Promise<Season | null> {
    return this.prisma.season.findFirst({ where: { id, tenantId, deletedAt: null } });
  }

  update(id: string, dto: UpdateSeasonDto): Promise<Season> {
    return this.prisma.season.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.startDate ? { startDate: new Date(dto.startDate) } : {}),
        ...(dto.endDate ? { endDate: new Date(dto.endDate) } : {}),
      },
    });
  }

  softDelete(id: string): Promise<Season> {
    return this.prisma.season.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
