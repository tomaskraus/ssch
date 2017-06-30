import { StorageInterface, taskPairType } from "../storage/StorageInterface";
export declare class Scheduler {
    private storage;
    private timeFuturePeriod;
    private taskIdsToExecute;
    private wantToCancelTasks;
    private plannedTaskIds;
    constructor(storage: StorageInterface, timeFuturePeriod: number);
    getFutureTaskPairs(timestamp: number): Promise<taskPairType[]>;
    doLoop(timestamp: number): void;
    cancelTasks(): void;
    protected processTaskPair(taskPair: taskPairType): void;
}
