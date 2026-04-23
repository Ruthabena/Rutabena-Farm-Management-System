import { CropPlan } from '@prisma/client';
import { CreateCropPlanDto } from '../dto/create-crop-plan.dto';
import { ListCropPlansQueryDto } from '../dto/list-crop-plans-query.dto';
import { UpdateCropPlanDto } from '../dto/update-crop-plan.dto';

export const CROP_REPOSITORY = 'CROP_REPOSITORY';

export interface ICropRepository {
  create(tenantId: string, dto: CreateCropPlanDto): Promise<CropPlan>;
  findMany(tenantId: string | undefined, query: ListCropPlansQueryDto): Promise<{ items: CropPlan[]; total: number }>;
  findById(id: string, tenantId: string | undefined): Promise<CropPlan | null>;
  update(id: string, dto: UpdateCropPlanDto): Promise<CropPlan>;
  softDelete(id: string): Promise<CropPlan>;
}
