
import * as moment from "moment";
import { Engine } from "./engine/Engine";
// import {SimpleStorage} from "./storage/SimpleStorage"
import { MongoStorage } from "./storage/MongoStorage";
import { StorageInterface } from "./storage/StorageInterface";
import * as Task from "./task/Task";

import Debug from "debug";
const debug = Debug("ssch:testapp");

debug("start testapp");

let eng: Engine;
let storage: StorageInterface;

const engineLoopInterval = 3;  // in seconds
const totalRunningTime = 20;  // in seconds

// SimpleStorage.getNewInstance('storageName')
MongoStorage.getNewInstance("mongodb://localhost:27017/ssch-testapp", null, true)
    .then((stor) => {
        storage = stor;
        eng = new Engine(storage, engineLoopInterval);
        startApp();
    })
    .catch((err) => {
        debug("Application error. Stack trace: [%s]", err.stack);
        stopApp();
    });

function stopApp() {
    debug("call stopApp");
    if (eng) {
        eng.stop();
    }
    if (storage) {
        storage.close();
    }
}

function startApp() {
    storage.addTask(Task.create("deleteTask", { a: "1st" }, 1, 0));
    storage.addTask(Task.create("deleteTask", {}, 10, 0));
    storage.addTask(Task.create("deleteTask", { a: 1 }, 11, 0));
    storage.addTask(Task.create("deleteTask", {}, 14, 0));
    storage.addTask(Task.create("testTask", {}, 20, 0));
    storage.addTask(Task.create("deleteTask", {}, 20, 0));
    storage.addTask(Task.create("longTask", {}, 21, 0));
    storage.addTask(Task.create("longTask", { t: 23 }, 23, 0));
    storage.addTask(Task.create("longTask", {}, 28, 0));
    storage.addTask(Task.create("deleteTask", { file: "abc.txt" }, 25, 0));
    storage.addTask(Task.create("deleteTask", {}, 53, 0));

    const startTime = moment().unix();
    eng.run(20);

    setTimeout(() => {
        debug("stopping engine");
        stopApp();
        const totalTime = moment().unix() - startTime;
        debug("it tooks [%d] second(s)", totalTime);
    }, totalRunningTime * 1000);
}
