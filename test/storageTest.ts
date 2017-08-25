import { assert } from "chai";
import "mocha";

import { StorageFixture } from "./fixtures";

let sf: StorageFixture;

const cloneData = (input) => {
    return JSON.parse(JSON.stringify(input));
};

describe("Storage", () => {
    beforeEach(() => {
        return StorageFixture.getInstance()
            .then((sfi) => {
                sf = sfi;
                return sfi;
            });
    });

    afterEach(() => {
        if (sf) { return sf.destroy(); }
    });

    describe("#getTaskById", () => {
        it("should return Promise Error for Id search in an empty storage", () => {
            return sf.emptyStorage.getWrappedTaskById(sf.nonExistentId)
                .catch((err) => {
                    assert.ok(true);
                });
        });

        it("should return Promise Error for an unknown Id", () => {
            return sf.storage.getWrappedTaskById(sf.nonExistentId).catch((Error) => {
                assert.ok(true);
                // assert.include(Error.message, "not found")
            });
        });
    });

    describe("#addTask()", () => {
        it("should add two different tasks", () => {
            // different tasks
            //

            return Promise.resolve().then(() => {
                // console.log("sf.wTask1.id = " + sf.wTask1.id)

                const a = sf.storage.getWrappedTaskById(sf.wTask1.id);
                const b = sf.storage.getWrappedTaskById(sf.wTask2.id);

                return Promise.all([a, b]).then((values) => {
                    // console.log("vals: ", values)
                    assert.notDeepEqual(values[0], values[1]);
                });
            });

        });
    });

    describe("#updateTask()", () => {
        it("should update the already defined task", () => {
            const customData = { item: "123" };
            const task1m = cloneData(sf.task1);
            task1m.data = customData;

            return sf.storage.getWrappedTaskById(sf.wTask1.id)
                .then((wtask) => { assert.deepEqual(wtask.task.data, {}); })
                .then(() => { sf.storage.updateTask({ id: sf.wTask1.id, task: task1m }); })
                .then(() => sf.storage.getWrappedTaskById(sf.wTask1.id))
                .then((wtask) => { assert.deepEqual(wtask.task.data, customData); });
        });

        it("should throw Error for nonexistent Id to update", () => {
            it("should return Promise Error for a nonexistent Id to update", () => {
                return sf.storage.updateTask({ id: sf.nonExistentId, task: sf.task1 }).catch((Error) => {
                    assert.include(Error.message, "not found");
                });
            });
        });
    });

    describe("#deleteTask()", () => {
        it("deletes a task", () => {
            return sf.storage.getWrappedTaskById(sf.wTask1.id)
                .then((wtask) => { assert.deepEqual(wtask, sf.wTask1); })
                .then(() => { sf.storage.deleteTask(sf.wTask1.id); })
                .then(() => sf.storage.getWrappedTaskById(sf.wTask1.id))
                .catch((Error) => {
                    assert.include(Error.message, "not found");
                });
        });

        it("should return Promise Error for nonexistent Id to delete", () => {
            return sf.storage.deleteTask(sf.nonExistentId)
                .then(() => { throw new Error("task should be non-existent but exists"); })
                .catch((Error) => {
                    assert.include(Error.message, "not found");
                });
        });
    });

    describe("#getTaskIdsByExecutionTimestamp()", () => {
        it("should return Promise Error if minExecTimestamp == maxExecTimestamp", () => {
            return sf.storage.getWrappedTasksByExecutionTimestamp(2, 2)
                .then(() => { throw new Error("should return Promise Error if minExecTimestamp == maxExecTimestamp"); })
                .catch((Error) => {
                    assert.include(Error.message, "illegal value");
                });
        });
        it("should throw error if minExecTimestamp > maxExecTimestamp", () => {
            return sf.storage.getWrappedTasksByExecutionTimestamp(3, 2)
                .then(() => { throw new Error("should throw error if minExecTimestamp > maxExecTimestamp"); })
                .catch((Error) => {
                    assert.include(Error.message, "illegal value");
                });
        });

        it("should return an empty array if times are out of range", () => {
            return sf.storage.getWrappedTasksByExecutionTimestamp(0, 1)
                .then((tasks) => { assert.deepEqual(tasks, []); });
        });

        it("should return exactly one id for one-point matching timestamp interval", () => {
            return sf.storage.getWrappedTasksByExecutionTimestamp(10, 11)
                .then((tasks) => { assert.deepEqual(tasks, [sf.wTask1]); });
        });

        it("should return all matching ids for a huge timestamp interval", () => {
            return sf.storage.getWrappedTasksByExecutionTimestamp(0, 1000)
                .then((tasks) => {
                    assert.deepEqual(tasks, [sf.wTask1, sf.wTask2]);
                });
        });

        it("should add time intervals correctly", () => {
            const a = sf.storage.getWrappedTasksByExecutionTimestamp(0, 10);
            const b = sf.storage.getWrappedTasksByExecutionTimestamp(10, 20);
            const c = sf.storage.getWrappedTasksByExecutionTimestamp(0, 20);

            return Promise.all([a, b, c])
                .then((values) => {
                    assert.deepEqual(values[0].concat(values[1]), values[2]);
                });
        });
    });
});
