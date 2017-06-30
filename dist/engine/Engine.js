"use strict";
const Scheduler_1 = require("./Scheduler");
const debug_1 = require("debug");
const debug = debug_1.default('ssch:Engine');
const RealTimer = require("real-scheduler");
class Engine {
    /**
     * Creates an instance of Engine.
     * @param {StorageInterface} storage
     * @param {number} loopPeriod (in seconds)
     *
     * @memberof Engine
     */
    constructor(storage, loopPeriod) {
        this.storage = storage;
        this.loopPeriod = loopPeriod;
        this.scheduler = new Scheduler_1.Scheduler(this.storage, loopPeriod);
        this.realTimer = null;
        debug('CREATED. loopInterval: [%d]', loopPeriod);
    }
    run(initialTimestamp) {
        debug("call engine START");
        this.realTimer = new RealTimer((sch) => {
            debug("-");
            this.scheduler.doLoop(initialTimestamp + sch.getSyntheticTimeElapsed() / 1000);
        }, this.loopPeriod * 1000, {
            waitForTheFirstCall: false,
            onStop: (sch) => { this.scheduler.cancelTasks(); }
        });
    }
    stop() {
        if (this.realTimer != null) {
            this.realTimer.stop();
        }
    }
}
exports.Engine = Engine;
//# sourceMappingURL=Engine.js.map