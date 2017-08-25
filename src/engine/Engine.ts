import { SimpleStorage } from "../storage/SimpleStorage";
import { StorageInterface } from "../storage/StorageInterface";
import { Scheduler } from "./Scheduler";

import Debug from "debug";
const debug = Debug("ssch:Engine");

import * as RealTimer from "real-scheduler";

export class Engine {
    public readonly loopPeriod: number;  // in seconds
    public readonly storage: StorageInterface;
    public readonly scheduler: Scheduler;

    private realTimer: RealTimer | null;

    /**
     * Creates an instance of Engine.
     * @param {StorageInterface} storage
     * @param {number} loopPeriod (in seconds)
     *
     * @memberof Engine
     */
    constructor(storage: StorageInterface, loopPeriod: number) {
        this.storage = storage;
        this.loopPeriod = loopPeriod;

        this.scheduler = new Scheduler(this.storage, loopPeriod);
        this.realTimer = null;
        debug("CREATED. loopInterval: [%d]", loopPeriod);
    }

    public run(initialTimestamp: number) {
        debug("call engine START");
        this.realTimer = new RealTimer((sch) => {
             debug("-");
             this.scheduler.doLoop(initialTimestamp + sch.getSyntheticTimeElapsed() / 1000);
            },
            this.loopPeriod * 1000, {
                onStop: (sch) => { this.scheduler.cancelTasks(); },
                waitForTheFirstCall: false,
            },
        );
    }

    public stop() {
        debug("call engine STOP");
        if (this.realTimer != null) {
            this.realTimer.stop();
        }
    }

}
