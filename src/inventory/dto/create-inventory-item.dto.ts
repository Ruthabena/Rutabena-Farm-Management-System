import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InventoryItemType, UnitOfMeasure } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateInventoryItemDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ enum: InventoryItemType })
  @IsEnum(InventoryItemType)
  itemType: InventoryItemType;

  @ApiProperty({ enum: UnitOfMeasure })
  @IsEnum(UnitOfMeasure)
  unit: UnitOfMeasure;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  quantityOnHand?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  reorderLevel?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  supplier?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
