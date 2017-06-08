
import {SimpleStorage} from "./storage/SimpleStorage";
import { Engine } from "./engine/Engine";
import * as moment from "moment";
import { TaskHelper } from "./task/TaskHelper";

import Debug from 'debug';
const debug = Debug('ssch:testApp');

let engineLoopInterval = 3; //in seconds
let totalRunningTime = 60; //in seconds

let stor = new SimpleStorage();
stor.addTask(TaskHelper.create("deleteTask", {}, 10, 0));
stor.addTask(TaskHelper.create("deleteTask", {a: 1}, 11, 0));
stor.addTask(TaskHelper.create("deleteTask", {}, 14, 0));
stor.addTask(TaskHelper.create("testTask", {}, 20, 0));
stor.addTask(TaskHelper.create("deleteTask", {file: "abc.txt"}, 25, 0));
stor.addTask(TaskHelper.create("deleteTask", {}, 53, 0));

let eng = new Engine(stor, engineLoopInterval);


// eng.run(moment().unix());
eng.run(0);

setTimeout(() => {
    debug("stopping engine");
    eng.stop();
}, totalRunningTime * 1000);


