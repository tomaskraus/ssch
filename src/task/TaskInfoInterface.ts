/**
 * task meta information (from engine, storage etc.)
 *
 * @export
 * @interface TaskInfoInterface
 */
export interface TaskInfoInterface {
    id: string; //unique id
    timestampCreated: number; //when the task was created
    numberCalls: number; //number of calls
}