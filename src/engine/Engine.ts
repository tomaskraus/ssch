import { StorageInterface } from "../storage/StorageInterface";
import { SimpleStorage } from "../storage/SimpleStorage";
import { Scheduler } from "./Scheduler";
//import { StorageInterface } from "../storage/StorageInterface";

export class Engine {
    readonly loopInterval: number; //in seconds
    readonly storage: StorageInterface;
    readonly scheduler: Scheduler;

    private runnerId?: number;

    constructor(loopInterval: number) {
        this.loopInterval = loopInterval;
        this.storage = new SimpleStorage();
        this.scheduler = new Scheduler(this.storage, loopInterval);
    }

    run(initialTimestamp: number) {
        let timestamp: number = initialTimestamp;
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