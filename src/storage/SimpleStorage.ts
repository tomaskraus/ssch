import { StorageInterface, taskPairType } from "./StorageInterface";
import * as Task from "./../task/Task";
import { assert } from "chai";


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

    addTask(task: Task.TaskInterface): string {
        let id = (this.idCounter++).toString();

        this.tasks.set(id, task);
        return id;
    }

    updateTask(taskId: string, task: Task.TaskInterface): StorageInterface {
        let t = this.getTaskById(taskId);
        this.tasks.set(taskId, task);
        return this;
    }

    deleteTask(taskId: string): StorageInterface {
        let t = this.getTaskById(taskId);
        this.tasks.delete(taskId);
        return this;
    }


    getTaskIdsByExecutionTimestamp(minExecutionTimestamp: number, maxExecutionTimestamp: number) : taskPairType[] {
        assert.isBelow(minExecutionTimestamp, maxExecutionTimestamp, "illegal value");

        let ids = [];
        for (var item of this.tasks.entries()) {
            if (item[1].executionTimestamp >= minExecutionTimestamp
                && item[1].executionTimestamp < maxExecutionTimestamp) {
                ids.push([item[1].executionTimestamp, item[0]]);
            }
        }
        return ids;
    }
}
