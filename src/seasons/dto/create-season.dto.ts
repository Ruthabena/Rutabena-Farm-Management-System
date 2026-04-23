import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SeasonStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateSeasonDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  farmId?: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: SeasonStatus })
  @IsOptional()
  @IsEnum(SeasonStatus)
  status?: SeasonStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
