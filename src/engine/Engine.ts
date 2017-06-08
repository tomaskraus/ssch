import { StorageInterface } from "../storage/StorageInterface";
import { SimpleStorage } from "../storage/SimpleStorage";
import { Scheduler } from "./Scheduler";
import * as moment from "moment";


export class Engine {
    readonly loopInterval: number; //in seconds
    readonly storage: StorageInterface;
    readonly scheduler: Scheduler;

    private runnerId?: number;

    private currentTimestamp: number;


    constructor(loopInterval: number) {
        this.loopInterval = loopInterval;
        this.storage = new SimpleStorage();
        this.scheduler = new Scheduler(this.storage, loopInterval);
    }

    run(initialTimestamp: number) {
        this.currentTimestamp = initialTimestamp;

        let realTimeOffset: number = moment().unix();
        console.log(`realtime: ${realTimeOffset}`);

        this.runnerId = setInterval(() => {
            console.log("engine...");
            //this.scheduler.doLoop(timestamp)
        }, this.loopInterval  * 1000);
    }

    stop() {
        if (this.runnerId !== null) {
            clearInterval(this.runnerId);
        }
    }

}