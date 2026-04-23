import { ApiPropertyOptional } from '@nestjs/swagger';
import { InventoryItemType } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class ListInventoryItemsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: InventoryItemType })
  @IsOptional()
  @IsEnum(InventoryItemType)
  itemType?: InventoryItemType;
}
