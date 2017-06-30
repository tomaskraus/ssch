import { TaskInterface } from "../task/Task";
import { StorageInterface, taskPairType } from "../storage/StorageInterface";
import { taskDispatcher } from "./TaskDispatcher";

import Debug from 'debug';
const debug = Debug('ssch:Scheduler');
const debugError = Debug('ssch:Scheduler:Error');

export class Scheduler {

    private storage: StorageInterface;
    private timeFuturePeriod: number; //how long (in seconds) to see to the future when looking for tasks

    private taskIdsToExecute: taskPairType[];
    private wantToCancelTasks: boolean;
    private plannedTaskIds: number[];

    constructor(storage: StorageInterface, timeFuturePeriod: number) {
        this.storage = storage;
        this.timeFuturePeriod = timeFuturePeriod;
        this.wantToCancelTasks = false;
        this.plannedTaskIds = [];
        debug("CREATED. timeFuturePeriod: [%d]", this.timeFuturePeriod);
    }


    getFutureTaskPairs(timestamp: number): Promise<taskPairType[]> {
        return this.storage.getTaskPairsByExecutionTimestamp(timestamp, timestamp + this.timeFuturePeriod);
    }


    doLoop(timestamp: number) {
        this.getFutureTaskPairs(timestamp)
        .then(scheduledTaskPairs => {
            for (let tsk of scheduledTaskPairs) {
                let timeToWait = tsk.execTimestamp - timestamp;
                if (!this.wantToCancelTasks) {
                    this.plannedTaskIds.push(
                        setTimeout(() => {this.processTaskPair(tsk);}, timeToWait * 1000)
                    );
                } else break;
            }
        })
    }


    cancelTasks() {
        debug("cancelTasks CALLED");
        this.wantToCancelTasks = true;
        for (let taskId of this.plannedTaskIds) {
            clearTimeout(taskId);
        }
    }


    protected processTaskPair(taskPair: taskPairType): void {
        try {
            let taskP: Promise<TaskInterface> = this.storage.getTaskById(taskPair.taskId);
            taskP.then((task) => {
                debug("processing task id [%s] taskType [%s]", taskPair.taskId, task.taskType);
                return taskDispatcher.dispatch(taskPair.taskId, task);
            })
            .then((result) => {
                debug(`task id [${taskPair.taskId}] done`);
            })
            .catch((errObj) => {
                debugError(`task id [${taskPair.taskId}] error: %o`, errObj);
            });
        } catch (err) {
            debugError("!! following error was not received in err object, was caught in an exception instead !!");
            debugError(err);
        }
    }

}

