
import {SimpleStorage} from "./storage/SimpleStorage";
import { Engine } from "./engine/Engine";
import * as moment from "moment";
import { TaskHelper } from "./task/TaskHelper";

let engineLoopInterval = 3; //in seconds
let totalRunningTime = 60; //in seconds

let stor = new SimpleStorage();
stor.addTask(TaskHelper.create("deleteTask", {}, 10, 0));
stor.addTask(TaskHelper.create("deleteTask", {}, 11, 0));
stor.addTask(TaskHelper.create("deleteTask", {}, 14, 0));
// stor.addTask(TaskHelper.create("testTask", {}, 25, 0));
stor.addTask(TaskHelper.create("deleteTask", {}, 25, 0));
stor.addTask(TaskHelper.create("deleteTask", {}, 53, 0));

let eng = new Engine(stor, engineLoopInterval);


// eng.run(moment().unix());
eng.run(0);

setTimeout(() => {
    console.log("stopping engine");
    eng.stop();
}, totalRunningTime * 1000);


