import { createPending } from "../../pending.js";
import { ruleMove, rulePetHelper, stopStory } from "../../rule.js";
import { getCooldownFromMsg } from "../../utils.js";
import { insertReminderRetry } from "./default.js";

export function defaultProcess(soul, commandId, now = Date.now()) {
    stopStory(soul, commandId);
    insertReminderRetry({soul, now, commandId});
}

export function processTrainingPetHelper(soul, commandId, now = Date.now()) {
    defaultProcess(soul, commandId, now);

    createPending(soul.m.channel.id, soul.user, "pethelper");
}

export function processPetHelper(soul, commandId) {
    stopStory(soul, commandId);

    rulePetHelper(soul);
}

export function processWithCustomTime(soul, commandId, now = Date.now()) {
    stopStory(soul, commandId);

    console.log("custom time", this);

    const dTime = getCooldownFromMsg(soul.m, this.location);

    insertReminderRetry({soul, now, commandId, dTime});
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