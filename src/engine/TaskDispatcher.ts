import { TaskInterface } from "../task/Task";

import Debug from 'debug';

import * as rp from 'request-promise-native';

const debug = Debug('ssch:TaskDispatcher');



export class TaskDispatcher {

    /**
     *
     *
     * @param {string} taskId
     * @param {TaskInterface} task
     * @returns {Promise}
     * @memberof TaskDispatcher
     */
    dispatch(taskId: string, task: TaskInterface) {
        switch (task.taskType) {
            case "deleteTask":
                return deleteTask(taskId, task);
            case "longTask":
                return longTask(taskId, task);
            default:
                return new Promise((resolve, reject) => {
                    reject(new Error(`unknown task type [${task.taskType}] for task id [${taskId}]`))
                });
        }
    }


}



let taskDispatcher = new TaskDispatcher();
export { taskDispatcher };


//--------------------------------------------------------------------------------

let deleteTask = function(taskId: string, task: TaskInterface) {
    debug("task deleteTask called on task id [%s], data: %j", taskId, task.data);
    return new Promise((resolve, reject) => {
        resolve("success");
    });
}

// let longTask0 = function(taskId: string, task: TaskInterface, err: ErrorHandlerType, done: DoneHandlerType) {
//     debug("task long called on task id [%s], data: %j", taskId, task.data);
//     let a = 0;
//     for (let i = 0; i < 1000000000; i++) {
//         a++;
//     }
//     debug("task long completed, result: %d", a);
//     done();
// }

let longTask = function(taskId: string, task: TaskInterface) {
    debug("task long called, data: %j", task.data);
    return new Promise((resolve, reject) => {
        rp({ url: 'http://localhost:8080/github2/longservice/', json: true, timeout: 10000 })
            .then((body) => {
                debug("task long id [%s] completed: %d", taskId, body && body.val);
                resolve("success");
            })
            .catch((error) => {
                reject(error);
            });
    })


}
