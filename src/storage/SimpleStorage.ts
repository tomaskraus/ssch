import { StorageInterface, taskPairType } from "./StorageInterface";
import * as Task from "./../task/Task";
import { assert } from "chai";


export class SimpleStorage implements StorageInterface {
    tasks: Map<string, Task.TaskInterface>;
    idCounter: number;

    constructor(storageName: string) {
        this.tasks = new Map<string, Task.TaskInterface>();
        this.idCounter = 0;
    }

    close(): Promise<void> {
        return Promise.resolve();
    }

    getTaskById(taskId: string): Promise<Task.TaskInterface> {
        return new Promise((resolve, reject) => {
            let task = this.tasks.get(taskId);
            if (task == null) {
                reject(new Error(`task with id [${taskId}] not found`));
            } else {
                resolve(task);
            }
        })
    }

    addTask(task: Task.TaskInterface): Promise<string> {
        return new Promise((resolve, reject) => {
            let id = (this.idCounter++).toString();
            this.tasks.set(id, task);
            resolve(id);
            // if(false) {
            //     reject(new Error("false"));
            // }
        });
    }

    updateTask(taskId: string, task: Task.TaskInterface): Promise<StorageInterface> {
        return this.getTaskById(taskId)
            .then((taskFound) => { this.tasks.set(taskId, task); return this; })
    }

    deleteTask(taskId: string): Promise<StorageInterface> {
        return this.getTaskById(taskId)
            .then(() => {
                this.tasks.delete(taskId);
                return this;
            });
    }


    getTaskPairsByExecutionTimestamp(minExecutionTimestamp: number, maxExecutionTimestamp: number): Promise<taskPairType[]> {
        return new Promise((resolve, reject) => {
            try {
                assert.isBelow(minExecutionTimestamp, maxExecutionTimestamp, "illegal value");

                let ids: taskPairType[] = [];
                for (var item of this.tasks.entries()) {
                    if (item[1].executionTimestamp >= minExecutionTimestamp
                        && item[1].executionTimestamp < maxExecutionTimestamp) {
                        ids.push({ execTimestamp: item[1].executionTimestamp, taskId: item[0] });
                    }
                }
                resolve(ids);
            } catch (Error) {
                reject(Error)
            }
        });
    }
}
