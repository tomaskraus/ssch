import { TaskInterface } from "./../task/TaskInterface";

//export const MIN_TIMESTAMP: number = 0;
//export const MAX_TIMESTAMP: number = Number.MAX_VALUE;

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
     * @returns {Array<TaskInterface>} all tasks in the storage
     *
     * @memberof StorageInterface
     */
    getAllTasks() : Array<TaskInterface>;

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
    getTaskById(taskId: string) : TaskInterface;

    /**
     *
     *
     * @param {TaskInterface} task task to add
     * @returns {string} id of the newly added task
     *
     * @memberof StorageInterface
     */
    addTask(task: TaskInterface) : string;

    /**
     *
     *
     * @param {string} taskId
     * @returns {StorageInterface} self
     *
     * @throws error if no task with that id is found
     *
     * @memberof StorageInterface
     */
    deleteTask(taskId: string) : StorageInterface;

    /**
     *
     *
     * @param {number} minTimestamp
     * @param {number} [maxTimestamp]
     * @returns {Array<string>} task ids with execution timestamps >= minTimeStamp and < maxTimestamp
     *
     * @memberof StorageInterface
     */
    getTaskIdsByTimeExecuteRange(minTimestamp: number, maxTimestamp?: number) : Array<string>;
}