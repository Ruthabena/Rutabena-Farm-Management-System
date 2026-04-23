import { Injectable } from '@nestjs/common';
import { Field, Prisma } from '@prisma/client';
import { INSENSITIVE_MODE } from '../common/constants/prisma.constants';
import { buildPagination } from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { ListFieldsQueryDto } from './dto/list-fields-query.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { IFieldRepository } from './domain/field-repository.interface';

@Injectable()
export class FieldsRepository implements IFieldRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, dto: CreateFieldDto): Promise<Field> {
    const { metadata, ...rest } = dto;
    return this.prisma.field.create({
      data: { tenantId, ...rest, ...(metadata !== undefined ? { metadata: metadata as Prisma.InputJsonValue } : {}) },
    });
  }

  async findMany(
    tenantId: string | undefined,
    query: ListFieldsQueryDto,
  ): Promise<{ items: Field[]; total: number }> {
    const { skip, take, sortOrder } = buildPagination(query);
    const where = {
      tenantId,
      deletedAt: null,
      ...(query.farmId ? { farmId: query.farmId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: INSENSITIVE_MODE } },
              { code: { contains: query.search, mode: INSENSITIVE_MODE } },
              { soilType: { contains: query.search, mode: INSENSITIVE_MODE } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.field.findMany({ where, skip, take, orderBy: { createdAt: sortOrder } }),
      this.prisma.field.count({ where }),
    ]);

    return { items, total };
  }

  findById(id: string, tenantId: string | undefined): Promise<Field | null> {
    return this.prisma.field.findFirst({ where: { id, tenantId, deletedAt: null } });
  }

  update(id: string, dto: UpdateFieldDto): Promise<Field> {
    const { metadata, ...rest } = dto;
    return this.prisma.field.update({
      where: { id },
      data: { ...rest, ...(metadata !== undefined ? { metadata: metadata as Prisma.InputJsonValue } : {}) },
    });
  }

  softDelete(id: string): Promise<Field> {
    return this.prisma.field.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
