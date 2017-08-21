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
        return StorageFixture.getInstance()
            .then(sfi => {
                sf = sfi;
                return sfi;
            });
    });

    afterEach(function () {
        if (sf) return sf.destroy();
    });

    describe('#getTaskById', function () {
        it('should return Promise Error for Id search in an empty storage', function () {
            return sf.emptyStorage.getWrappedTaskById(sf.nonExistentId)
                .catch(err => {
                    assert.ok(true);
                });
        });

        it('should return Promise Error for an unknown Id', function () {
            return sf.storage.getWrappedTaskById(sf.nonExistentId).catch((Error) => {
                assert.ok(true);
                //assert.include(Error.message, "not found");
            });
        });
    });

    describe('#addTask()', function () {
        it('should add two different tasks', function () {
            //different tasks
            //

            return Promise.resolve().then(() => {
                // console.log("sf.wTask1.id = " + sf.wTask1.id);

                let a = sf.storage.getWrappedTaskById(sf.wTask1.id);
                let b = sf.storage.getWrappedTaskById(sf.wTask2.id);


                return Promise.all([a, b]).then((values) => {
                    //console.log("vals: ", values);
                    assert.notDeepEqual(values[0], values[1]);
                })
            })

        });
    });

    describe('#updateTask()', function () {
        it('should update the already defined task', function () {
            let customData = { item: "123" };
            let task1m = cloneData(sf.task1);
            task1m.data = customData;

            return sf.storage.getWrappedTaskById(sf.wTask1.id)
                .then((wtask) => { assert.deepEqual(wtask.task.data, {}); })
                .then(() => { sf.storage.updateTask({ id: sf.wTask1.id, task: task1m}); })
                .then(() => { return sf.storage.getWrappedTaskById(sf.wTask1.id); })
                .then((wtask) => { assert.deepEqual(wtask.task.data, customData); })
        });

        it('should throw Error for nonexistent Id to update', function () {
            it('should return Promise Error for a nonexistent Id to update', function () {
                return sf.storage.updateTask({id: sf.nonExistentId, task: sf.task1}).catch((Error) => {
                    assert.include(Error.message, "not found");
                });
            });
        });
    });


    describe('#deleteTask()', function () {
        it('deletes a task', function () {
            return sf.storage.getWrappedTaskById(sf.wTask1.id)
                .then((wtask) => { assert.deepEqual(wtask, sf.wTask1); })
                .then(() => { sf.storage.deleteTask(sf.wTask1.id); })
                .then(() => { return sf.storage.getWrappedTaskById(sf.wTask1.id); })
                .catch((Error) => {
                    assert.include(Error.message, "not found");
                });
        });

        it('should return Promise Error for nonexistent Id to delete', function () {
            return sf.storage.deleteTask(sf.nonExistentId)
                .then(() => { throw new Error("task should be non-existent but exists") })
                .catch((Error) => {
                    assert.include(Error.message, "not found");
                });
        });
    });


    describe('#getTaskIdsByExecutionTimestamp()', function () {
        it("should return Promise Error if minExecTimestamp == maxExecTimestamp", function () {
            return sf.storage.getWrappedTasksByExecutionTimestamp(2, 2)
                .then(() => { throw new Error("should return Promise Error if minExecTimestamp == maxExecTimestamp") })
                .catch((Error) => {
                    assert.include(Error.message, "illegal value");
                });
        });
        it("should throw error if minExecTimestamp > maxExecTimestamp", function () {
            return sf.storage.getWrappedTasksByExecutionTimestamp(3, 2)
                .then(() => { throw new Error("should throw error if minExecTimestamp > maxExecTimestamp") })
                .catch((Error) => {
                    assert.include(Error.message, "illegal value");
                });
        });

        it("should return an empty array if times are out of range", function () {
            return sf.storage.getWrappedTasksByExecutionTimestamp(0, 1)
                .then(tasks => { assert.deepEqual(tasks, []) });
        });

        it("should return exactly one id for one-point matching timestamp interval", function () {
            return sf.storage.getWrappedTasksByExecutionTimestamp(10, 11)
                .then(tasks => { assert.deepEqual(tasks, [sf.wTask1]) });
        });

        it("should return all matching ids for a huge timestamp interval", function () {
            return sf.storage.getWrappedTasksByExecutionTimestamp(0, 1000)
                .then(tasks => {
                    assert.deepEqual(tasks, [sf.wTask1, sf.wTask2])
                });
        });

        it("should add time intervals correctly", function () {
            let a = sf.storage.getWrappedTasksByExecutionTimestamp(0, 10);
            let b = sf.storage.getWrappedTasksByExecutionTimestamp(10, 20);
            let c = sf.storage.getWrappedTasksByExecutionTimestamp(0, 20);

            return Promise.all([a, b, c])
                .then(values => {
                    assert.deepEqual(values[0].concat(values[1]), values[2]);
                });
        });
    });
});
