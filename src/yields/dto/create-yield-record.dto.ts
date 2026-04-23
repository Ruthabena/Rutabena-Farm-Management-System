import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UnitOfMeasure, YieldQualityGrade } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateYieldRecordDto {
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
  @IsUUID()
  cropPlanId: string;

  @ApiProperty()
  @IsDateString()
  harvestDate: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ enum: UnitOfMeasure })
  @IsEnum(UnitOfMeasure)
  unit: UnitOfMeasure;

  @ApiPropertyOptional({ enum: YieldQualityGrade })
  @IsOptional()
  @IsEnum(YieldQualityGrade)
  qualityGrade?: YieldQualityGrade;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  lossWaste?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
