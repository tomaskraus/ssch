import { TaskInfoInterface } from "./TaskInfoInterface";

export interface TaskInterface {
    taskType: string; //type of a task
    timestampExecute: number; //when to execute
    info?: TaskInfoInterface; //meta information from engine, storage etc.
    data: any; //data
}