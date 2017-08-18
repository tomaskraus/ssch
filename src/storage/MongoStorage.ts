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

    static getNewInstance(uri: string, options?: Mongodb.MongoClientOptions, clearCollectionFlag?: boolean): Promise<MongoStorage> {
        let a = Mongodb.MongoClient.connect(uri, options)
            .then(db => {
                let newInstance = new MongoStorage(db);
                //debug('connection open: [%o]', db);
                return newInstance;
            });

        let b = a.then(stor => {
            //debug("set to collection: [%s]", COLLECTION_NAME);
            return stor.db.createCollection(COLLECTION_NAME)
        });

        let c = b.then(coll => {
            if (clearCollectionFlag) {
                return coll.remove({});
            }
            return coll;
        })

        return Promise.all([a, b, c]).then(values => {
            let store = values[0];
            store.collection = store.db.collection(COLLECTION_NAME);
            //debug("collection obj: [%o]", store.collection);
            return store;
        });
    };


    private constructor(db: Mongodb.Db) {
        this.db = db;
        debug('instance CREATED');
    }

    close(): Promise<void> {
        return this.db.close(true).then(() => { debug('connection CLOSED'); });
    }

    /**
     *
     *
     * @param {string} taskId 24bit hex string
     * @returns {Promise<Task.TaskInterface>}
     * @memberof MongoStorage
     */
    getTaskById(taskId: string): Promise<Task.TaskInterface> {
        try {
            return this.collection.findOne({ "_id": Mongodb.ObjectID.createFromHexString(taskId) })
                .then(record => {
                    debug("getTaskById record= ", record);
                    if (!record) {
                        throw new Error(`task with id [${taskId}] not found`);
                    }
                    return record.task;
                })
        } catch (err) {
            return Promise.reject(err); //just to promisify unpromisified createFromHexString illegal argument error
        }
    }

    /**
     *
     *
     * @param {Task.TaskInterface} task
     * @returns {Promise<string>} 24bit hex string
     * @memberof MongoStorage
     */
    addTask(task: Task.TaskInterface): Promise<string> {
        debug("addTask begin. task: [%o]", task);
        return this.collection.insertOne({ "task": task })
            .then(writeOpResult => {
                debug("addTask insertedId result: [%o]", writeOpResult.insertedId);
                return writeOpResult.insertedId.toHexString();
            });
    }

    /**
     *
     *
     * @param {string} taskId 24bit hex string
     * @param {Task.TaskInterface} task
     * @returns {Promise<StorageInterface>}
     * @memberof MongoStorage
     */
    updateTask(taskId: string, task: Task.TaskInterface): Promise<StorageInterface> {
        return this.collection.updateOne({ "_id": Mongodb.ObjectID.createFromHexString(taskId) }, {"task": task})
            .then(res => {
                debug("updateOne result= ", res);
                if (res.result.n == 0) {
                    throw new Error(`task with id [${taskId}] not found`);
                }
                return this;
            })
    }

    /**
     *
     *
     * @param {string} taskId 24bit hex string
     * @returns {Promise<StorageInterface>}
     * @memberof MongoStorage
     */
    deleteTask(taskId: string): Promise<StorageInterface> {
        return this.collection.deleteOne({ "_id": Mongodb.ObjectID.createFromHexString(taskId) })
            .then(res => {
                debug("delete result= ", res);
                if (res.result.n == 0) {
                    throw new Error(`task with id [${taskId}] not found`);
                }
                return this;
            })
    }

    getTaskPairsByExecutionTimestamp(minExecutionTimestamp: number, maxExecutionTimestamp: number): Promise<taskPairType[]> {
        if (minExecutionTimestamp >= maxExecutionTimestamp) {
            return Promise.reject(new Error("illegal value"));
        };

        let cursor = this.collection.find({
            $and: [
                { "task.executionTimestamp": { $gte: minExecutionTimestamp } },
                { "task.executionTimestamp": { $lt: maxExecutionTimestamp } }
            ]
        });
        return cursor.toArray()
            .then(docs => {
                debug("* * * * docs= ", docs);
                let taskPairTypes: taskPairType[] = [];
                for (let tsk of docs) {
                    taskPairTypes.push({ execTimestamp: tsk.task.executionTimestamp, taskId: tsk._id.toHexString() })
                }
                debug("**** taskPairTypes= ", taskPairTypes);
                return taskPairTypes;
            });
    }

}
