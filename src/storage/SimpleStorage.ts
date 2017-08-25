import { assert } from "chai";
import * as Task from "./../task/Task";
import { StorageInterface } from "./StorageInterface";

import Debug from "debug";
const debug = Debug("ssch:SimpleStorage");

export class SimpleStorage implements StorageInterface {
    public static getNewInstance(storageName: string): Promise<SimpleStorage> {
        return Promise.resolve(new SimpleStorage(storageName));
    }

    public tasks: Map<string, Task.WrappedTaskInterface>;
    public idCounter: number;

    constructor(storageName: string) {
        this.tasks = new Map<string, Task.WrappedTaskInterface>();
        this.idCounter = 0;
    }

    public close(): Promise<void> {
        return Promise.resolve();
    }

    public getWrappedTaskById(taskId: Task.TaskIdType): Promise<Task.WrappedTaskInterface> {
        return new Promise((resolve, reject) => {
            const wTask = this.tasks.get(taskId);
            if (wTask == null) {
                reject(new Error(`task with id [${taskId}] not found`));
            } else {
                resolve(wTask);
            }
        });
    }

    public addTask(task: Task.TaskInterface): Promise<Task.WrappedTaskInterface> {
        return new Promise((resolve, reject) => {
            const id = (this.idCounter++).toString();

            const wtsk = { id, task };
            this.tasks.set(id, wtsk);
            resolve(wtsk);
            // if(false) {
            //     reject(new Error("false"))
            // }
        });
    }

    public updateTask(wTask: Task.WrappedTaskInterface): Promise<StorageInterface> {
        return this.getWrappedTaskById(wTask.id)
            .then((taskFound) => {
                this.tasks.set(wTask.id, wTask);
                return this;
            });
    }

    public deleteTask(taskId: Task.TaskIdType): Promise<StorageInterface> {
        return this.getWrappedTaskById(taskId)
            .then(() => {
                this.tasks.delete(taskId);
                return this;
            });
    }

    public getWrappedTasksByExecutionTimestamp(
        minExecutionTimestamp: Task.TimestampType, maxExecutionTimestamp: Task.TimestampType,
    ): Promise<Task.WrappedTaskInterface[]> {
        return new Promise((resolve, reject) => {
            try {
                assert.isBelow(minExecutionTimestamp, maxExecutionTimestamp, "illegal value");

                const wTasks: Task.WrappedTaskInterface[] = [];
                for (const item of this.tasks.entries()) {
                    if (item[1].task.meta.executionTimestamp >= minExecutionTimestamp
                        && item[1].task.meta.executionTimestamp < maxExecutionTimestamp) {
                        wTasks.push(item[1]);
                    }
                }
                // debug(ids)
                resolve(wTasks);
            } catch (Error) {
                reject(Error);
            }
        });
    }
}
