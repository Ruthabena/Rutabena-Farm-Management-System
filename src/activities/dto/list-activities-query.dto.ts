import { ApiPropertyOptional } from '@nestjs/swagger';
import { ActivityStatus, ActivityType } from '@prisma/client';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class ListActivitiesQueryDto extends PaginationQueryDto {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  cropPlanId?: string;

  @ApiPropertyOptional({ enum: ActivityType })
  @IsOptional()
  @IsEnum(ActivityType)
  activityType?: ActivityType;

  @ApiPropertyOptional({ enum: ActivityStatus })
  @IsOptional()
  @IsEnum(ActivityStatus)
  status?: ActivityStatus;
}
