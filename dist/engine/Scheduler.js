"use strict";
const TaskDispatcher_1 = require("./TaskDispatcher");
const debug_1 = require("debug");
const debug = debug_1.default('ssch:Scheduler');
const debugError = debug_1.default('ssch:Scheduler:Error');
class Scheduler {
    constructor(storage, timeFuturePeriod) {
        this.storage = storage;
        this.timeFuturePeriod = timeFuturePeriod;
        this.wantToCancelTasks = false;
        this.plannedTaskIds = [];
        debug("CREATED. timeFuturePeriod: [%d]", this.timeFuturePeriod);
    }
    getFutureTaskPairs(timestamp) {
        return this.storage.getTaskPairsByExecutionTimestamp(timestamp, timestamp + this.timeFuturePeriod);
    }
    doLoop(timestamp) {
        this.getFutureTaskPairs(timestamp)
            .then(scheduledTaskPairs => {
            for (let tsk of scheduledTaskPairs) {
                let timeToWait = tsk.execTimestamp - timestamp;
                if (!this.wantToCancelTasks) {
                    this.plannedTaskIds.push(setTimeout(() => { this.processTaskPair(tsk); }, timeToWait * 1000));
                }
                else
                    break;
            }
        });
    }
    cancelTasks() {
        debug("cancelTasks CALLED");
        this.wantToCancelTasks = true;
        for (let taskId of this.plannedTaskIds) {
            clearTimeout(taskId);
        }
    }
    processTaskPair(taskPair) {
        try {
            let taskP = this.storage.getTaskById(taskPair.taskId);
            taskP.then((task) => {
                debug("processing task id [%s] taskType [%s]", taskPair.taskId, task.taskType);
                return TaskDispatcher_1.taskDispatcher.dispatch(taskPair.taskId, task);
            })
                .then((result) => {
                debug(`task id [${taskPair.taskId}] done`);
            })
                .catch((errObj) => {
                debugError(`task id [${taskPair.taskId}] error: %o`, errObj);
            });
        }
        catch (err) {
            debugError("!! following error was not received in err object, was caught in an exception instead !!");
            debugError(err);
        }
    }
}
exports.Scheduler = Scheduler;
//# sourceMappingURL=Scheduler.js.map