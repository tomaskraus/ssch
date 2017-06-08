
import { Engine } from "./engine/Engine";

let totalRunningTime = 5; //in seconds


let eng = new Engine(2);

eng.run(0);

setTimeout(() => {
    console.log("stopping engine");
    eng.stop();
}, totalRunningTime * 1000);


