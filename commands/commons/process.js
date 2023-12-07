import { createPending } from "../../pending.js";
import { getUsers, ruleMove, rulePetHelper, stopStory } from "../../rule.js";
import { getCooldownFromMsg } from "../../utils.js";
import { insertReminderRetry } from "./default.js";

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