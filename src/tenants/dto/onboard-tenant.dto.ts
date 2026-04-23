import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class OnboardTenantDto {
  @ApiProperty({ example: 'Rutabena Farms' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'rutabena-farms' })
  @IsString()
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  legalName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty()
  @IsString()
  ownerFirstName: string;

  @ApiProperty()
  @IsString()
  ownerLastName: string;

  @ApiProperty()
  @IsEmail()
  ownerEmail: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  ownerPassword: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ownerPhone?: string;
}
