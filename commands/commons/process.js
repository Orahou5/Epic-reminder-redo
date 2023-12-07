import { createPending } from "../../pending.js";
import { getUsers, ruleMove, rulePetHelper, stopStory } from "../../rule.js";
import { getCooldownFromMsg } from "../../utils.js";
import { createDisplayGuild, getRoleStartingWith, insertReminderRetry } from "./default.js";

export function processTrainingPetHelper(soul, commandId, now = Date.now()) {
    defaultProcess(soul, commandId, now)

    createPending(soul.m.channel.id, soul.user, "pethelper");
}

export function processPetHelper(soul, commandId) {
    stopStory(soul, commandId);

    rulePetHelper(soul);
}

export function defaultProcess(soul, commandId, now = Date.now(), args = {}) {
    stopStory(soul, commandId);

    insertReminderRetry({soul, now, commandId, ...args});
}

export function connectedProcessWithArgs(args) {
    return function(soul, commandId, now = Date.now()) {
        return connectedProcess(soul, commandId, now, args);
    }
}

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

export function processGuild(args) {
    return function(soul, commandId, now = Date.now()) {
        processCustom(args).call(this, soul, commandId, now);
        insertReminderRetry({
            soul, 
            now, 
            commandId: "guildReset", 
            display: (user) => {
                const pingable = getRoleStartingWith(user, "EGuild") ?? user;
                return `${pingable.mention} Did you know? :low_brightness:**GUILD UPGRADE**:low_brightness: has reset *desu* You can do it with </guild upgrade:961046237753257994>!`
            },
            dTime: getMillisecondsUntilNextSaturday(),
            isFixed: true,
        });
    }
}

export function connectedProcess(soul, commandId, now = Date.now(), args = {}) {
    const users = getUsers(soul, commandId)
    stopStory(soul, commandId);

    [soul.user, ...users].forEach((user) => {
        insertReminderRetry({soul: {user, m: soul.m}, now, commandId, ...args});
    });
}

export function processCustom(args) {
    return function(soul, commandId, now = Date.now()) {
        const dTime = args.retrieveDTime === true ? getCooldownFromMsg(soul.m, this.location) : args?.dTime;

        defaultProcess(soul, commandId, now, {dTime, isFixed: args?.isFixed, display: args?.display});
    }
}

export function processWithMove(soul, commandId, now = Date.now()) {
    ruleMove(soul);
    defaultProcess(soul, commandId, now);
}

export function defaultProcessWithoutSave(soul, commandId) {
    stopStory(soul, commandId);
}

export function processWithCustomDisplay(displayFn) {
    return function(soul, commandId, now = Date.now()) {
        stopStory(soul, commandId);
        insertReminderRetry({soul, now, commandId, display: displayFn(soul.user)});
    }
}