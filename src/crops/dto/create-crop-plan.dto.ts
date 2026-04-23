import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CropPlanStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCropPlanDto {
  @ApiProperty()
  @IsUUID()
  farmId: string;

  @ApiProperty()
  @IsUUID()
  fieldId: string;

  @ApiProperty()
  @IsUUID()
  seasonId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  variety?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  plantingDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  expectedHarvestDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  actualHarvestDate?: string;

  @ApiPropertyOptional({ enum: CropPlanStatus })
  @IsOptional()
  @IsEnum(CropPlanStatus)
  status?: CropPlanStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  areaCultivated?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
