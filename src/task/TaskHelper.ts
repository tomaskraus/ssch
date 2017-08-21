import * as Task from "./../task/Task";
/**
 * task data manipulation helper
 *
 * @export
 * @class TaskHelper
 */
export class TaskHelper {

    static create(taskType: Task.TaskType, data: Object, executionTimestamp: Task.TimestampType, timeCreated: Task.TimestampType): Task.TaskInterface {
        return {
            meta: {
                taskType: taskType,
                executionTimestamp: executionTimestamp,
                timeCreated: timeCreated,
            },
            data: data,
            runtime: {}
        }
    }

}
