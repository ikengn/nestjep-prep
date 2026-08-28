import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async getById(id?: string): Promise<User|null> {
        return this.usersRepository.findOne({ where: { id } })
    }

    async getByUsername(username: string): Promise<User|null> {
        return this.usersRepository.findOne({ where: { username } })
    }

    async create(createUserDto: CreateUserDto) {
        const user = this.usersRepository.create({
            username: createUserDto.username,
            email: createUserDto.email,
            password: createUserDto.hashedPassword,
        });
        return this.usersRepository.save(user);
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        if (updateUserDto.username) {
            user.username = updateUserDto.username;
        }
        if (updateUserDto.email) {
            user.email = updateUserDto.email;
        }
        if (updateUserDto.password) {
            user.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        return this.usersRepository.save(user);
    }

    async delete(id: string) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        return this.usersRepository.remove(user);
    }
}
