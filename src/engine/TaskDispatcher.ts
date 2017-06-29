import { TaskInterface } from "../task/Task";

import Debug from 'debug';

import * as rp from 'request-promise-native';

const debug = Debug('ssch:TaskDispatcher');

type ErrorHandlerType = (errObj: Error) => void;
type DoneHandlerType = () => void;


class TaskDispatcher {

    dispatch(taskId: string, task: TaskInterface, err: ErrorHandlerType, done: DoneHandlerType) {
        switch (task.taskType) {
            case "deleteTask":
                deleteTask(taskId, task, err, done);
                break;

            case "longTask":
                longTask(taskId, task, err, done);
                break;
            default:
                err(new Error(`unknown task type [${task.taskType}] for task id [${taskId}]`));
        }
    }


}



let taskDispatcher = new TaskDispatcher();
export { taskDispatcher };


//--------------------------------------------------------------------------------

let deleteTask = function(taskId: string, task: TaskInterface, err: ErrorHandlerType, done: DoneHandlerType) {
    debug("task deleteTask called on task id [%s], data: %j", taskId, task.data);
    done();
}

let longTask0 = function(taskId: string, task: TaskInterface, err: ErrorHandlerType, done: DoneHandlerType) {
    debug("task long called on task id [%s], data: %j", taskId, task.data);
    let a = 0;
    for (let i = 0; i < 1000000000; i++) {
        a++;
    }
    debug("task long completed, result: %d", a);
    done();
}

let longTask = function(taskId: string, task: TaskInterface, err: ErrorHandlerType, done: DoneHandlerType) {
    debug("task long called, data: %j", task.data);

    rp({ url: 'http://localhost:8080/github2/longservice/', json: true, timeout: 10000 })
        .then((body) => {
            debug("task long id [%s] completed: %d", taskId, body && body.val);
            done();
        })
        .catch((error) => {
            err(error);
        });


}
