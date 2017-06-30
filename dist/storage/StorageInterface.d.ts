import { TaskInterface } from "./../task/Task";
/**
 * task tuple [execTimestamp, id]
 * where:
 *   <li> execTimeStamp is execution time of a task
 *   <li> id is task id in the store
 */
export declare type taskPairType = {
    execTimestamp: number;
    taskId: string;
};
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
     * @returns {Promise<TaskInterface>} resolves with a task with an id given, rejects with an Error
     *
     * @memberof StorageInterface
     */
    getTaskById(taskId: string): Promise<TaskInterface>;
    /**
     * Adds a new task to the storage.
     *
     * @param {TaskInterface} task a task to add
     * @returns {Promise<string>} resolves with an id of the newly added task, rejects with an Error
     *
     * @memberof StorageInterface
     */
    addTask(task: TaskInterface): Promise<string>;
    /**
     * Updates task in the storage.
     *
     * @param {string} taskId id of a task to update
     * @param {TaskInterface} task task that will replace the original one
     * @returns {Promise<StorageInterface>} resolves with a self, rejects with an Error
     *
     * @throws error if no task with that id is found
     *
     * @memberof StorageInterface
     */
    updateTask(taskId: string, task: TaskInterface): Promise<StorageInterface>;
    /**
     * deletes a task from the storage.
     *
     * @param {string} taskId id of a task to delete
     * @returns {Promise<StorageInterface>} resolves with a self, rejects with an Error
     *
     * @throws error if no task with that id is found
     *
     * @memberof StorageInterface
     */
    deleteTask(taskId: string): Promise<StorageInterface>;
    /**
     *
     *
     * @param {number} minExecutionTimestamp timestamp
     * @param {number} maxExecutionTimestamp timestamp
     * @returns {Promise<taskPairType[]>} resolves with taskPairs with execution timestamps >= minExecutionTimestamp and < maxExecutionTimestamp, rejects with an Error
     *
     *
     * @memberof StorageInterface
     */
    getTaskPairsByExecutionTimestamp(minExecutionTimestamp: number, maxExecutionTimestamp: number): Promise<taskPairType[]>;
}
