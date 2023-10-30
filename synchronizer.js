import { Pending } from "./Pending.js";
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

                

                showHoursMinutesSeconds(`sleeping for ${scenario.timer - Date.now()} command : ${scenario.command_id} id : ${scenario.discord_id}`)

                this.sleep(scenario.timer - Date.now());
                while((yield) !== "sleep");

                showHoursMinutesSeconds(`scenario sleep command : ${scenario.command_id} id : ${scenario.discord_id}`)

                if(this.modified){
                    console.log("modified")
                    this.modified = false;
                    continue;
                }
            }
            showHoursMinutesSeconds(`scenario send command : ${scenario.command_id} id : ${scenario.discord_id}`)
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

function pendingInterval(){
    Pending.deleteExpired();
}

export function startTimeloop() {
    loopContent();
    setInterval(loopContent, 30 * 1000);
    setInterval(pendingInterval, 5 * 60 * 1000);
}