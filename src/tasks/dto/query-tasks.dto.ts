import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';
    

export class QueryTasksDto {
    @IsOptional()
    name?: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

}