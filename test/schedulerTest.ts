import 'mocha';
import { assert } from "chai";

import { StorageFixture, SchedulerFixture } from "./fixtures";



describe('Scheduler', function () {
    let schf: SchedulerFixture;
    let sf: StorageFixture;

    beforeEach(function () {
        sf = new StorageFixture();
        schf = new SchedulerFixture(sf);
    });

    describe('#getFutureTaskIds()', function () {
        it('should return empty taskPair array on early start time and too short future', function () {
            assert.deepEqual(schf.shortScheduler.getFutureTaskPairs(0), []);
        });

        it('should return one taskPair on a sufficient start time and short future', function () {
            assert.deepEqual(schf.shortScheduler.getFutureTaskPairs(1), [{execTimestamp: 10, taskId: sf.taskId1}]);
        });

        it('should return one taskPair on on the edge start time', function () {
            assert.deepEqual(schf.shortScheduler.getFutureTaskPairs(10), [{execTimestamp: 10, taskId: sf.taskId1}]);
        });

        it('should return other taskPair on a sufficient start time and short future', function () {
            assert.deepEqual(schf.shortScheduler.getFutureTaskPairs(11), [{execTimestamp: 20, taskId: sf.taskId2}]);
        });

        it('should return more taskPairs on a sufficient start time and long future', function () {
            assert.deepEqual(schf.longScheduler.getFutureTaskPairs(0), [{execTimestamp: 10, taskId: sf.taskId1}, {execTimestamp: 20, taskId: sf.taskId2}]);
        });

        it('should return empty taskPair array on start time at the far future', function () {
            assert.deepEqual(schf.shortScheduler.getFutureTaskPairs(30), []);
        });
    });
});
