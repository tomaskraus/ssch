import * as Task from "./../task/Task";
/**
 * task data manipulation helper
 *
 * @export
 * @class TaskHelper
 */
export declare class TaskHelper {
    static create(taskType: Task.TaskType, data: any, executionTimestamp: number, timeCreated: number): Task.TaskInterface;
    static setState(task: Task.TaskInterface, state: Task.TaskState): Task.TaskInterface;
    static setExecutionTimestamp(task: Task.TaskInterface, executionTimestamp: number): Task.TaskInterface;
    static setData(task: Task.TaskInterface, data: any): Task.TaskInterface;
}
