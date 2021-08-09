import { MailerService } from "@nestjs-modules/mailer";
import { OnQueueActive, OnQueueCompleted, OnQueueError, OnQueueProgress, Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { mapSeries } from "p-iteration";
import { CreateUserBatchDto } from "src/create-user/dto/create-user-batch.dto";
import { CreateUserDto } from "src/create-user/dto/create-user.dto";

@Processor('mail-queue')
export class SendMailConsumer {
    constructor(
        private readonly mailerService: MailerService
    ) { }

    @Process('mail-job-batch')
    async mailJobBatch(job: Job<CreateUserBatchDto>) {
        const { data } = job;
        await mapSeries(data['data'], async user => {
            const { email, name } = user;

            await this.mailerService.sendMail({
                to: email,
                from: "Liam's Tech",
                subject: "Verify your email",
                text: `Hello ${name}, verify you email plis`
            });
        });
    }

    @Process('mail-job')
    async mailJob(job: Job<CreateUserDto>) {
        const { email, name } = job.data;

        await this.mailerService.sendMail({
            to: email,
            from: "Liam's Tech",
            subject: "Verify your email",
            text: `Hello ${name}, verify you email plis`
        });
    }

    @OnQueueCompleted()
    onCompleted(job: Job) {
        console.log('completed', job.name);
    }

    @OnQueueProgress()
    onProgress(job: Job) {
        console.log('progress', job.name);
    }

    @OnQueueActive()
    onActive(job: Job) {
        console.log('active', job.name);
    }

    @OnQueueError()
    onError(job: Job) {
        console.log('error', job.name);
    }
}