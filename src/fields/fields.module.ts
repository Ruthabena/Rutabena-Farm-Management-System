import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FIELD_REPOSITORY } from './domain/field-repository.interface';
import { FieldsController } from './fields.controller';
import { FieldsRepository } from './fields.repository';
import { FieldsService } from './fields.service';

@Module({
  imports: [PrismaModule],
  controllers: [FieldsController],
  providers: [
    FieldsService,
    { provide: FIELD_REPOSITORY, useClass: FieldsRepository },
  ],
  exports: [FieldsService],
})
export class FieldsModule {}
