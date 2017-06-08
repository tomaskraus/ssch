import { StorageInterface } from "../storage/StorageInterface";
import { SimpleStorage } from "../storage/SimpleStorage";
import { Scheduler } from "./Scheduler";
import * as moment from "moment";

let MAX_TIME_ERROR = 250; //in millis
let LOOP_CORRECTION = 0;

export class Engine {
    readonly loopInterval: number; //in seconds
    readonly storage: StorageInterface;
    readonly scheduler: Scheduler;

    private runnerId?: number;


    constructor(loopInterval: number) {
        this.loopInterval = loopInterval;
        this.storage = new SimpleStorage();
        this.scheduler = new Scheduler(this.storage, loopInterval);
        this.runnerId = null;

    }

    run(initialTimestamp: number) {
        let syntheticTime = initialTimestamp;

        let initialTimeMillis = moment().valueOf(); //in millis
        let totalLoopTime = 0;
        let timeDeviation = 0;

        this.runnerId = setInterval(() => {
            totalLoopTime += this.loopInterval;
            let currentMillis = moment().valueOf();
            timeDeviation = (currentMillis - initialTimeMillis) - (1000 * totalLoopTime);
            if (Math.abs(timeDeviation) > MAX_TIME_ERROR) {
                throw new Error(`time deviation too high [${timeDeviation}]`);
            }
            console.log(`  dev: ${timeDeviation}`);

            syntheticTime += this.loopInterval;
            this.loop(syntheticTime)
        }, this.loopInterval  * 1000 + LOOP_CORRECTION);
    }

    stop() {
        if (this.runnerId !== null) {
            clearInterval(this.runnerId);
        }
        //else throw new Error("null runner!");
    }


    loop(syntheticTimestamp) {
        console.log(`${syntheticTimestamp}: engine...`);
        //this.scheduler.doLoop(syntheticTimestamp);
    }
}