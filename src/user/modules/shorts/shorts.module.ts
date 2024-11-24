import { Module } from '@nestjs/common';
import { ShortsController } from 'src/user/controllers/shorts/shorts.controller';
import { ShortsRepository } from 'src/user/repositories/shorts.repository';
import { ShortsService } from 'src/user/services/shorts/shorts.service';

@Module({
  imports:[],
  controllers:[ShortsController],
  providers:[ShortsService,ShortsRepository]
})
export class ShortsModule {}
