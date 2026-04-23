import { ApiPropertyOptional } from '@nestjs/swagger';
import { TenantStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class TenantListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: TenantStatus })
  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;
}
