import { StorageInterface } from "../storage/StorageInterface";
import { Scheduler } from "./Scheduler";
export declare class Engine {
    readonly loopPeriod: number;
    readonly storage: StorageInterface;
    readonly scheduler: Scheduler;
    private realTimer;
    /**
     * Creates an instance of Engine.
     * @param {StorageInterface} storage
     * @param {number} loopPeriod (in seconds)
     *
     * @memberof Engine
     */
    constructor(storage: StorageInterface, loopPeriod: number);
    run(initialTimestamp: number): void;
    stop(): void;
}
