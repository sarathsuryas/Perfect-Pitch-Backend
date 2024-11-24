import { Module } from '@nestjs/common';
import { GenreController } from 'src/user/controllers/genre/genre.controller';
import { GenreRepository } from 'src/user/repositories/genre.repository';
import { GenreService } from 'src/user/services/genre/genre.service';

@Module({
  imports:[],
  controllers:[GenreController],
  providers:[GenreService,GenreRepository]
})
export class GenreModule {}
