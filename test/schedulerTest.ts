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
        it('should resolve to empty WrappedTask array on early start time and too short future', function () {
            return schf.shortScheduler.getFutureWTasks(0).then(wTasks => { assert.deepEqual(wTasks, []) });
        });

        it('should resolve to one WrappedTask on a sufficient start time and short future', function () {
            return schf.shortScheduler.getFutureWTasks(1).then(wTasks => { assert.deepEqual(wTasks, [sf.wTask1]) });
        });

        it('should resolve to one WrappedTask on on the edge start time', function () {
            return schf.shortScheduler.getFutureWTasks(10).then(wTasks => { assert.deepEqual(wTasks, [sf.wTask1]) });
        });

        it('should return other WrappedTask on a sufficient start time and short future', function () {
            return schf.shortScheduler.getFutureWTasks(11).then(wTasks => { assert.deepEqual(wTasks, [sf.wTask2]) });
        });

        it('should return more WrappedTasks on a sufficient start time and long future', function () {
            return schf.longScheduler.getFutureWTasks(0).then(wTasks => {
                assert.deepEqual(wTasks, [ sf.wTask1, sf.wTask2 ])
            });
        });

        it('should return empty WrappedTask array on start time at the far future', function () {
            return schf.shortScheduler.getFutureWTasks(30).then(wTasks => { assert.deepEqual(wTasks, []) });
        });
    });
});
