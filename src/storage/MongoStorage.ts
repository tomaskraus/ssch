import { StorageInterface, taskPairType } from "./StorageInterface";
import * as Task from "./../task/Task";
import { assert } from "chai";

import Debug from 'debug';
const debug = Debug('ssch:MongoStorage');

import * as Mongodb from "mongodb";



export class MongoStorage implements StorageInterface {

    private db: Mongodb.Db;

    // TODO: getNewInstance with a Promise returned

    static getNewInstance(uri: string, options?: Mongodb.MongoClientOptions): Promise<MongoStorage> {
        return Mongodb.MongoClient.connect(uri, options)
            .then(db => {
                let newInstance = new MongoStorage(db);
                debug('connection open: [%o]', db);
                return Promise.resolve(newInstance);
            });
    };


    private constructor(db: Mongodb.Db) {
        this.db = db;
        debug('instance CREATED');
    }

    close(): Promise<void> {
        return this.db.close(true).then(() => { debug('connection CLOSED'); });
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
