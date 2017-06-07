import { TaskInterface } from "../task/Task";
import { StorageInterface, taskPairType } from "../storage/StorageInterface";
import { taskDispatcher } from "./TaskDispatcher";

export class Scheduler {

    private scheduledTasks: taskPairType[];

    storage: StorageInterface;
    timeFuturePeriod: number; //how long (in seconds) to see to the future when looking for tasks

    taskIdsToExecute: taskPairType[];


    constructor(storage: StorageInterface, timeFuturePeriod: number) {
        this.storage = storage;
        this.timeFuturePeriod = timeFuturePeriod;
    }


    getFutureTaskPairs(timestamp: number): taskPairType[] {
        return this.storage.getTaskPairsByExecutionTimestamp(timestamp, timestamp + this.timeFuturePeriod);
    }


    doLoop(timestamp: number) {
        let scheduledTasks = this.getFutureTaskPairs(timestamp);

        for (let tsk of this.scheduledTasks) {
            let timeToWait = tsk[0] - timestamp;
            setTimeout(this.processTaskPair(tsk), timeToWait);
        }
    }


    processTaskPair(taskPair: taskPairType): void {
        try {
            let task: TaskInterface = this.storage.getTaskById(taskPair[1]);
            taskDispatcher.dispatch(task);

        } catch (err) {
            //TODO log
            throw (err);
        }
    }

}

