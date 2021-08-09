import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MiddlewareBuilder } from '@nestjs/core';
import { Queue } from 'bull';
import { CreateUserController } from './create-user/create-user.controller';
import { SendMailConsumer } from './jobs/sendMail.consumer';
import { SendMailProducer } from './jobs/sendMail.producer';
import { createBullBoard } from 'bull-board';
import { BullAdapter } from 'bull-board/bullAdapter';

require('dotenv').config();

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379
      }
    }),
    BullModule.registerQueue({
      name: 'mail-queue'
    }),

    MailerModule.forRoot({
      transport: {
        host: process.env.MAILER_HOST,
        port: Number(process.env.MAILER_PORT),
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASS
        }
      }
    })
  ],
  controllers: [CreateUserController],
  providers: [SendMailProducer, SendMailConsumer],
})
export class AppModule {
  constructor(
    @InjectQueue('mail-queue') private queue: Queue
  ) { }

  configure(consumer: MiddlewareBuilder) {
    const { router } = createBullBoard([
      new BullAdapter(this.queue)
    ]);
    consumer.apply(router).forRoutes('/admin/queues');
  }
}
