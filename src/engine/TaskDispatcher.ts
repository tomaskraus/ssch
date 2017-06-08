import { TaskInterface } from "../task/Task";

import Debug from 'debug';
const debug = Debug('ssch:TaskDispatcher');

class TaskDispatcher {

    dispatch(task: TaskInterface) {
        switch (task.taskType) {
            case "deleteTask":
                deleteTask(task);
                break;
            default:
                throw new Error(`unknown task type [${task.taskType}]`)
        }
    }


}



let taskDispatcher = new TaskDispatcher();
export { taskDispatcher };


//--------------------------------------------------------------------------------

let deleteTask = function(task: TaskInterface) {
    debug("task deleteTask called, data: %j", task.data);
}
