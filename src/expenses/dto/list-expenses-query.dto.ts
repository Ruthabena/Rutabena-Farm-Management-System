import { ApiPropertyOptional } from '@nestjs/swagger';
import { ExpenseCategory } from '@prisma/client';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class ListExpensesQueryDto extends PaginationQueryDto {
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

  @ApiPropertyOptional({ enum: ExpenseCategory })
  @IsOptional()
  @IsEnum(ExpenseCategory)
  category?: ExpenseCategory;

  @ApiPropertyOptional()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  endDate?: string;
}
