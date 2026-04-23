import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FARM_REPOSITORY } from './domain/farm-repository.interface';
import { FarmsController } from './farms.controller';
import { FarmsRepository } from './farms.repository';
import { FarmsService } from './farms.service';

@Module({
  imports: [PrismaModule],
  controllers: [FarmsController],
  providers: [
    FarmsService,
    { provide: FARM_REPOSITORY, useClass: FarmsRepository },
  ],
  exports: [FarmsService],
})
export class FarmsModule {}
