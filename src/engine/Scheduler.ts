import { TaskInterface } from "../task/Task";
import { StorageInterface, taskPairType } from "../storage/StorageInterface";
import { taskDispatcher } from "./TaskDispatcher";

import Debug from 'debug';
const debug = Debug('ssch:Scheduler');

export class Scheduler {

    storage: StorageInterface;
    timeFuturePeriod: number; //how long (in seconds) to see to the future when looking for tasks

    taskIdsToExecute: taskPairType[];


    constructor(storage: StorageInterface, timeFuturePeriod: number) {
        this.storage = storage;
        this.timeFuturePeriod = timeFuturePeriod;
        debug("CREATED");
    }


    getFutureTaskPairs(timestamp: number): taskPairType[] {
        return this.storage.getTaskPairsByExecutionTimestamp(timestamp, timestamp + this.timeFuturePeriod);
    }


    doLoop(timestamp: number) {
        let scheduledTaskPairs = this.getFutureTaskPairs(timestamp);

        for (let tsk of scheduledTaskPairs) {
            let timeToWait = tsk[0] - timestamp;
            //console.log(`timetoWait set to [${timeToWait}] for task id [tsk[1]]`);
            setTimeout(() => {this.processTaskPair(tsk);}, timeToWait * 1000);
        }
    }


    processTaskPair(taskPair: taskPairType): void {
        try {
            let task: TaskInterface = this.storage.getTaskById(taskPair[1]);
            debug("processing task id [%s] taskType [%s]", taskPair[1], task.taskType);
            taskDispatcher.dispatch(task);

        } catch (err) {
            //TODO log
            throw (err);
        }
    }

}

