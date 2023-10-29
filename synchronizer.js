import { disableReminder, getReminders } from "./database.js";
import { client } from "./index.js";
import { showHoursMinutesSeconds } from "./utils.js";

class Timeloop {
    static scenarios = [];
    static run = this.start();
    static modified = false;

    static addScenario(scenario) {
        this.scenarios.push(scenario);
        this.modified = true;
        this.run.next("add");
    }

    static addScenarios(scenarios) {
        if(scenarios?.length === 0) return;
        this.scenarios.push(...scenarios);
        this.modified = true;
        this.run.next("add");
    }

    static async *start(){
        while(true){
            if(this.scenarios.length === 0){
                yield;
            }

            const scenario = this.scenarios.shift();

            if(scenario.timer > Date.now()){
                console.log("sleeping for", scenario.timer - Date.now())
                this.sleep(scenario.timer - Date.now());
                while((yield) !== "sleep");
                showHoursMinutesSeconds("scenario sleep")
                if(this.modified){
                    console.log("modified")
                    this.modified = false;
                    continue;
                }
            }
            showHoursMinutesSeconds("scenario send")
            client.rest.channels.createMessage(scenario.channel_id, {
                content: scenario.message,
            }).then(() => {
                disableReminder(scenario.discord_id, scenario.command_id);
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    static sleep(ms) {
        const runTemp = this.run;
        setTimeout(() => {
            runTemp.next("sleep");
        }, ms);
    }
}

function loopContent() {
    getReminders(40 * 1000).then((reminders) => {
        Timeloop.addScenarios(reminders)
    });
}

export function startTimeloop() {
    loopContent();
    setInterval(loopContent, 30 * 1000);
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}