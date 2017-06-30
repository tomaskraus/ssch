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
        it('should return Promise Error for Id search in an empty storage', function () {
            return sf.emptyStorage.getTaskById(sf.nonExistentId).catch((Error) => {
                assert.include(Error.message, "not found");
            });
        });

        it('should return Promise Error for an unknown Id', function () {
            return sf.storage.getTaskById(sf.nonExistentId).catch((Error) => {
                assert.include(Error.message, "not found");
            });
        });
    });

    describe('#addTask()', function () {
        it('should add two different tasks', function () {
            //different tasks
            //
            let a = sf.storage.getTaskById(sf.taskId1);
            let b = sf.storage.getTaskById(sf.taskId2);
            return Promise.all([a, b]).then((values) => {
                //console.log("vals: ", values);
                assert.notDeepEqual(values[0], values[1]);
            })
        });
    });

    describe('#updateTask()', function () {
        it('should update the already defined task', function () {
            let customData = { item: "123" };
            let task1m = cloneData(sf.task1);
            TaskHelper.setData(task1m, customData);

            return sf.storage.getTaskById(sf.taskId1)
            .then((task) => { assert.deepEqual(task.data, {}); })
            .then(() => { sf.storage.updateTask(sf.taskId1, task1m); })
            .then(() => { return sf.storage.getTaskById(sf.taskId1); })
            .then((task) => {assert.deepEqual(task.data, customData);})
        });

        it('should throw Error for nonexistent Id to update', function () {
            it('should return Promise Error for a nonexistent Id to update', function () {
                return sf.storage.updateTask(sf.nonExistentId, sf.task1).catch((Error) => {
                    assert.include(Error.message, "not found");
                });
        });
        });
    });


    describe('#deleteTask()', function () {
        it('deletes a task', function () {
            return sf.storage.getTaskById(sf.taskId1)
            .then((task) => { assert.deepEqual(task, sf.task1); })
            .then(() => { sf.storage.deleteTask(sf.taskId1); })
            .then(() => { return sf.storage.getTaskById(sf.taskId1); })
            .catch((Error) => {
                assert.include(Error.message, "not found");
            });
        });

        it('should return Promise Error for nonexistent Id to delete', function () {
            return sf.storage.deleteTask(sf.nonExistentId)
            .then(() => { throw new Error("task should be non-existent but exists")})
            .catch((Error) => {
                assert.include(Error.message, "not found");
            });
        });
    });


    describe('#getTaskIdsByExecutionTimestamp()', function() {
        it("should return Promise Error if minExecTimestamp == maxExecTimestamp", function () {
           return sf.storage.getTaskPairsByExecutionTimestamp(2, 2)
           .then(() => { throw new Error("should return Promise Error if minExecTimestamp == maxExecTimestamp")})
            .catch((Error) => {
                assert.include(Error.message, "illegal value");
            });
        });
        it("should throw error if minExecTimestamp > maxExecTimestamp", function () {
            return sf.storage.getTaskPairsByExecutionTimestamp(3, 2)
           .then(() => { throw new Error("should throw error if minExecTimestamp > maxExecTimestamp")})
            .catch((Error) => {
                assert.include(Error.message, "illegal value");
            });
        });

        it("should return an empty array if times are out of range", function() {
            return sf.storage.getTaskPairsByExecutionTimestamp(0, 1)
            .then(tasks => { assert.deepEqual(tasks, []) });
        });

        it("should return exactly one id for one-point matching timestamp interval", function() {
            return sf.storage.getTaskPairsByExecutionTimestamp(10, 11)
            .then(tasks => { assert.deepEqual(tasks, [{execTimestamp: sf.task1.executionTimestamp, taskId: sf.taskId1}]) });
        });

        it("should return all matching ids for a huge timestamp interval", function() {
            return sf.storage.getTaskPairsByExecutionTimestamp(0, 1000)
            .then(tasks => { assert.deepEqual(tasks, [{execTimestamp: sf.task1.executionTimestamp, taskId: sf.taskId1},
                {execTimestamp: sf.task2.executionTimestamp, taskId: sf.taskId2}]) });
        });

        it("should add time intervals correctly", function() {
            let a = sf.storage.getTaskPairsByExecutionTimestamp(0, 10);
            let b = sf.storage.getTaskPairsByExecutionTimestamp(10, 20);
            let c = sf.storage.getTaskPairsByExecutionTimestamp(0, 20);

            return Promise.all([a, b, c])
            .then(values => {
                assert.deepEqual(values[0].concat(values[1]), values[2]);
            });
        });
    });
});
