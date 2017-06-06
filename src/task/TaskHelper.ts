import * as Task from "./../task/Task";
/**
 * task data manipulation helper
 *
 * @export
 * @class TaskHelper
 */
export class TaskHelper {

    static create(taskType: Task.TaskType, data: any, executionTimestamp: number, timeCreated: number): Task.TaskInterface {
        return {
            taskType: taskType,
            executionTimestamp: executionTimestamp,
            data: data,
            info: {
                numberOfCalls: 0,
                timeCreated: timeCreated,
                state: Task.TaskState.UNITIALIZED
            }
        }
    }

    static setState(task: Task.TaskInterface, state: Task.TaskState): Task.TaskInterface {
        task.info.state = state;
        return task;
    }

    static setExecutionTimestamp(task: Task.TaskInterface, executionTimestamp: number): Task.TaskInterface {
        task.executionTimestamp = executionTimestamp;
        return task;
    }

    static setData(task: Task.TaskInterface, data: any): Task.TaskInterface {
        task.data = data;
        return task;
    }
}
