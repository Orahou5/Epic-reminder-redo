import { disableReminder, getReminders, pauseReminder, unpauseReminder } from "../database/database.js";
import { client } from "../index.js";
//import { deleteExpired } from "../scripts/pending.js";
import { convertToMilliseconds, showHoursMinutesSeconds } from "../scripts/utils.js";
import { deleteExpired } from "./Pending.js";

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
        this.scenarios = scenarios;
        showHoursMinutesSeconds(`adding scenarios : modified : ${this.modified}`)
        this.modified = true;
        this.run.next("add");
    }

    static async *start(){
        while(true){
            this.modified = false;
            //console.log(this.scenarios)
            if(this.scenarios.length === 0){
                yield;
                continue;
            }

            const scenario = this.scenarios.shift();

            if(scenario.timer > Date.now()){
                showHoursMinutesSeconds(`sleeping for ${scenario.timer - Date.now()} command : ${scenario.command_id} id : ${scenario.discord_id}`)

                this.sleep(scenario.timer - Date.now());
                while((yield) !== "sleep");

                showHoursMinutesSeconds(`scenario sleep command : ${scenario.command_id} id : ${scenario.discord_id}`)

                if(this.modified){
                    console.log(`${this.modified} modified`)
                    continue;
                }
            }
            showHoursMinutesSeconds(`scenario send command : ${scenario.command_id} id : ${scenario.discord_id}`)
            pauseReminder(scenario.discord_id, scenario.command_id);
            client.rest.channels.createMessage(scenario.channel_id, {
                content: scenario.message,
            }).then(() => {
                disableReminder(scenario.discord_id, scenario.command_id);
            }).catch((err) => {
                console.log(err);
                unpauseReminder(scenario.discord_id, scenario.command_id);
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
    deleteExpired();
}

export function startTimeloop() {
    loopContent();
    setInterval(loopContent, convertToMilliseconds({seconds: 30}));
    setInterval(pendingInterval, convertToMilliseconds({minutes: 5}));
}