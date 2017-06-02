"use strict";

var assert = require('assert');
var StorageRequire = require('../build/storage/SimpleStorage');
var stor;
var currentId = 0;

var createTask = function (taskType, data) {
    return {
        taskType: taskType,
        timestampExecute: 10,
        data: data || {}
    };
};

console.log(StorageRequire);

describe('Storage', function () {
    beforeEach(function () {
        stor = new StorageRequire.SimpleStorage();
    });


    describe('#getAllTasks()', function () {
        it('should return empty array for an empty Storage', function () {
            assert.deepEqual(stor.getAllTasks(), []);
        });
    });

    describe('#addTask()', function () {
        it('should add one task', function () {
            stor.addTask(createTask("id1"));
            console.log(stor.getAllTasks().keys());
            assert.equal(stor.getAllTasks().length, 1);
            stor.addTask(createTask("id2"));
            assert.equal(stor.getAllTasks().length, 2);
        });

        it('should update the already defined task', function () {
            assert.deepEqual(stor.getAllTasks(), []);
            stor.addTask(createTask("id1"));
            assert.equal(stor.getAllTasks().length, 1);
            assert.deepEqual(stor.getTaskById("id1").data, {});

            var customData = {item: "123"};

            stor.addTask(createTask("id1", customData));
            assert.equal(stor.getAllTasks().length, 1);
            assert.equal(stor.getTaskById("id1").data, customData);
        });
    });

    // describe('#addTask()', function () {
    //     it('should add one task', function () {
    //         stor.addTask(createTask("id1"));
    //         assert.equal(stor.getAllTasks().length, 1);
    //         stor.addTask(createTask("id2"));
    //         assert.equal(stor.getAllTasks().length, 2);
    //     });
    // });
});