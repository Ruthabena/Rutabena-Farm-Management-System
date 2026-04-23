import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ActivityStatus, ActivityType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateActivityDto {
  @ApiProperty()
  @IsUUID()
  farmId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  fieldId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  seasonId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  cropPlanId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assignedUserId?: string;

  @ApiProperty({ enum: ActivityType })
  @IsEnum(ActivityType)
  activityType: ActivityType;

  @ApiProperty()
  @IsDateString()
  scheduledDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  completedDate?: string;

  @ApiPropertyOptional({ enum: ActivityStatus })
  @IsOptional()
  @IsEnum(ActivityStatus)
  status?: ActivityStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  estimatedCost?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  actualCost?: number;
}
