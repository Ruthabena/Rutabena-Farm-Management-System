import { ApiPropertyOptional } from '@nestjs/swagger';
import { SeasonStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { DateRangeQueryDto } from '../../common/dto/date-range-query.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class ListSeasonsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  farmId?: string;

  @ApiPropertyOptional({ enum: SeasonStatus })
  @IsOptional()
  @IsEnum(SeasonStatus)
  status?: SeasonStatus;

  @ApiPropertyOptional()
  @IsOptional()
  startDate?: DateRangeQueryDto['startDate'];

  @ApiPropertyOptional()
  @IsOptional()
  endDate?: DateRangeQueryDto['endDate'];
}
