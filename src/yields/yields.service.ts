import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { buildListMeta } from '../common/prisma/prisma-query.helper';
import { requireTenantScope } from '../common/utils/tenant-scope.util';
import { CreateYieldRecordDto } from './dto/create-yield-record.dto';
import { ListYieldRecordsQueryDto } from './dto/list-yield-records-query.dto';
import { UpdateYieldRecordDto } from './dto/update-yield-record.dto';
import { IYieldRepository, YIELD_REPOSITORY } from './domain/yield-repository.interface';

@Injectable()
export class YieldsService {
  constructor(@Inject(YIELD_REPOSITORY) private readonly yields: IYieldRepository) {}

  create(dto: CreateYieldRecordDto, actor: AuthenticatedUser) {
    const tenantId = requireTenantScope(actor);
    return this.yields.create(tenantId!, dto);
  }

  async findAll(actor: AuthenticatedUser, query: ListYieldRecordsQueryDto) {
    const tenantId = requireTenantScope(actor);
    const { items, total } = await this.yields.findMany(tenantId, query);
    return { items, meta: buildListMeta(total, query) };
  }

  async findOne(id: string, actor: AuthenticatedUser) {
    const tenantId = requireTenantScope(actor);
    const record = await this.yields.findById(id, tenantId);
    if (!record) throw new NotFoundException('Yield record not found.');
    return record;
  }

  async update(id: string, dto: UpdateYieldRecordDto, actor: AuthenticatedUser) {
    await this.findOne(id, actor);
    return this.yields.update(id, dto);
  }

  async remove(id: string, actor: AuthenticatedUser) {
    await this.findOne(id, actor);
    return this.yields.softDelete(id);
  }
}
