import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InventoryTransactionType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateInventoryTransactionDto {
  @ApiProperty()
  @IsUUID()
  inventoryItemId: string;

  @ApiProperty({ enum: InventoryTransactionType })
  @IsEnum(InventoryTransactionType)
  transactionType: InventoryTransactionType;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  unitCost?: number;

  @ApiProperty()
  @IsDateString()
  transactionDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  expenseId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  activityId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
