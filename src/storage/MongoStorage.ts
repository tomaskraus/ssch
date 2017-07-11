import { StorageInterface, taskPairType } from "./StorageInterface";
import * as Task from "./../task/Task";
import { assert } from "chai";

import Debug from 'debug';
const debug = Debug('ssch:MongoStorage');

import * as Mongodb from "mongodb";



export class MongoStorage implements StorageInterface {


    // TODO: getNewInstance with a Promise returned

    private constructor(uri: string, options?: Mongodb.MongoClientOptions) {
        debug('CREATING from: [%s]', uri);
        Mongodb.MongoClient.connect(uri, options)
            .then((db) => {debug('success [%o]', db);})
            .catch((reason) => {debug('fail [%o]', reason);})
    }


    getTaskById(taskId: string): Promise<Task.TaskInterface> {
        throw new Error("Method not implemented.");
    }
    addTask(task: Task.TaskInterface): Promise<string> {
        throw new Error("Method not implemented.");
    }
    updateTask(taskId: string, task: Task.TaskInterface): Promise<StorageInterface> {
        throw new Error("Method not implemented.");
    }
    deleteTask(taskId: string): Promise<StorageInterface> {
        throw new Error("Method not implemented.");
    }
    getTaskPairsByExecutionTimestamp(minExecutionTimestamp: number, maxExecutionTimestamp: number): Promise<taskPairType[]> {
        throw new Error("Method not implemented.");
    }


}
