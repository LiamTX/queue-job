import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateUserController } from './create-user/create-user.controller';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379
      }
    }),

    MailerModule.forRoot({
      transport: {
        host: process.env.MAILER_HOST,
        port: parseInt(process.env.MAILER_PORT),
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASS
        }
      }
    })
  ],
  controllers: [AppController, CreateUserController],
  providers: [AppService],
})
export class AppModule { }
