import { ApiPropertyOptional } from '@nestjs/swagger';
import { CropPlanStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class ListCropPlansQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  farmId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  fieldId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  seasonId?: string;

  @ApiPropertyOptional({ enum: CropPlanStatus })
  @IsOptional()
  @IsEnum(CropPlanStatus)
  status?: CropPlanStatus;
}
