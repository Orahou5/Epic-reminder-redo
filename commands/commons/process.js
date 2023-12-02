import { ruleMove, stopStory } from "../../rule.js";
import { getCooldownFromMsg } from "../../utils.js";
import { insertReminderRetry } from "./default.js";

export function defaultProcess(soul, commandId, now = Date.now()) {
    stopStory(soul, commandId);
    insertReminderRetry({soul, now, commandId});
}

export function defaultProcessWithCustomTime(soul, commandId, now = Date.now()) {
    stopStory(soul, commandId);

    console.log("custom time", this);

    const dTime = getCooldownFromMsg(soul.m, this.location);

    insertReminderRetry({soul, now, commandId, dTime});
}

export function defaultProcessWithMove(soul, commandId, now = Date.now()) {
    ruleMove(soul);
    defaultProcess(soul, commandId, now);
}

export function defaultProcessWithoutSave(soul, commandId) {
    stopStory(soul, commandId);
}