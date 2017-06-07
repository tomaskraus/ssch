import { TaskInterface } from "../task/Task";

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

let deleteTask = function(task) {
    console.log("task deleteTask called");
}
