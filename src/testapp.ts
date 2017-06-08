
import { Engine } from "./engine/Engine";

let engineLoopInterval = 2; //in seconds
let totalRunningTime = 60; //in seconds

let eng = new Engine(engineLoopInterval);


eng.run(0);

setTimeout(() => {
    console.log("stopping engine");
    eng.stop();
}, totalRunningTime * 1000);


