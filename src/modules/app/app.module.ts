import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { AdminModule } from '../admin/admin.module';
import { RequestLoggerMiddleware } from 'src/global-middlewares/request-logger.middlware';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [UsersModule,AdminModule,ConfigModule.forRoot({
    load:[configuration]
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
    ScheduleModule.forRoot()
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
