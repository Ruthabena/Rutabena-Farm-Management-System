import { PartialType } from '@nestjs/swagger';
import { CreateCropPlanDto } from './create-crop-plan.dto';

export class UpdateCropPlanDto extends PartialType(CreateCropPlanDto) {}
