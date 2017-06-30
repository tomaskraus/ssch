import { StorageInterface, taskPairType } from "./StorageInterface";
import * as Task from "./../task/Task";
export declare class SimpleStorage implements StorageInterface {
    tasks: Map<string, Task.TaskInterface>;
    idCounter: number;
    internalTimestamp: number;
    constructor();
    getTaskById(taskId: string): Promise<Task.TaskInterface>;
    addTask(task: Task.TaskInterface): Promise<string>;
    updateTask(taskId: string, task: Task.TaskInterface): Promise<StorageInterface>;
    deleteTask(taskId: string): Promise<StorageInterface>;
    getTaskPairsByExecutionTimestamp(minExecutionTimestamp: number, maxExecutionTimestamp: number): Promise<taskPairType[]>;
}
