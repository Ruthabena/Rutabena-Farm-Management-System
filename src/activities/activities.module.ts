import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ACTIVITY_REPOSITORY } from './domain/activity-repository.interface';
import { ActivitiesController } from './activities.controller';
import { ActivitiesRepository } from './activities.repository';
import { ActivitiesService } from './activities.service';

@Module({
  imports: [PrismaModule],
  controllers: [ActivitiesController],
  providers: [
    ActivitiesService,
    { provide: ACTIVITY_REPOSITORY, useClass: ActivitiesRepository },
  ],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
