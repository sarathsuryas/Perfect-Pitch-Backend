import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
     // let's log errors into its own file
        new transports.File({
          filename: `logs/error.log`,
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
        }),
        // logging all level
        new transports.File({
          filename: `logs/combined.log`,
          format: format.combine(format.timestamp(), format.json()),
        }),
        // we also want to see logs in our console
        new transports.Console({
         format: format.combine(
           format.cli(),
           format.splat(),
           format.timestamp(),
           format.printf((info) => {
             return `${info.timestamp} ${info.level}: ${info.message}`;
           }),
          ), 
      }),
      ],
    }),
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  app.enableCors({
    origin: 'http://localhost:4200',    
    credentials:true   
  });                            
  // fjdsfjkdjfdfggdjkfvfjkdhbbjkbjkhjjfjj
  app.use(cookieParser())
  app.useGlobalFilters(new HttpExceptionFilter());
 
  await app.listen(port);
  Logger.log(`~ Application is running on: ${await app.getUrl()}`);
}
bootstrap();     
 




