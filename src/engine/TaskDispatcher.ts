import { TaskInterface } from "../task/Task";

import Debug from 'debug';

// import Request from 'request';
var request = require('request');

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

    request({ url: 'http://localhost:8080/github2/longservice/', json: true, timeout: 10000 }, function (error, response, body) {
        // console.log('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.

        //err("vse v haji...");

        if (error) {
            err(error);
        } else {
            debug("task long id [%s] completed: %d", taskId, body && body.val);
            done();
        }
    });


}
