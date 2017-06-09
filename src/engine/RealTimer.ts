import * as moment from "moment";

import Debug from 'debug';
const debug = Debug('ssch:RealTimer');

/**
 * Tries to repeat the handler at the realtime.
 * Makes time corrections on the next handler call.
 *
 * @class RealTimer
 */
export class RealTimer {

    readonly interval: number; //in millis
    readonly maxTimeDeviationAllowed: number;

    private runnerId: number | null;
    private initialTimeMillis: number;
    private syntheticTimeoutSum: number;
    private wantStop: boolean;

    /**
     * Creates an instance of RealTimer.
     * @param {number} interval   in millis
     * @param {number} maxTimeDeviationAllowed  /in millis
     *
     * @memberof RealTimer
     */
    constructor(interval: number, maxTimeDeviationAllowed: number) {
        this.interval = interval;
        this.maxTimeDeviationAllowed = maxTimeDeviationAllowed;
        this.runnerId = null;
        this.wantStop = false;
        debug("CREATED");
    }

    run(handler: () => void): void {
        this.initialTimeMillis = moment().valueOf(); //in millis
        this.syntheticTimeoutSum = 0;
        this.runInternal(handler, this.interval);
    }

    private runInternal (handler: () => void, timeout: number): any {
        this.runnerId = setTimeout(() => {
            handler();
            let timeElapsed = moment().valueOf() - this.initialTimeMillis;
            this.syntheticTimeoutSum += this.interval;
            let timeDeviation = timeElapsed - this.syntheticTimeoutSum;
            debug(" te: %d [%d]", timeElapsed, timeDeviation);

            //deviation acceptance check
            if (Math.abs(timeDeviation) > this.maxTimeDeviationAllowed) {
                throw new Error(`time deviation too high [${timeDeviation}], max absolute allowed [${this.maxTimeDeviationAllowed}]`);
            }

            if (!this.wantStop) {
                this.runnerId = this.runInternal(handler, timeout - (timeDeviation));
            }
        }, timeout);

    }

    stop() {
        this.wantStop = true;
        if (this.runnerId !== null) {
            clearTimeout(this.runnerId);
        }
    }
}
