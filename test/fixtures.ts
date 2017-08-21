import { StorageInterface } from '../src/storage/StorageInterface';
import { SimpleStorage } from '../src/storage/SimpleStorage';
import { MongoStorage } from '../src/storage/MongoStorage';
import { TaskHelper } from '../src/task/TaskHelper';
import { TaskInterface, WrappedTaskInterface } from '../src/task/Task';

import { Scheduler } from "../src/engine/Scheduler";

let isMongo: boolean = true;


let getStorage = function (storageName): Promise<StorageInterface> {
    if (isMongo === true) {
        return MongoStorage.getNewInstance(`mongodb://localhost:27017/${storageName}`, null, true)
    } else {
        return SimpleStorage.getNewInstance(storageName);
    }

}


class StorageFixture {
    storage: StorageInterface;
    emptyStorage: StorageInterface;
    task1: TaskInterface;
    task2: TaskInterface;
    // taskId1: string;
    // taskId2: string;

    wTask1: WrappedTaskInterface;
    wTask2: WrappedTaskInterface;

    nonExistentId: string;

    private constructor(storage, emptyStorage) {
        this.storage = storage;
        this.emptyStorage = emptyStorage;
        this.nonExistentId = "123412341234123412341234";
    }


    static getInstance(): Promise<StorageFixture> {
        let a = getStorage('testStorage');
        let b = getStorage('testStorageEmpty');
        let sfix: StorageFixture;

        return Promise.all([a, b])
            .then((values) => {
                sfix = new StorageFixture(values[0], values[1]);
                return sfix;
            }).then(() => {
                sfix.task1 = TaskHelper.create("testTask", {}, 10, 0);
                return sfix.storage.addTask(sfix.task1);
            }).then(wTask1 => {
                sfix.wTask1 = wTask1;
                // console.log("taskId1=" + sfix.taskId1);
                sfix.task2 = TaskHelper.create("testTask", {}, 20, 0);
                return sfix.storage.addTask(sfix.task2);
            }).then(wTask2 => {
                sfix.wTask2 = wTask2;
                // console.log("taskId2=" + sfix.taskId2);
                // console.log("hotovo...");
                return sfix;
            });
    }


    destroy(): Promise<void> {
        return this.storage.close()
            .then(() => {
                return this.emptyStorage.close();
            });
    }

}


class SchedulerFixture {
    storageFixture: StorageFixture;
    stor: StorageInterface;
    shortScheduler: Scheduler;
    longScheduler: Scheduler;

    constructor(sf: StorageFixture) {
        this.storageFixture = sf;
        this.stor = sf.storage;
        this.shortScheduler = new Scheduler(this.stor, 10);
        this.longScheduler = new Scheduler(this.stor, 100);
    }

    static getInstance(): Promise<SchedulerFixture> {
        return StorageFixture.getInstance()
            .then(sfi => {
                // console.log('storageFixture in SchedulerFixture');
                let schf = new SchedulerFixture(sfi);
                return schf;
            })
    }

}

export { StorageFixture, SchedulerFixture };

