import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { mapSeries } from "p-iteration";
import { CreateUserDto } from "src/create-user/dto/create-user.dto";
import { CreateUserBatchDto } from "src/create-user/dto/create-user-batch.dto";

@Injectable()
export class SendMailProducer {
    constructor(
        @InjectQueue('mail-queue') private queueMail: Queue,
    ) { }

    async sendMail(createUserDto: CreateUserDto) {
        await this.queueMail.add('mail-job', createUserDto);
    }

    async sendMailBatch(createUserDtos: CreateUserBatchDto) {
        await this.queueMail.add('mail-job-batch', createUserDtos);
    }
}