"use strict";
const Task = require("./../task/Task");
/**
 * task data manipulation helper
 *
 * @export
 * @class TaskHelper
 */
class TaskHelper {
    static create(taskType, data, executionTimestamp, timeCreated) {
        return {
            taskType: taskType,
            executionTimestamp: executionTimestamp,
            data: data,
            info: {
                numberOfCalls: 0,
                timeCreated: timeCreated,
                state: Task.TaskState.UNITIALIZED
            }
        };
    }
    static setState(task, state) {
        task.info.state = state;
        return task;
    }
    static setExecutionTimestamp(task, executionTimestamp) {
        task.executionTimestamp = executionTimestamp;
        return task;
    }
    static setData(task, data) {
        task.data = data;
        return task;
    }
}
exports.TaskHelper = TaskHelper;
//# sourceMappingURL=TaskHelper.js.map