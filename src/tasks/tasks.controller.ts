import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}
    
    @Post()
    async createTask(@Request() req, @Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.create(req.user.sub, createTaskDto);
    }

    @Patch(':id')
    async updateTask(@Request() req, @Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
        return this.tasksService.update(req.user.sub, id, updateTaskDto);
    }

    @Delete(':id')
    async deleteTask(@Request() req, @Param('id') id: string) {
        return this.tasksService.delete(req.user.sub, id);
    }

    @Get()
    async getTasks(@Request() req) {
        return this.tasksService.getAll(req.user.sub);
    }

    @Get('search')
    async searchTasks(@Request() req, @Query() query: QueryTasksDto) {
        return this.tasksService.search(req.user.sub, query);
    }

    @Get(':id')
    async getTaskById(@Request() req, @Param('id') id: string) {
        return this.tasksService.getById(req.user.sub, id);
    }
}
