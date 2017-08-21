import { WrappedTaskInterface } from "../task/Task";

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
    dispatch(wTask: WrappedTaskInterface) {
        switch (wTask.task.meta.taskType) {
            case "deleteTask":
                return deleteTask(wTask);
            case "longTask":
                return longTask(wTask);
            default:
                return new Promise((resolve, reject) => {
                    reject(new Error(`unknown task type [${wTask.task.meta.taskType}] for task id [${wTask.id}]`))
                });
        }
    }


}



let taskDispatcher = new TaskDispatcher();
export { taskDispatcher };


//--------------------------------------------------------------------------------

let deleteTask = function(wTask: WrappedTaskInterface) {
    debug("task deleteTask called on task id [%s], data: %j", wTask.id, wTask.task.data);
    return Promise.resolve("success");
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


// TODO refactor
let longTask = function(wTask: WrappedTaskInterface) {
    debug("task long called, data: %j", wTask.task.data);
    return new Promise((resolve, reject) => {
        rp({ url: 'http://localhost:8080/github2/longservice/', json: true, timeout: 10000 })
            .then((body) => {
                debug("task long id [%s] completed: %d", wTask.id, body && body.val);
                resolve("success");
            })
            .catch((error) => {
                reject(error);
            });
    })
}
