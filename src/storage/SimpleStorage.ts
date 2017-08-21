import { StorageInterface } from "./StorageInterface";
import * as Task from "./../task/Task";
import { assert } from "chai";

import Debug from 'debug';
const debug = Debug('ssch:SimpleStorage');


export class SimpleStorage implements StorageInterface {
    tasks: Map<string, Task.WrappedTaskInterface>;
    idCounter: number;

    static getNewInstance(storageName: string): Promise<SimpleStorage> {
        return Promise.resolve(new SimpleStorage(storageName));
    }

    constructor(storageName: string) {
        this.tasks = new Map<string, Task.WrappedTaskInterface>();
        this.idCounter = 0;
    }

    close(): Promise<void> {
        return Promise.resolve();
    }

    getWrappedTaskById(taskId: Task.TaskIdType): Promise<Task.WrappedTaskInterface> {
        return new Promise((resolve, reject) => {
            let wTask = this.tasks.get(taskId);
            if (wTask == null) {
                reject(new Error(`task with id [${taskId}] not found`));
            } else {
                resolve(wTask);
            }
        })
    }

    addTask(task: Task.TaskInterface): Promise<Task.WrappedTaskInterface> {
        return new Promise((resolve, reject) => {
            let id = (this.idCounter++).toString();

            let wtsk = { "id": id, "task": task };
            this.tasks.set(id, wtsk);
            resolve(wtsk);
            // if(false) {
            //     reject(new Error("false"));
            // }
        });
    }

    updateTask(wTask: Task.WrappedTaskInterface): Promise<StorageInterface> {
        return this.getWrappedTaskById(wTask.id)
            .then(taskFound => {
                this.tasks.set(wTask.id, wTask);
                return this;
            })
    }

    deleteTask(taskId: Task.TaskIdType): Promise<StorageInterface> {
        return this.getWrappedTaskById(taskId)
            .then(() => {
                this.tasks.delete(taskId);
                return this;
            });
    }


    getWrappedTasksByExecutionTimestamp(minExecutionTimestamp: Task.TimestampType, maxExecutionTimestamp: Task.TimestampType): Promise<Task.WrappedTaskInterface[]> {
        return new Promise((resolve, reject) => {
            try {
                assert.isBelow(minExecutionTimestamp, maxExecutionTimestamp, "illegal value");

                let wTasks: Task.WrappedTaskInterface[] = [];
                for (var item of this.tasks.entries()) {
                    if (item[1].task.meta.executionTimestamp >= minExecutionTimestamp
                        && item[1].task.meta.executionTimestamp < maxExecutionTimestamp) {
                        wTasks.push(item[1]);
                    }
                }
                //debug(ids);
                resolve(wTasks);
            } catch (Error) {
                reject(Error)
            }
        });
    }
}
