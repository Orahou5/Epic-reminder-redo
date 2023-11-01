import { send } from "./discordUtils.js";
import { findPending } from "./pending.js";

export function stopStory(soul, commandId) {
    console.log("stoppending")
    findPending(soul.user, commandId)?.removeFromPending();
}

export function ruleMove(soul) {
    send(soul.m.channel, `${soul.user}, Don't forget to switch back to your original area. *desu*`);
}