import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CROP_REPOSITORY } from './domain/crop-repository.interface';
import { CropsController } from './crops.controller';
import { CropsRepository } from './crops.repository';
import { CropsService } from './crops.service';

@Module({
  imports: [PrismaModule],
  controllers: [CropsController],
  providers: [
    CropsService,
    { provide: CROP_REPOSITORY, useClass: CropsRepository },
  ],
  exports: [CropsService],
})
export class CropsModule {}
