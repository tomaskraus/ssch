"use strict";

var assert = require('assert');
var SimpleScheduler = require('../src/scheduler/SimpleScheduler');

console.log(SimpleScheduler);

describe('Scheduler', function () {
    describe('#getTasks()', function () {
        it('should return empty array for an empty scheduler', function () {
            let sch = new SimpleScheduler();
            assert.deepEqual(sch.getTasks(), []);
        });
    });
});