import { Scheduler } from "../src/engine/Scheduler";
import { StorageInterface } from "../src/storage/StorageInterface";
import { StorageFixture } from "./fixtures";

class SchedulerFixture {

        public static getInstance(): Promise<SchedulerFixture> {
            return StorageFixture.getInstance()
                .then((sfi) => {
                    // console.log('storageFixture in SchedulerFixture')
                    const schf = new SchedulerFixture(sfi);
                    return schf;
                });
        }

        public storageFixture: StorageFixture;
        public stor: StorageInterface;
        public shortScheduler: Scheduler;
        public longScheduler: Scheduler;

        constructor(sf: StorageFixture) {
            this.storageFixture = sf;
            this.stor = sf.storage;
            this.shortScheduler = new Scheduler(this.stor, 10);
            this.longScheduler = new Scheduler(this.stor, 100);
        }

    }

export { SchedulerFixture };
