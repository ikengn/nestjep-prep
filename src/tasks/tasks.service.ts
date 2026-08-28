import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { TaskStatus } from './entities/task.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
    ) {}

    async create(userId: string, createTaskDto: CreateTaskDto) {
        const task = this.tasksRepository.create({
            name: createTaskDto.name,
            description: createTaskDto.description ?? null,
            completionStatus: createTaskDto.status ?? TaskStatus.PENDING,
            userId: userId,
        });
        return this.tasksRepository.save(task);
    }

    async update(userId: string, taskId: string, updateTaskDto: UpdateTaskDto) {
        const task = await this.tasksRepository.findOne({
            where: { id: taskId, userId: userId },
        });
        if (!task) {
            throw new Error('Task not found');
        }
        if (updateTaskDto.name !== undefined) {
            task.name = updateTaskDto.name;
        }
        if (updateTaskDto.description !== undefined) {
            task.description = updateTaskDto.description;
        }
        if (updateTaskDto.status !== undefined) {
            task.completionStatus = updateTaskDto.status;
        }
        return this.tasksRepository.save(task);
    }

    async delete(userId: string, taskId: string) {
        const task = await this.tasksRepository.findOne({
            where: { id: taskId, userId: userId },
        });
        if (!task) {
            throw new Error('Task not found');
        }
        return this.tasksRepository.remove(task);
    }

    async getAll(userId: string) {
        return this.tasksRepository.find({ where: { userId } });
    }

    async getById(userId: string, taskId: string) {
        const task = await this.tasksRepository.findOne({
            where: { id: taskId, userId: userId },
        });
        if (!task) {
            throw new Error('Task not found');
        }
        return task;
    }

    async search(userId: string, queryTasksDto: QueryTasksDto) {
        const queryBuilder = this.tasksRepository.createQueryBuilder('task');
        queryBuilder.where('task.userId = :userId', { userId });
        if (queryTasksDto.name) {
            queryBuilder.andWhere('task.name LIKE :name', { name: `%${queryTasksDto.name}%` });
        }
        if (queryTasksDto.status) {
            queryBuilder.andWhere('task.completionStatus = :status', { status: queryTasksDto.status });
        }
        return queryBuilder.getMany();
    }
}
