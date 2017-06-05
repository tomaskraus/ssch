import { StorageInterface } from "./StorageInterface";
import * as Task from "./../task/Task";



export class SimpleStorage implements StorageInterface {
    tasks: Map<string, Task.TaskInterface>;
    idCounter: number;
    internalTimestamp: number;

    constructor() {
        this.tasks = new Map<string, Task.TaskInterface>();
        this.idCounter = 0;
        this.internalTimestamp = 0;
    }

    getTaskById(taskId: string): Task.TaskInterface {
        if (this.tasks.has(taskId)) {
            return this.tasks.get(taskId);
        }
        throw new Error(`task with id [${taskId}] not found`);
    }

    addTask(task: Task.TaskInterface) : string {
        let id = (this.idCounter++).toString();

        this.tasks.set(id, task);
        return id;
    }

    updateTask(taskId: string, task: Task.TaskInterface) : StorageInterface {
        let t = this.getTaskById(taskId);
        this.tasks.set(taskId, task);
        return this;
    }

    deleteTask(taskId: string) : StorageInterface {
        let t = this.getTaskById(taskId);
        this.tasks.delete(taskId);
        return this;
    }


    getTaskIdsByTimeExecuteRange(minExecutionTimestamp: number, maxExecutionTimestamp?: number) : Array<string> {
        throw new Error("Method not implemented.");
    }
}
