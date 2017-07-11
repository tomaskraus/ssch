
// import {SimpleStorage} from "./storage/SimpleStorage";
import { MongoStorage } from "./storage/MongoStorage";
import { Engine } from "./engine/Engine";
import * as moment from "moment";
import { TaskHelper } from "./task/TaskHelper";

import Debug from 'debug';
const debug = Debug('ssch:testapp');

debug("start testapp");

let engineLoopInterval = 3; //in seconds
let totalRunningTime = 20; //in seconds

// let stor = new SimpleStorage('storageName');
MongoStorage.getNewInstance('mongodb://localhost:27017/ssch-testapp')
    .then(storage => { startApp(storage) })
    .catch(err => { debug("storage initialization failed. reason: [%o]", err); })

function startApp(stor) {
    stor.addTask(TaskHelper.create("deleteTask", { a: "1st" }, 1, 0));
    stor.addTask(TaskHelper.create("deleteTask", {}, 10, 0));
    stor.addTask(TaskHelper.create("deleteTask", { a: 1 }, 11, 0));
    stor.addTask(TaskHelper.create("deleteTask", {}, 14, 0));
    stor.addTask(TaskHelper.create("testTask", {}, 20, 0));
    stor.addTask(TaskHelper.create("deleteTask", {}, 20, 0));
    stor.addTask(TaskHelper.create("longTask", {}, 21, 0));
    stor.addTask(TaskHelper.create("longTask", { t: 23 }, 23, 0));
    stor.addTask(TaskHelper.create("longTask", {}, 28, 0));
    stor.addTask(TaskHelper.create("deleteTask", { file: "abc.txt" }, 25, 0));
    stor.addTask(TaskHelper.create("deleteTask", {}, 53, 0));

    let eng = new Engine(stor, engineLoopInterval);


    let startTime = moment().unix();
    eng.run(20);

    setTimeout(() => {
        debug("stopping engine");
        eng.stop();
        let totalTime = moment().unix() - startTime;
        debug("it tooks [%d] second(s)", totalTime);
    }, totalRunningTime * 1000);
}


