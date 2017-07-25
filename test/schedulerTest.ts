import 'mocha';
import { assert } from "chai";

import { StorageFixture, SchedulerFixture } from "./fixtures";



describe('Scheduler', function () {
    let schf: SchedulerFixture;
    let sf: StorageFixture;

    beforeEach(function () {
        console.log("bef.each called");
        return SchedulerFixture.getInstance()
            .then(schfi => {
                schf = schfi;
                sf = schfi.storageFixture;
                return schfi;
            })
    });


    afterEach(function () {
        if (sf) return sf.destroy();
    });

    describe('#getFutureTaskIds()', function () {
        it('should resolve to empty taskPair array on early start time and too short future', function () {
            return schf.shortScheduler.getFutureTaskPairs(0).then(pairs => { assert.deepEqual(pairs, []) });
        });

        it('should resolve to one taskPair on a sufficient start time and short future', function () {
            return schf.shortScheduler.getFutureTaskPairs(1).then(pairs => { assert.deepEqual(pairs, [{ execTimestamp: 10, taskId: sf.taskId1 }]) });
        });

        it('should resolve to one taskPair on on the edge start time', function () {
            return schf.shortScheduler.getFutureTaskPairs(10).then(pairs => { assert.deepEqual(pairs, [{ execTimestamp: 10, taskId: sf.taskId1 }]) });
        });

        it('should return other taskPair on a sufficient start time and short future', function () {
            return schf.shortScheduler.getFutureTaskPairs(11).then(pairs => { assert.deepEqual(pairs, [{ execTimestamp: 20, taskId: sf.taskId2 }]) });
        });

        it('should return more taskPairs on a sufficient start time and long future', function () {
            return schf.longScheduler.getFutureTaskPairs(0).then(pairs => {
                assert.deepEqual(pairs, [{ execTimestamp: 10, taskId: sf.taskId1 },
                { execTimestamp: 20, taskId: sf.taskId2 }])
            });
        });

        it('should return empty taskPair array on start time at the far future', function () {
            return schf.shortScheduler.getFutureTaskPairs(30).then(pairs => { assert.deepEqual(pairs, []) });
        });
    });
});
