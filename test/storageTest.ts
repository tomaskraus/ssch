import 'mocha';
import { assert } from "chai";

import { StorageFixture } from "./fixtures";
import { TaskHelper } from '../src/task/TaskHelper';

let sf: StorageFixture;


let cloneData = function (input) {
    return JSON.parse(JSON.stringify(input));
}


describe('Storage', function () {
    beforeEach(function () {
        sf = new StorageFixture;
    });

    describe('#getTaskById', function () {
        it('should throw Error for Id search in an empty storage', function () {
            assert.throw(() => { sf.emptyStorage.getTaskById(sf.nonExistentId) }, "not found");
        });

        it('should throw Error for an unknown Id', function () {
            assert.throw(() => { sf.storage.getTaskById(sf.nonExistentId) }, "not found");
        });
    });

    describe('#addTask()', function () {
        it('should add two different tasks', function () {
            assert.deepEqual(sf.storage.getTaskById(sf.taskId1), sf.task1);
            assert.deepEqual(sf.storage.getTaskById(sf.taskId2), sf.task2);
            //different tasks
            assert.notDeepEqual(sf.storage.getTaskById(sf.taskId1), sf.storage.getTaskById(sf.taskId2));
        });
    });

    describe('#updateTask()', function () {
        it('should update the already defined task', function () {
            assert.deepEqual(sf.storage.getTaskById(sf.taskId1).data, {});

            let customData = { item: "123" };
            let task1m = cloneData(sf.task1);
            TaskHelper.setData(task1m, customData);

            sf.storage.updateTask(sf.taskId1, task1m);
            assert.deepEqual(sf.storage.getTaskById(sf.taskId1).data, customData);
        });

        it('should throw Error for nonexistent Id to update', function () {
            assert.throw(() => { sf.storage.getTaskById(sf.nonExistentId) }, "not found");
        });
    });


    describe('#deleteTask()', function () {
        it('deletes a task', function () {
            assert.deepEqual(sf.storage.getTaskById(sf.taskId1), sf.task1);
            sf.storage.deleteTask(sf.taskId1);
            //no such id is present after deletion
            assert.throw(() => { sf.storage.deleteTask(sf.taskId1) }, "not found");
        });

        it('should throw Error for nonexistent Id to delete', function () {
            assert.throw(() => { sf.storage.deleteTask(sf.nonExistentId) }, "not found");
        });
    });


    describe('#getTaskIdsByExecutionTimestamp()', function() {
        it("should throw error if minExecTimestamp == maxExecTimestamp", function () {
            assert.throw(() => { sf.storage.getTaskPairsByExecutionTimestamp(2, 2) }, "illegal value");
        });
        it("should throw error if minExecTimestamp > maxExecTimestamp", function () {
            assert.throw(() => { sf.storage.getTaskPairsByExecutionTimestamp(3, 2) }, "illegal value");
        });

        it("should return an empty array if times are out of range", function() {
            assert.deepEqual(sf.storage.getTaskPairsByExecutionTimestamp(0, 1), []);
        });

        it("should return exactly one id for one-point matching timestamp interval", function() {
            assert.deepEqual(sf.storage.getTaskPairsByExecutionTimestamp(10, 11), [{execTimestamp: sf.task1.executionTimestamp, taskId: sf.taskId1}]);
        });

        it("should return all matching ids for a huge timestamp interval", function() {
            assert.deepEqual(sf.storage.getTaskPairsByExecutionTimestamp(0, 1000),
            [{execTimestamp: sf.task1.executionTimestamp, taskId: sf.taskId1}, {execTimestamp: sf.task2.executionTimestamp, taskId: sf.taskId2}]);
        });

        it("should add time intervals correctly", function() {
            assert.deepEqual(
                sf.storage.getTaskPairsByExecutionTimestamp(0, 10).concat(sf.storage.getTaskPairsByExecutionTimestamp(10, 20)),
                sf.storage.getTaskPairsByExecutionTimestamp(0, 20)
            );
        });
    });
});
