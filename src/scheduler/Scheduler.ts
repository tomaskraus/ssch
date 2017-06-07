import { TaskInterface } from "../task/Task";
import { StorageInterface, taskPairType } from "../storage/StorageInterface";

export class Scheduler {

    storage: StorageInterface;
    timeFuturePeriod: number; //how long (in seconds) to see to the future when looking for tasks

    taskIdsToExecute: taskPairType[];


    constructor(storage: StorageInterface, timeFuturePeriod: number) {
        this.storage = storage;
        this.timeFuturePeriod = timeFuturePeriod;
    }


    getFutureTaskPairs(timestamp): taskPairType[] {
        return this.storage.getTaskPairsByExecutionTimestamp(timestamp, timestamp + this.timeFuturePeriod);
    }


}

