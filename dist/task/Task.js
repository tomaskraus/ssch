//import { TaskType } from "./TaskType";
"use strict";
//-----------------------------------------------------------------------------------------
/**
 * state of a task
 *
 * @enum {number}
 */
var TaskState;
(function (TaskState) {
    TaskState[TaskState["UNITIALIZED"] = 0] = "UNITIALIZED";
    TaskState[TaskState["SCHEDULED"] = 1] = "SCHEDULED";
    TaskState[TaskState["IN_PROGRESS"] = 2] = "IN_PROGRESS";
    TaskState[TaskState["ERROR"] = 3] = "ERROR";
    TaskState[TaskState["TERMINATED"] = 4] = "TERMINATED";
})(TaskState = exports.TaskState || (exports.TaskState = {}));
//# sourceMappingURL=Task.js.map