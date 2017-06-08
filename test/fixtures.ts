import { StorageInterface } from '../src/storage/StorageInterface';
import { SimpleStorage } from '../src/storage/SimpleStorage';
import { TaskHelper } from '../src/task/TaskHelper';
import { TaskInterface } from '../src/task/Task';

import { Scheduler } from "../src/engine/Scheduler";


let getStorage = function (): StorageInterface {
    return new SimpleStorage();
}



class StorageFixture {
    storage: StorageInterface;
    emptyStorage: StorageInterface;
    task1: TaskInterface;
    task2: TaskInterface;
    taskId1: string;
    taskId2: string;
    nonExistentId: string;

    constructor() {
        this.storage = getStorage();
        this.emptyStorage = getStorage();

        this.task1 = TaskHelper.create("testTask", {}, 10, 0);
        this.task2 = TaskHelper.create("testTask", {}, 20, 0);
        this.taskId1 = this.storage.addTask(this.task1);
        this.taskId2 = this.storage.addTask(this.task2);
        this.nonExistentId = "nonExistentId";
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

