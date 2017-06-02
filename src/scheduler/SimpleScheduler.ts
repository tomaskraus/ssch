import { TaskInterface } from "./../task/TaskInterface";

export class SimpleScheduler {
    constructor() {
    }

    getTasks(): Array<TaskInterface> {
        return [];
    }

    addTask(task: TaskInterface) {
        let t: TaskInterface = task;
    }
}

//new SimpleScheduler().addTask({timestamp: 1, id: "abc"});
