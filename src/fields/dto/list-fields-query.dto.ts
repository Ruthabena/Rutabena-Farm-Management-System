import { ApiPropertyOptional } from '@nestjs/swagger';
import { FieldStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class ListFieldsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  farmId?: string;

  @ApiPropertyOptional({ enum: FieldStatus })
  @IsOptional()
  @IsEnum(FieldStatus)
  status?: FieldStatus;
}
