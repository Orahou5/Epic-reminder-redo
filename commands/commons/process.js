import { ruleMove, stopStory } from "../../rule.js";
import { insertReminderRetry } from "./default.js";

export function defaultProcess(soul, commandId, now = Date.now()) {
    stopStory(soul, commandId);
    insertReminderRetry(soul, now, commandId);
}

export function defaultProcessWithMove(soul, commandId, now = Date.now()) {
    ruleMove(soul);
    defaultProcess(soul, commandId, now);
}

export function defaultProcessWithoutSave(soul, commandId) {
    stopStory(soul, commandId);
}