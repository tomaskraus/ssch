import { TaskInterface, TaskInfoInterface, TaskType, TaskState } from "./../task/Task";

//export const MIN_TIMESTAMP: number = 0;
//export const MAX_TIMESTAMP: number = Number.MAX_VALUE;

/**
 * task tuple [execTimestamp, id]
 * where:
 *   <li> execTimeStamp is execution time of a task
 *   <li> id is task id in the store
 */
export type taskPairType = { execTimestamp: number, taskId: string };

/**
 * Storage of tasks
 *
 * @export
 * @interface StorageInterface
 */
export interface StorageInterface {


    /**
     *
     *
     * @param {string} taskId id of a task to search
     * @returns {TaskInterface} task with an id given
     *
     * @throws error if no task with that id is found
     *
     * @memberof StorageInterface
     */
    getTaskById(taskId: string): TaskInterface;


    /**
     * Adds a new task to the storage.
     *
     * @param {TaskType} taskType type of a task
     * @param {number} timeExecute when to execute this task
     * @param {*} data task custom data
     * @returns {string} id of the newly added task
     *
     * @memberof StorageInterface
     */
    addTask(task: TaskInterface): string;

    /**
     * Updates task in the storage.
     *
     * @param {string} taskId id of a task to update
     * @param {TaskInterface} task task that will replace the original one
     * @returns {StorageInterface} self
     *
     * @throws error if no task with that id is found
     *
     * @memberof StorageInterface
     */
    updateTask(taskId: string, task: TaskInterface): StorageInterface;

    /**
     * deletes a task from the storage.
     *
     * @param {string} taskId id of a task to delete
     * @returns {StorageInterface} self
     *
     * @throws error if no task with that id is found
     *
     * @memberof StorageInterface
     */
    deleteTask(taskId: string): StorageInterface;

    /**
     *
     *
     * @param {number} minExecutionTimestamp timestamp
     * @param {number} maxExecutionTimestamp timestamp
     * @returns {Array<[number, string]>} tuples [execTimestamp, id] with execution timestamps >= minExecutionTimestamp and < maxExecutionTimestamp
     *
     * @throws error if minExecutionTimestamp >= maxExecutionTimestamp
     *
     * @memberof StorageInterface
     */
    getTaskPairsByExecutionTimestamp(minExecutionTimestamp: number, maxExecutionTimestamp: number): taskPairType[];
}
