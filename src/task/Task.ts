//import { TaskType } from "./TaskType";

//-----------------------------------------------------------------------------------------
// ADD NEW TASK TYPES HERE

/**
 * type of a task
 */
export type TaskType =
    "testTask"
    | "deleteTask"
    ;

//-----------------------------------------------------------------------------------------

/**
 * state of a task
 *
 * @enum {number}
 */
export enum TaskState { UNITIALIZED, SCHEDULED, IN_PROGRESS, ERROR, TERMINATED }

/**
 *
 *
 * @export
 * @interface TaskInterface
 */
export interface TaskInterface {
    taskType: TaskType; //type of a task
    executionTimestamp: number; //when to execute  the task (unix timestamp)
    data: any; //data
    info: TaskInfoInterface; //meta information from engine, storage etc.
}

/**
 * task meta information (from engine, storage etc.)
 *
 * @export
 * @interface TaskInfoInterface
 */
export interface TaskInfoInterface {
    state: TaskState;   //state of a task
    timeCreated: number; //when the task was created (unix timestamp)
    numberOfCalls: number; //the number task was called
}
