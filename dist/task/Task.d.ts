/**
 * type of a task
 */
export declare type TaskType = "testTask" | "deleteTask" | "longTask";
/**
 * state of a task
 *
 * @enum {number}
 */
export declare enum TaskState {
    UNITIALIZED = 0,
    SCHEDULED = 1,
    IN_PROGRESS = 2,
    ERROR = 3,
    TERMINATED = 4,
}
/**
 *
 *
 * @export
 * @interface TaskInterface
 */
export interface TaskInterface {
    taskType: TaskType;
    executionTimestamp: number;
    data: any;
    info: TaskInfoInterface;
}
/**
 * task meta information (from engine, storage etc.)
 *
 * @export
 * @interface TaskInfoInterface
 */
export interface TaskInfoInterface {
    state: TaskState;
    timeCreated: number;
    numberOfCalls: number;
}
