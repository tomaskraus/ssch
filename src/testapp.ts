
import { Engine } from "./engine/Engine";
import * as moment from "moment";

let engineLoopInterval = 2; //in seconds
let totalRunningTime = 60; //in seconds

let eng = new Engine(engineLoopInterval);


// eng.run(moment().unix());
eng.run(0);

setTimeout(() => {
    console.log("stopping engine");
    eng.stop();
}, totalRunningTime * 1000);


