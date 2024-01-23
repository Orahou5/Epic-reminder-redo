import { createPetHelper, ruleMove, rulePetHelper, stopStory } from "../system/rule.js";
import { getCooldownFromMsg } from "../system/utils.js";
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

function save(argsUp = {}) {
    return function (pending, msg, now = Date.now(), args = {}) {
        stopStory(pending);

        const users = argsUp.users ?? args?.users ?? pending.users;
        const dTime = [args, argsUp].some(props => props?.retrieveDTime === true) ? getCooldownFromMsg(msg, this.location) : args?.dTime;

        [pending.user, ...users].forEach((user) => {
            insertReminderRetry({user, msg, now, commandId: pending.commandId, ...args, ...argsUp, ...{dTime}});
        });
    }
}

function saveGuild(argsUp = {}) {
    return function (pending, msg, now = Date.now(), args = {}) {
        const user = getRoleStartingWith(pending.user, "EGuild") ?? pending.user;
        save({...argsUp, user}) (pending, msg, args, now);
    }
}

//TODO: possible merge with Command or prototype of it
function customizeProcess(steps = []) {
    return function(args) {
        return function(pending, msg, now = Date.now()) {
            console.log("processing steps", pending.commandId);

            steps.forEach((step) => {
                step.call(this, pending, msg, now, args);
            });
        }
    }
}

export const processWithMove = customizeProcess([ruleMove, save()])();

export const processCustom = customizeProcess([save()]);

export const defaultProcess = processCustom();

export const processPetHelper = customizeProcess([stopStory, rulePetHelper])();

export const processTrainingPetHelper = customizeProcess([createPetHelper, save()])();

export function processEvent(eventKey, baseCd = true) {
    const saver = baseCd ? [save()] : [];
    return customizeProcess([...saver, save({retrieveDTime: true, commandId: eventKey})])();
}

export const processGuild = customizeProcess([
    saveGuild(),
    saveGuild({
        commandId: "guildReset", 
        dTime: getMillisecondsUntilNextSaturday(), 
        display: (user) => {
            return `${user.mention} Did you know? :low_brightness:**GUILD UPGRADE**:low_brightness: has reset *desu* You can do it with </guild upgrade:961046237753257994>!`
        }, 
        isFixed: true
    })
]);