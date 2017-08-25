import { MongoStorage } from "../src/storage/MongoStorage";
import { SimpleStorage } from "../src/storage/SimpleStorage";
import { StorageInterface } from "../src/storage/StorageInterface";
import * as Task from "../src/task/Task";

const isMongo: boolean = true;

const getStorage = (storageName): Promise<StorageInterface> => {
    if (isMongo === true) {
        return MongoStorage.getNewInstance(`mongodb://localhost:27017/${storageName}`, null, true);
    } else {
        return SimpleStorage.getNewInstance(storageName);
    }

};

class StorageFixture {

    public static getInstance(): Promise<StorageFixture> {
        const a = getStorage("testStorage");
        const b = getStorage("testStorageEmpty");
        let sfix: StorageFixture;

        return Promise.all([a, b])
            .then((values) => {
                sfix = new StorageFixture(values[0], values[1]);
                return sfix;
            }).then(() => {
                sfix.task1 = Task.create("testTask", {}, 10, 0);
                return sfix.storage.addTask(sfix.task1);
            }).then((wTask1) => {
                sfix.wTask1 = wTask1;
                // console.log("taskId1=" + sfix.taskId1)
                sfix.task2 = Task.create("testTask", {}, 20, 0);
                return sfix.storage.addTask(sfix.task2);
            }).then((wTask2) => {
                sfix.wTask2 = wTask2;
                // console.log("taskId2=" + sfix.taskId2)
                // console.log("hotovo...")
                return sfix;
            });
    }

    public storage: StorageInterface;
    public emptyStorage: StorageInterface;
    public task1: Task.TaskInterface;
    public task2: Task.TaskInterface;
    // taskId1: string
    // taskId2: string

    public wTask1: Task.WrappedTaskInterface;
    public wTask2: Task.WrappedTaskInterface;

    public nonExistentId: string;

    private constructor(storage, emptyStorage) {
        this.storage = storage;
        this.emptyStorage = emptyStorage;
        this.nonExistentId = "123412341234123412341234";
    }

    public destroy(): Promise<void> {
        return this.storage.close()
            .then(() => {
                return this.emptyStorage.close();
            });
    }

}

export { StorageFixture };
