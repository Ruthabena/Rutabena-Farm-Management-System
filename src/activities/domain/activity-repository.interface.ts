import { FarmActivity } from '@prisma/client';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { ListActivitiesQueryDto } from '../dto/list-activities-query.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';

export const ACTIVITY_REPOSITORY = 'ACTIVITY_REPOSITORY';

export interface IActivityRepository {
  create(tenantId: string, dto: CreateActivityDto): Promise<FarmActivity>;
  findMany(tenantId: string | undefined, query: ListActivitiesQueryDto): Promise<{ items: FarmActivity[]; total: number }>;
  findById(id: string, tenantId: string | undefined): Promise<FarmActivity | null>;
  update(id: string, dto: UpdateActivityDto): Promise<FarmActivity>;
  softDelete(id: string): Promise<FarmActivity>;
}
