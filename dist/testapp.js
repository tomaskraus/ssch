"use strict";
const SimpleStorage_1 = require("./storage/SimpleStorage");
const Engine_1 = require("./engine/Engine");
const moment = require("moment");
const TaskHelper_1 = require("./task/TaskHelper");
const debug_1 = require("debug");
const debug = debug_1.default('ssch:testapp');
debug("start testapp");
let engineLoopInterval = 3; //in seconds
let totalRunningTime = 20; //in seconds
let stor = new SimpleStorage_1.SimpleStorage();
stor.addTask(TaskHelper_1.TaskHelper.create("deleteTask", { a: "1st" }, 1, 0));
stor.addTask(TaskHelper_1.TaskHelper.create("deleteTask", {}, 10, 0));
stor.addTask(TaskHelper_1.TaskHelper.create("deleteTask", { a: 1 }, 11, 0));
stor.addTask(TaskHelper_1.TaskHelper.create("deleteTask", {}, 14, 0));
stor.addTask(TaskHelper_1.TaskHelper.create("testTask", {}, 20, 0));
stor.addTask(TaskHelper_1.TaskHelper.create("deleteTask", {}, 20, 0));
stor.addTask(TaskHelper_1.TaskHelper.create("longTask", {}, 21, 0));
stor.addTask(TaskHelper_1.TaskHelper.create("longTask", { t: 23 }, 23, 0));
stor.addTask(TaskHelper_1.TaskHelper.create("longTask", {}, 28, 0));
stor.addTask(TaskHelper_1.TaskHelper.create("deleteTask", { file: "abc.txt" }, 25, 0));
stor.addTask(TaskHelper_1.TaskHelper.create("deleteTask", {}, 53, 0));
let eng = new Engine_1.Engine(stor, engineLoopInterval);
let startTime = moment().unix();
eng.run(20);
setTimeout(() => {
    debug("stopping engine");
    eng.stop();
    let totalTime = moment().unix() - startTime;
    debug("it tooks [%d] second(s)", totalTime);
}, totalRunningTime * 1000);
//# sourceMappingURL=testapp.js.map