
//-----------------------------------------------------------------------------------------
// ADD NEW TASK TYPES HERE
/**
 * type of a task
 */
export type TaskType = string;

export type TimestampType = number;


//-----------------------------------------------------------------------------------------


/**
 *
 *
 * @export
 * @interface TaskInterface
 */
export interface TaskInterface {
    meta: TaskMetaInterface; //non-volatile meta information
    data: object; //data
    runtime: object; //volatile tast-processing info
}

/**
 * non-volatile task meta information
 *
 * @export
 * @interface TaskMetaInterface
 */
export interface TaskMetaInterface {
    taskType: TaskType; //type of a task
    executionTimestamp: TimestampType; //when to be executed (unix timestamp)
    timeCreated: TimestampType; //when the task was created (unix timestamp)
}
