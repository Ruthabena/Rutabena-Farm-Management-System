import { PartialType } from '@nestjs/swagger';
import { CreateYieldRecordDto } from './create-yield-record.dto';

export class UpdateYieldRecordDto extends PartialType(CreateYieldRecordDto) {}
