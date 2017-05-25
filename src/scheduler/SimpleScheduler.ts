import { Task } from "./../Task";

export class SimpleScheduler {
    constructor() {
    }

    getTasks(): Array<Task> {
        return [];
    }

    addTask(task: Task) {
        let t: Task = task;
    }
}

new SimpleScheduler().addTask({timestamp: 1, id: "abc"});
