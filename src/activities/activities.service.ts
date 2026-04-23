import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { buildListMeta } from '../common/prisma/prisma-query.helper';
import { requireTenantScope } from '../common/utils/tenant-scope.util';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ListActivitiesQueryDto } from './dto/list-activities-query.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ACTIVITY_REPOSITORY, IActivityRepository } from './domain/activity-repository.interface';

@Injectable()
export class ActivitiesService {
  constructor(@Inject(ACTIVITY_REPOSITORY) private readonly activities: IActivityRepository) {}

  create(dto: CreateActivityDto, actor: AuthenticatedUser) {
    const tenantId = requireTenantScope(actor);
    return this.activities.create(tenantId!, dto);
  }

  async findAll(actor: AuthenticatedUser, query: ListActivitiesQueryDto) {
    const tenantId = requireTenantScope(actor);
    const { items, total } = await this.activities.findMany(tenantId, query);
    return { items, meta: buildListMeta(total, query) };
  }

  async findOne(id: string, actor: AuthenticatedUser) {
    const tenantId = requireTenantScope(actor);
    const activity = await this.activities.findById(id, tenantId);
    if (!activity) throw new NotFoundException('Activity not found.');
    return activity;
  }

  async update(id: string, dto: UpdateActivityDto, actor: AuthenticatedUser) {
    await this.findOne(id, actor);
    return this.activities.update(id, dto);
  }

  async remove(id: string, actor: AuthenticatedUser) {
    await this.findOne(id, actor);
    return this.activities.softDelete(id);
  }
}
