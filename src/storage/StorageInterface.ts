import { TaskInterface, TaskType, TimestampType, TaskIdType, WrappedTaskInterface } from "./../task/Task";


/**
 * Storage of tasks
 *
 * @export
 * @interface StorageInterface
 */
export interface StorageInterface {

    /**
     * Adds a new task to the storage.
     *
     * @param {TaskInterface} task a task to add
     * @returns {Promise<WrappedTaskInterface>} resolves with a new WrappedTask with the id, rejects with an Error
     *
     * @memberof StorageInterface
     */
    addTask(task: TaskInterface): Promise<WrappedTaskInterface>;

    /**
     *
     *
     * @param {TaskIdType} taskId id of a task to search
     * @returns {Promise<WrappedTaskInterface>} resolves with a WrappedTask with an id given, rejects with an Error
     *
     * @memberof StorageInterface
     */
    getWrappedTaskById(taskId: TaskIdType): Promise<WrappedTaskInterface>;



    /**
     * Updates task in the storage.
     *
     * @param {WrappedTaskInterface} wTask task that will replace the original one
     * @returns {Promise<StorageInterface>} resolves with a self, rejects with an Error
     *
     * @throws error if no task with that id is found
     *
     * @memberof StorageInterface
     */
    updateTask(wTask: WrappedTaskInterface): Promise<StorageInterface>;

    /**
     * deletes a task from the storage.
     *
     * @param {TaskIdType} taskId id of a task to delete
     * @returns {Promise<StorageInterface>} resolves with a self, rejects with an Error
     *
     * @throws error if no task with that id is found
     *
     * @memberof StorageInterface
     */
    deleteTask(taskId: TaskIdType): Promise<StorageInterface>;

    /**
     *
     *
     * @param {TimestampType} minExecutionTimestamp timestamp
     * @param {TimestampType} maxExecutionTimestamp timestamp
     * @returns {Promise<WrappedTaskInterface[]>} resolves with wrappedTasks with execution timestamps >= minExecutionTimestamp and < maxExecutionTimestamp, rejects with an Error
     *
     *
     * @memberof StorageInterface
     */
    getWrappedTasksByExecutionTimestamp(minExecutionTimestamp: TimestampType, maxExecutionTimestamp: TimestampType): Promise<WrappedTaskInterface[]>;


    /**
     * deallocates possibly acquired resources
     * Should be idempotent, i.e. subsequent calls of close should be ok
     *
     * @returns {Promise<void>}
     * @memberof StorageInterface
     */
    close(): Promise<void>;

}
