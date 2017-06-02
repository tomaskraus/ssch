import { StorageInterface } from "./StorageInterface";
import { TaskInterface } from "./../task/TaskInterface";
import { TaskInfoInterface } from "./../task/TaskInfoInterface";

export class SimpleStorage implements StorageInterface {
    tasks: Array<TaskInterface>;
    idCounter: number;
    internalTimestamp: number;

    constructor() {
        this.tasks = [];
        this.idCounter = 0;
        this.internalTimestamp = 0;
    }

    getAllTasks() : Array<TaskInterface> {
        return this.tasks;
    }

    getTaskById(taskId: string): TaskInterface {
        for (var item of this.tasks) {
            if (item.info.id === taskId) {
                return item;
            }
        }
        throw new Error(`task with id [${taskId}] not found`);
    }

    addTask(task: TaskInterface) : string {

        let info: TaskInfoInterface = {
            id: (this.idCounter++).toString(),
            timestampCreated: this.internalTimestamp,
            numberCalls: 0
        }

        task.info = info;
        this.tasks.push(task);
        return info.id;
    }

    deleteTask(taskId: string) : StorageInterface {
        return this;
    }


    getTaskIdsByTimeExecuteRange(minTimestamp: number, maxTimestamp?: number): Array<string> {
        throw new Error("Method not implemented.");
    }
}
