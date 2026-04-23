import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExpenseCategory } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';

export class CreateExpenseDto {
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
  activityId?: string;

  @ApiProperty({ enum: ExpenseCategory })
  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsDateString()
  paymentDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vendor?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  receiptUrl?: string;
}
