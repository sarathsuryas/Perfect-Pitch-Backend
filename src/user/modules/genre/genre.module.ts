import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { audioSchema } from 'src/user/schema/audio.schema';
import { genresSchema } from 'src/user/schema/genres.schema';
import { GenreController } from 'src/user/controllers/genre/genre.controller';
import { GenreRepository } from 'src/user/repositories/genre.repository';
import { GenreService } from 'src/user/services/genre/genre.service';

@Module({
  imports:[MongooseModule.forFeature([{name:'Audio',schema:audioSchema},{name:'Genre',schema:genresSchema}]),JwtModule],
  controllers:[GenreController],
  providers:[GenreService,GenreRepository]
}) 
export class GenreModule {}
