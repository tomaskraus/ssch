import { StorageInterface } from '../src/storage/StorageInterface';
import { SimpleStorage } from '../src/storage/SimpleStorage';
import { TaskHelper } from '../src/task/TaskHelper';
import { TaskInterface } from '../src/task/Task';

import { Scheduler } from "../src/engine/Scheduler";


let getStorage = function (storageName): Promise<StorageInterface> {
    return new Promise((resolve, reject) => {
        let storage = new SimpleStorage(storageName);
        resolve(storage);
    });
}



class StorageFixture {
    storage: StorageInterface;
    emptyStorage: StorageInterface;
    task1: TaskInterface;
    task2: TaskInterface;
    taskId1: string;
    taskId2: string;
    nonExistentId: string;

    private constructor(storage, emptyStorage) {
        this.storage = storage;
        this.emptyStorage = emptyStorage;

        this.task1 = TaskHelper.create("testTask", {}, 10, 0);
        this.task2 = TaskHelper.create("testTask", {}, 20, 0);
        this.storage.addTask(this.task1).then(id => { this.taskId1 = id });
        this.storage.addTask(this.task2).then(id => { this.taskId2 = id });
        this.nonExistentId = "nonExistentId";
    }


    static getInstance(): Promise<StorageFixture> {
        return new Promise((resolve, reject) => {
            let a = getStorage('testStorage');
            let b = getStorage('testStorageEmpty');
            let c = Promise.all([a, b]).then((values) => {
                let sf: StorageFixture = new StorageFixture(values[0], values[1]);
                resolve(sf);
            });
        });
    }


    static destroyInstance(): Promise<void> {
        return new Promise((resolve, reject) => { resolve(); });
    }

}


class SchedulerFixture {
    stor: StorageInterface;
    shortScheduler: Scheduler;
    longScheduler: Scheduler;

    constructor(sf: StorageFixture) {
        this.stor = sf.storage;
        this.shortScheduler = new Scheduler(this.stor, 10);
        this.longScheduler = new Scheduler(this.stor, 100);
    }

}

export { StorageFixture, SchedulerFixture };

