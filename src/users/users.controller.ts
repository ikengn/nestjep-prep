import { Controller, Get, Patch, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';


@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    async getProfile(@Request() req) {
        return this.usersService.getById(req.user.sub);
    }

    @Patch('me')
    async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(req.user.sub, updateUserDto);
    }

    @Delete('me')
    async deleteProfile(@Request() req) {
        return this.usersService.delete(req.user.sub);
    }

    @Get(':id')
    async getUserById(@Request() req) {
        return this.usersService.getById(req.user.sub);
    }

    @Delete(':id')
    async deleteUserById(@Request() req) {
        return this.usersService.delete(req.user.sub);
    }
}
