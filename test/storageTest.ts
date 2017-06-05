import 'mocha';
import { assert } from "chai";

import * as StorageRequire from '../src/storage/SimpleStorage';
import { TaskHelper } from '../src/task/TaskHelper';
import { TaskInterface } from '../src/task/Task';

let stor: StorageRequire.SimpleStorage;
let task1, task2: TaskInterface;
let nonExistentId = "nonExistentId";

console.log(StorageRequire);


let cloneData = function (input) {
    return JSON.parse(JSON.stringify(input));
}


describe('Storage', function () {
    beforeEach(function () {
        stor = new StorageRequire.SimpleStorage();
        task1 = TaskHelper.create("testTask", {}, 10, 0);
        task2 = TaskHelper.create("testTask", {}, 20, 0);

    });

    describe('#getTaskById', function () {
        it('should throw Error for Id search in an empty storage', function () {
            assert.throw(() => {stor.getTaskById(nonExistentId)}, "not found");
        });

        it('should throw Error for Id search in an empty storage', function () {
            assert.throw(() => {stor.getTaskById(nonExistentId)}, "not found");
        });
    });

    describe('#addTask()', function () {
        it('should add two different tasks', function () {
            let taskId = stor.addTask(task1);
            //console.log(`taskId=${taskId}`);
            assert.deepEqual(stor.getTaskById(taskId), task1);
            let taskId2 = stor.addTask(task2);
            assert.deepEqual(stor.getTaskById(taskId2), task2);
            //different tasks
            assert.notDeepEqual(stor.getTaskById(taskId), stor.getTaskById(taskId2));
        });
    });

    describe('#updateTask()', function () {
        it('should update the already defined task', function () {
            let task1Id = stor.addTask(task1);
            assert.deepEqual(stor.getTaskById(task1Id).data, {});

            let customData = { item: "123" };
            let task1m = cloneData(task1);
            task1m.data = customData;

            stor.updateTask(task1Id, task1m);
            assert.deepEqual(stor.getTaskById(task1Id).data, customData);
        });

        it('should throw Error for nonexistent Id to update', function() {
            let taskId1 = stor.addTask(task1);
            assert.throw(() => {stor.getTaskById(nonExistentId)}, "not found");
        });
    });


    describe('#deleteTask()', function () {
        it('deletes a task', function() {
            let taskId1 = stor.addTask(task1);
            assert.deepEqual(stor.getTaskById(taskId1), task1);

            stor.deleteTask(taskId1);
            //no such id is present after deletion
            assert.throw(() => {stor.deleteTask(taskId1)}, "not found");
        });

        it('should throw Error for nonexistent Id to delete', function() {
            let taskId1 = stor.addTask(task1);
            assert.throw(() => {stor.deleteTask(nonExistentId)}, "not found");
        });
    });

});
