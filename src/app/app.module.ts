import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { AdminModule } from '../admin/admin.module';
import { RequestLoggerMiddleware } from 'src/global-middlewares/request-logger.middlware';
import { ScheduleModule } from '@nestjs/schedule';
import { UserAuthModule } from 'src/user/modules/user-auth/user-auth.module';
import { UserModule } from 'src/user/modules/user/user.module';
import { AlbumModule } from 'src/user/modules/album/album.module';
import { AudioModule } from 'src/user/modules/audio/audio.module';
import { ChatModule } from 'src/user/modules/chat/chat.module';
import { CommentsModule } from 'src/user/modules/comments/comments.module';
import { GenreModule } from 'src/user/modules/genre/genre.module';
import { LiveStreamingModule } from 'src/user/modules/live-streaming/live-streaming.module';
import { MembershipModule } from 'src/user/modules/membership/membership.module';
import { PlaylistModule } from 'src/user/modules/playlist/playlist.module';
import { PresignedUrlModule } from 'src/user/modules/presigned-url/presigned-url.module';
import { RecommendedModule } from 'src/user/modules/recommended/recommended.module';
import { ShortsModule } from 'src/user/modules/shorts/shorts.module';
import { SingleModule } from 'src/user/modules/single/single.module';
import { VideoModule } from 'src/user/modules/video/video.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    UserAuthModule,
    UserModule,
    AlbumModule,
    AudioModule,
    ChatModule,
    CommentsModule,
    GenreModule,
    LiveStreamingModule,
    MembershipModule,
    PlaylistModule,
    PresignedUrlModule,
    RecommendedModule,
    ShortsModule,
    SingleModule,
    VideoModule,
    AdminModule,
    ConfigModule.forRoot({
    load:[configuration],
    isGlobal: true, // Ensures it’s available everywhere
    envFilePath: '.env', 
  }),MongooseModule.forRootAsync({
    imports:[ConfigModule],
    useFactory:async(configService:ConfigService)=> {
       const MONGODB_URI = configService.get<string>('database.connectionString')
       return {
        uri:MONGODB_URI
       }
    },
    inject: [ConfigService]}),
    MailerModule.forRoot({
      transport:{
        service:"gmail",
        auth:{
          user:configuration().userEmail,
          pass:configuration().emailPassword
        }
      }
    }),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), 
      exclude: ['/api*'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
