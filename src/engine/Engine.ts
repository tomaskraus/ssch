import { StorageInterface } from "../storage/StorageInterface";
import { SimpleStorage } from "../storage/SimpleStorage";
import { Scheduler } from "./Scheduler";
import * as moment from "moment";

import Debug from 'debug';
const debug = Debug('ssch:Engine');

import * as RealTimer from 'real-scheduler';


export class Engine {
    readonly loopPeriod: number; //in seconds
    readonly storage: StorageInterface;
    readonly scheduler: Scheduler;

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
        debug('CREATED. loopInterval: [%d]', loopPeriod);
    }

    run(initialTimestamp: number) {
        debug("call engine START");
        this.realTimer = new RealTimer((sch) => {
             this.scheduler.doLoop(initialTimestamp + sch.getSyntheticTimeElapsed()/1000)
            },
            this.loopPeriod * 1000, {
                waitForTheFirstCall: false,
                onStop: (sch) => { this.scheduler.cancelTasks(); } }
        );
    }

    stop() {
        if (this.realTimer != null) {
            this.realTimer.stop();
        }
    }


}