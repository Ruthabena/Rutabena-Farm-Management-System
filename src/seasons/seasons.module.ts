import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SEASON_REPOSITORY } from './domain/season-repository.interface';
import { SeasonsController } from './seasons.controller';
import { SeasonsRepository } from './seasons.repository';
import { SeasonsService } from './seasons.service';

@Module({
  imports: [PrismaModule],
  controllers: [SeasonsController],
  providers: [
    SeasonsService,
    { provide: SEASON_REPOSITORY, useClass: SeasonsRepository },
  ],
  exports: [SeasonsService],
})
export class SeasonsModule {}
