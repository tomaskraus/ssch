import { TaskInterface } from "../task/Task";
export declare class TaskDispatcher {
    /**
     *
     *
     * @param {string} taskId
     * @param {TaskInterface} task
     * @returns {Promise}
     * @memberof TaskDispatcher
     */
    dispatch(taskId: string, task: TaskInterface): Promise<{}>;
}
declare let taskDispatcher: TaskDispatcher;
export { taskDispatcher };
