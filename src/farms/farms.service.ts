import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { buildListMeta } from '../common/prisma/prisma-query.helper';
import { requireTenantScope } from '../common/utils/tenant-scope.util';
import { CreateFarmDto } from './dto/create-farm.dto';
import { ListFarmsQueryDto } from './dto/list-farms-query.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { FARM_REPOSITORY, IFarmRepository } from './domain/farm-repository.interface';

@Injectable()
export class FarmsService {
  constructor(@Inject(FARM_REPOSITORY) private readonly farms: IFarmRepository) {}

  create(dto: CreateFarmDto, actor: AuthenticatedUser) {
    const tenantId = requireTenantScope(actor);
    return this.farms.create(tenantId!, dto);
  }

  async findAll(actor: AuthenticatedUser, query: ListFarmsQueryDto) {
    const tenantId = requireTenantScope(actor);
    const { items, total } = await this.farms.findMany(tenantId, query);
    return { items, meta: buildListMeta(total, query) };
  }

  async findOne(id: string, actor: AuthenticatedUser) {
    const tenantId = requireTenantScope(actor);
    const farm = await this.farms.findById(id, tenantId);
    if (!farm) throw new NotFoundException('Farm not found.');
    return farm;
  }

  async update(id: string, dto: UpdateFarmDto, actor: AuthenticatedUser) {
    await this.findOne(id, actor);
    return this.farms.update(id, dto);
  }

  async remove(id: string, actor: AuthenticatedUser) {
    await this.findOne(id, actor);
    return this.farms.softDelete(id);
  }
}
