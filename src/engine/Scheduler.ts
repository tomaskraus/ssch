import { TaskInterface } from "../task/Task";
import { StorageInterface, taskPairType } from "../storage/StorageInterface";
import { taskDispatcher } from "./TaskDispatcher";

import Debug from 'debug';
const debug = Debug('ssch:Scheduler');
const debugError = Debug('ssch:Scheduler:Error');

export class Scheduler {

    storage: StorageInterface;
    timeFuturePeriod: number; //how long (in seconds) to see to the future when looking for tasks

    taskIdsToExecute: taskPairType[];
    private wantToCancelTasks: boolean;
    private plannedTaskIds: number[];

    constructor(storage: StorageInterface, timeFuturePeriod: number) {
        this.storage = storage;
        this.timeFuturePeriod = timeFuturePeriod;
        this.wantToCancelTasks = false;
        this.plannedTaskIds = [];
        debug("CREATED. timeFuturePeriod: [%d]", this.timeFuturePeriod);
    }


    getFutureTaskPairs(timestamp: number): taskPairType[] {
        return this.storage.getTaskPairsByExecutionTimestamp(timestamp, timestamp + this.timeFuturePeriod);
    }


    doLoop(timestamp: number) {
        let scheduledTaskPairs = this.getFutureTaskPairs(timestamp);

        for (let tsk of scheduledTaskPairs) {
            let timeToWait = tsk.execTimestamp - timestamp;
            if (!this.wantToCancelTasks) {
                this.plannedTaskIds.push(
                    setTimeout(() => {this.processTaskPair(tsk);}, timeToWait * 1000)
                );
            } else break;
        }
    }


    cancelTasks() {
        debug("cancelTasks CALLED");
        this.wantToCancelTasks = true;
        for (let taskId of this.plannedTaskIds) {
            clearTimeout(taskId);
        }
    }


    processTaskPair(taskPair: taskPairType): void {
        try {
            let task: TaskInterface = this.storage.getTaskById(taskPair.taskId);
            debug("processing task id [%s] taskType [%s]", taskPair.taskId, task.taskType);
            taskDispatcher.dispatch(taskPair.taskId, task, this.createErrorHandler(taskPair.taskId), this.createDoneHandler(taskPair.taskId));
        } catch (err) {
            debugError("!! following error was not received in err object, was caught in an exception instead !!");
            debugError(err);
        }
    }

    createErrorHandler(taskId: string) {
        return function(errObj) {
            debugError(`task id [${taskId}] error: %o`, errObj);
        }
    }

    createDoneHandler(taskId: string) {
        return function() {
            debug(`task id [${taskId}] done`);
        }
    }

}

