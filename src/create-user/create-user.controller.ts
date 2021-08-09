import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('create-user')
export class CreateUserController {
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return createUserDto;
    }
}
