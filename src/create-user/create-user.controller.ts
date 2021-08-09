import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Post, Body, InternalServerErrorException } from '@nestjs/common';
import { SendMailProducer } from 'src/jobs/sendMail.producer';
import { CreateUserBatchDto } from './dto/create-user-batch.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('create-user')
export class CreateUserController {
    constructor(
        private readonly mailerService: MailerService,
        private readonly sendMailProducer: SendMailProducer
    ) { }

    @Post('/batch')
    async createUserBatch(@Body() data: CreateUserBatchDto) {
        try {
            await this.sendMailProducer.sendMailBatch(data);
            return data;
        } catch (error) {
            console.log('error', error);
            throw new InternalServerErrorException(error.message);
        }
    }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        try {
            await this.sendMailProducer.sendMail(createUserDto);
            return createUserDto;
        } catch (error) {
            console.log('error', error);
            throw new InternalServerErrorException(error.message);
        }

    }
}
