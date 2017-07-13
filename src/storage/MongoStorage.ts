import { StorageInterface, taskPairType } from "./StorageInterface";
import * as Task from "./../task/Task";
import { assert } from "chai";

import Debug from 'debug';
const debug = Debug('ssch:MongoStorage');

import * as Mongodb from "mongodb";

const COLLECTION_NAME = "tasks";

export class MongoStorage implements StorageInterface {

    private db: Mongodb.Db;
    private collection: Mongodb.Collection;

    // TODO: getNewInstance with a Promise returned

    static getNewInstance(uri: string, options?: Mongodb.MongoClientOptions): Promise<MongoStorage> {
        let a = Mongodb.MongoClient.connect(uri, options)
            .then(db => {
                let newInstance = new MongoStorage(db);
                debug('connection open: [%o]', db);
                return Promise.resolve(newInstance);
            });

        let b = a.then(stor => {
            debug("set to collection: [%s]", COLLECTION_NAME);
            return stor.db.createCollection(COLLECTION_NAME)
        });

        return Promise.all([a, b]).then(values => {
            let store = values[0];
            store.collection = store.db.collection(COLLECTION_NAME);
            //debug("collection obj: [%o]", store.clt);
            return Promise.resolve(store);
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
        debug("addTask begin. task: [%o]", task);
        return this.collection.insertOne(task)
            .then(writeOpResult => {
                debug("addTask insertedId result: [%o]", writeOpResult.insertedId);
                return Promise.resolve(writeOpResult.insertedId.toHexString());
            });
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
