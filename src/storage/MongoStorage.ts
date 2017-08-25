import { assert } from "chai";
import * as Task from "./../task/Task";
import { StorageInterface } from "./StorageInterface";

import Debug from "debug";
const debug = Debug("ssch:MongoStorage");

import * as Mongodb from "mongodb";

const COLLECTION_NAME = "tasks";

export class MongoStorage implements StorageInterface {

    public static getNewInstance(
        uri: string,
        options?: Mongodb.MongoClientOptions,
        clearCollectionFlag?: boolean,
    ): Promise<MongoStorage> {
        const a = Mongodb.MongoClient.connect(uri, options)
            .then((db) => {
                const newInstance = new MongoStorage(db);
                // debug('connection open: [%o]', db)
                return newInstance;
            });

        const b = a.then((stor) => {
            // debug("set to collection: [%s]", COLLECTION_NAME)
            return stor.db.createCollection(COLLECTION_NAME);
        });

        const c = b.then((coll) => {
            if (clearCollectionFlag) {
                return coll.remove({});
            }
            return coll;
        });

        return Promise.all([a, b, c]).then((values) => {
            const store = values[0];
            store.collection = store.db.collection(COLLECTION_NAME);
            // debug("collection obj: [%o]", store.collection)
            return store;
        });
    }

    private db: Mongodb.Db;
    private collection: Mongodb.Collection;

    private constructor(db: Mongodb.Db) {
        this.db = db;
        debug("instance CREATED");
    }

    public close(): Promise<void> {
        return this.db.close(true).then(() => { debug("connection CLOSED");  });
    }

    /**
     *
     *
     * @param {Task.TaskIdType} taskId
     * @returns {Promise<Task.WrappedTaskInterface>}
     * @memberof MongoStorage
     */
    public getWrappedTaskById(taskId: Task.TaskIdType): Promise<Task.WrappedTaskInterface> {
        try {
            return this.collection.findOne({ _id: Mongodb.ObjectID.createFromHexString(taskId) })
                .then((record) => {
                    // debug("getWrappedTaskById record= ", record)
                    if (!record) {
                        throw new Error(`task with id [${taskId}] not found`);
                    }
                    debug("getWrappedTaskById returns= ", {id: record._id, task: record.task});
                    return {id: record._id.toHexString(), task: record.task};
                });
        } catch (err) {
            return Promise.reject(err);  // just to promisify unpromisified createFromHexString illegal argument error
        }
    }

    /**
     *
     *
     * @param {Task.TaskInterface} task
     * @returns {Promise<WrappedTaskInterface>}
     * @memberof MongoStorage
     */
    public addTask(task: Task.TaskInterface): Promise<Task.WrappedTaskInterface> {
        debug("addTask begin. task: [%o]", task);
        return this.collection.insertOne({ task })
            .then((writeOpResult) => {
                debug("addTask insertedId result: [%o]", writeOpResult.insertedId);
                return {id: writeOpResult.insertedId.toHexString(), task};
            });
    }

    /**
     *
     *
     * @param {Task.TaskInterface} task
     * @returns {Promise<StorageInterface>}
     * @memberof MongoStorage
     */
    public updateTask(wTask: Task.WrappedTaskInterface): Promise<StorageInterface> {
        return this.collection.updateOne({ _id: Mongodb.ObjectID.createFromHexString(wTask.id) }, {task: wTask.task})
            .then((res) => {
                debug("updateOne result= ", res);
                if (res.result.n === 0) {
                    throw new Error(`task with id [${wTask.id}] not found`);
                }
                return this;
            });
    }

    /**
     *
     *
     * @param {Task.TaskIdType} taskId 24bit hex string
     * @returns {Promise<StorageInterface>}
     * @memberof MongoStorage
     */
    public deleteTask(taskId: string): Promise<StorageInterface> {
        return this.collection.deleteOne({ _id: Mongodb.ObjectID.createFromHexString(taskId) })
            .then((res) => {
                debug("delete result= ", res.result);
                if (res.result.n === 0) {
                    throw new Error(`task with id [${taskId}] not found`);
                }
                return this;
            });
    }

    public getWrappedTasksByExecutionTimestamp(
        minExecutionTimestamp: Task.TimestampType,
        maxExecutionTimestamp: Task.TimestampType,
    ): Promise<Task.WrappedTaskInterface[]> {
        if (minExecutionTimestamp >= maxExecutionTimestamp) {
            return Promise.reject(new Error("illegal value"));
        }

        const cursor = this.collection.find({
            $and: [
                { "task.meta.executionTimestamp": { $gte: minExecutionTimestamp } },
                { "task.meta.executionTimestamp": { $lt: maxExecutionTimestamp } },
            ],
        });
        return cursor.toArray()
            .then((docs) => {
                // debug("* * * * docs= ", docs)
                const wTasks: Task.WrappedTaskInterface[] = [];
                for (const tsk of docs) {
                    wTasks.push({ id: tsk._id.toHexString(), task: tsk.task });
                }
                debug("**** getWrappedTasksByExecutionTimestamp wTasks= ", wTasks);
                return wTasks;
            });
    }

}
