"use strict";
const chai_1 = require("chai");
class SimpleStorage {
    constructor() {
        this.tasks = new Map();
        this.idCounter = 0;
        this.internalTimestamp = 0;
    }
    getTaskById(taskId) {
        let task = this.tasks.get(taskId);
        return new Promise((resolve, reject) => {
            if (task == null) {
                reject(new Error(`task with id [${taskId}] not found`));
            }
            else {
                resolve(task);
            }
        });
    }
    addTask(task) {
        let id = (this.idCounter++).toString();
        this.tasks.set(id, task);
        return new Promise((resolve, reject) => {
            resolve(id);
            // if(false) {
            //     reject(new Error("false"));
            // }
        });
    }
    updateTask(taskId, task) {
        return this.getTaskById(taskId)
            .then((taskFound) => { this.tasks.set(taskId, task); return this; });
    }
    deleteTask(taskId) {
        return this.getTaskById(taskId)
            .then(() => {
            this.tasks.delete(taskId);
            return this;
        });
    }
    getTaskPairsByExecutionTimestamp(minExecutionTimestamp, maxExecutionTimestamp) {
        return new Promise((resolve, reject) => {
            try {
                chai_1.assert.isBelow(minExecutionTimestamp, maxExecutionTimestamp, "illegal value");
                let ids = [];
                for (var item of this.tasks.entries()) {
                    if (item[1].executionTimestamp >= minExecutionTimestamp
                        && item[1].executionTimestamp < maxExecutionTimestamp) {
                        ids.push({ execTimestamp: item[1].executionTimestamp, taskId: item[0] });
                    }
                }
                resolve(ids);
            }
            catch (Error) {
                reject(Error);
            }
        });
    }
}
exports.SimpleStorage = SimpleStorage;
//# sourceMappingURL=SimpleStorage.js.map