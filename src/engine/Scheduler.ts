import { TaskInterface, WrappedTaskInterface } from "../task/Task";
import { StorageInterface } from "../storage/StorageInterface";
import { taskDispatcher } from "./TaskDispatcher";

import Debug from 'debug';
const debug = Debug('ssch:Scheduler');
const debugError = Debug('ssch:Scheduler:Error');

export class Scheduler {

    private storage: StorageInterface;
    private timeFuturePeriod: number; //how long (in seconds) to see to the future when looking for tasks

    private wTasksToExecute: WrappedTaskInterface[];
    private wantToCancelTasks: boolean;
    private plannedTaskTimers: NodeJS.Timer[];

    constructor(storage: StorageInterface, timeFuturePeriod: number) {
        this.storage = storage;
        this.timeFuturePeriod = timeFuturePeriod;
        this.wantToCancelTasks = false;
        this.plannedTaskTimers = [];
        debug("CREATED. timeFuturePeriod: [%d]", this.timeFuturePeriod);
    }


    getFutureWTasks(timestamp: number): Promise<WrappedTaskInterface[]> {
        return this.storage.getWrappedTasksByExecutionTimestamp(timestamp, timestamp + this.timeFuturePeriod);
    }


    doLoop(timestamp: number) {
        this.getFutureWTasks(timestamp)
            .then(scheduledWTasks => {
                for (let tsk of scheduledWTasks) {
                    let timeToWait = tsk.task.meta.executionTimestamp - timestamp;
                    if (!this.wantToCancelTasks) {
                        this.plannedTaskTimers.push(
                            global.setTimeout(() => { this.processWTask(tsk); }, timeToWait * 1000)
                        );
                    } else break;
                }
            })
    }


    cancelTasks() {
        debug("cancelTasks CALLED");
        this.wantToCancelTasks = true;
        for (let taskTimer of this.plannedTaskTimers) {
            clearTimeout(taskTimer);
        }
    }


    protected processWTask(wTask: WrappedTaskInterface): Promise<any> {
        try {
            debug("processing task id [%s] taskType [%s]", wTask.id, wTask.task.meta.taskType);
            return taskDispatcher.dispatch(wTask)
                .then((result) => {
                    debug(`task id [${wTask.id}] done`);
                    return;
                })
                .catch((errObj) => {
                    debugError(`task id [${wTask.id}] error: %o`, errObj);
                    return;
                });
        } catch (err) {
            debugError("!! following error was not received in err object, was caught in an exception instead !!");
            debugError(err);
            return Promise.reject(err);
        }
    }

}

