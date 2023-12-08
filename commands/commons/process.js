import { createPetHelper, getUsers, ruleMove, rulePetHelper, stopStory } from "../../rule.js";
import { getCooldownFromMsg } from "../../utils.js";
import { getRoleStartingWith, insertReminderRetry } from "./default.js";

function getMillisecondsUntilNextSaturday() {
    const now = Date.now();
    const nextSaturday = new Date(now);

    nextSaturday.setUTCHours(22);
    nextSaturday.setUTCMinutes(0);
    nextSaturday.setUTCSeconds(0);
    nextSaturday.setUTCMilliseconds(0);

    if (nextSaturday.getTime() <= now) {
        nextSaturday.setDate(nextSaturday.getDate() + 7);
    }

    const daysUntilSaturday = (6 - nextSaturday.getUTCDay() + 7) % 7;
    nextSaturday.setDate(nextSaturday.getDate() + daysUntilSaturday);

    const millisecondsUntilSaturday = nextSaturday.getTime() - now;
    return millisecondsUntilSaturday;
}

function save(multiple = false) {
    return function(argsUp = {}) {
        return function (soul, commandId, now = Date.now(), args = {}) {
            let users = [];
            if(multiple === true) {
                users = getUsers(soul, commandId);
            }

            [soul.user, ...users].forEach((user) => {
                insertReminderRetry({user, msg: soul.m, now, commandId, ...args, ...argsUp});
            });

            stopStory(soul, commandId);
        }
    }
}

const saveOne = save();
const saveMultiple = save(true);

function customizeProcess(steps = []) {
    return function(args) {
        return function(soul, commandId, now = Date.now()) {
            console.log("processing steps", commandId);
            const dTime = args?.retrieveDTime === true ? getCooldownFromMsg(soul.m, this.location) : args?.dTime;
    
            steps.forEach((step) => {
                step(soul, commandId, now, {...args, ...{dTime}});
            });
        }
    }
}

export const processWithMove = customizeProcess([ruleMove, saveOne()])();

export const processCustom = customizeProcess([saveOne()]);

export const defaultProcess = processCustom();

export const processPetHelper = customizeProcess([stopStory, rulePetHelper])();

export const processTrainingPetHelper = customizeProcess([createPetHelper, saveOne()])();

export const processConnected = customizeProcess([saveMultiple()]);

export function processGuild(args) {
    return function(soul, commandId, now = Date.now()) {
        const user = getRoleStartingWith(soul.user, "EGuild") ?? soul.user;

        customizeProcess(
            [
                saveOne({user}), 
                saveOne({
                    user,
                    commandId: "guildReset", 
                    dTime: getMillisecondsUntilNextSaturday(), 
                    display: (user) => {
                        return `${user.mention} Did you know? :low_brightness:**GUILD UPGRADE**:low_brightness: has reset *desu* You can do it with </guild upgrade:961046237753257994>!`
                    }, 
                    isFixed: true
                })
            ],
        )().call(this, soul, commandId, now, args);
    }
}