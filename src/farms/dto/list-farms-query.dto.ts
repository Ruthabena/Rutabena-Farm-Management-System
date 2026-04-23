import { ApiPropertyOptional } from '@nestjs/swagger';
import { FarmStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class ListFarmsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: FarmStatus })
  @IsOptional()
  @IsEnum(FarmStatus)
  status?: FarmStatus;
}
