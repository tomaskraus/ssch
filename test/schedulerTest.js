"use strict";

var assert = require('assert');
var SimpleSchedulerRequire = require('../build/scheduler/SimpleScheduler');

console.log(SimpleSchedulerRequire);

describe('Scheduler', function () {
    describe('#getTasks()', function () {
        it('should return empty array for an empty scheduler', function () {
            var sch = new SimpleSchedulerRequire.SimpleScheduler();
            assert.deepEqual(sch.getTasks(), []);
        });
    });
});