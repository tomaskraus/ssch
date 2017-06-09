import { StorageInterface } from "../storage/StorageInterface";
import { SimpleStorage } from "../storage/SimpleStorage";
import { Scheduler } from "./Scheduler";
import * as moment from "moment";

import Debug from 'debug';
const debug = Debug('ssch:Engine');

import { RealTimer } from "./RealTimer";

let MAX_TIME_ERROR = 75; //in millis

export class Engine {
    readonly loopPeriod: number; //in seconds
    readonly loopPeriodMillis: number; //in milliseconds
    readonly storage: StorageInterface;
    readonly scheduler: Scheduler;

    private timer: RealTimer | null;

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

        this.loopPeriodMillis = loopPeriod * 1000;
        this.scheduler = new Scheduler(this.storage, loopPeriod);
        this.timer = null;
        debug('CREATED. loopInterval: [%d]', loopPeriod);
    }

    run(initialTimestamp: number) {
        let syntheticTimestamp = initialTimestamp;

        debug("call engine START");
        //1st time
        this.scheduler.doLoop(syntheticTimestamp);

        this.timer = new RealTimer(this.loopPeriodMillis, MAX_TIME_ERROR);
        this.timer.run(() => {
            syntheticTimestamp += this.loopPeriod;
            this.scheduler.doLoop(syntheticTimestamp);
        });
    }

    stop() {
        if (this.timer != null) {
            this.timer.stop();
        }
        this.scheduler.cancelTasks();
    }


}