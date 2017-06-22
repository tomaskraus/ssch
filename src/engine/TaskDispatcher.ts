import { TaskInterface } from "../task/Task";

import Debug from 'debug';

// import Request from 'request';
var request = require('request');

const debug = Debug('ssch:TaskDispatcher');

class TaskDispatcher {

    dispatch(task: TaskInterface, done: any, err: any) {
        switch (task.taskType) {
            case "deleteTask":
                deleteTask(task, done, err);
                break;

            case "longTask":
                longTask(task, done, err);
                break;
            default:
                throw new Error(`unknown task type [${task.taskType}]`)
        }
    }


}



let taskDispatcher = new TaskDispatcher();
export { taskDispatcher };


//--------------------------------------------------------------------------------

let deleteTask0 = function(task: TaskInterface, done: any, err: any) {
    debug("task deleteTask called, data: %j", task.data);
    done();
}

let longTask0 = function(task: TaskInterface, done: any, err: any) {
    debug("task long called, data: %j", task.data);
    let a = 0;
    for (let i = 0; i < 1000000000; i++) {
        a++;
    }
    debug("task long completed, result: %d", a);
    done();
}

let longTask = function(task: TaskInterface, done: any, err: any) {
    debug("task long called, data: %j", task.data);

    request({ url: 'http://localhost:8080/github2/longservice/', json: true, timeout: 10000 }, function (error, response, body) {
        // console.log('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.

        //err("vse v haji...");

        if (error) {
            err(error);
        } else {
            debug("task long completed: %d", body && body.val);
            done();
        }
    });


}
