import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { buildListMeta } from '../common/prisma/prisma-query.helper';
import { requireTenantScope } from '../common/utils/tenant-scope.util';
import { CreateCropPlanDto } from './dto/create-crop-plan.dto';
import { ListCropPlansQueryDto } from './dto/list-crop-plans-query.dto';
import { UpdateCropPlanDto } from './dto/update-crop-plan.dto';
import { CROP_REPOSITORY, ICropRepository } from './domain/crop-repository.interface';

@Injectable()
export class CropsService {
  constructor(@Inject(CROP_REPOSITORY) private readonly crops: ICropRepository) {}

  create(dto: CreateCropPlanDto, actor: AuthenticatedUser) {
    const tenantId = requireTenantScope(actor);
    return this.crops.create(tenantId!, dto);
  }

  async findAll(actor: AuthenticatedUser, query: ListCropPlansQueryDto) {
    const tenantId = requireTenantScope(actor);
    const { items, total } = await this.crops.findMany(tenantId, query);
    return { items, meta: buildListMeta(total, query) };
  }

  async findOne(id: string, actor: AuthenticatedUser) {
    const tenantId = requireTenantScope(actor);
    const cropPlan = await this.crops.findById(id, tenantId);
    if (!cropPlan) throw new NotFoundException('Crop plan not found.');
    return cropPlan;
  }

  async update(id: string, dto: UpdateCropPlanDto, actor: AuthenticatedUser) {
    await this.findOne(id, actor);
    return this.crops.update(id, dto);
  }

  async remove(id: string, actor: AuthenticatedUser) {
    await this.findOne(id, actor);
    return this.crops.softDelete(id);
  }
}
