import { Pending } from "./Pending.js";
import { send } from "./discordUtils.js";

export function stopStory(soul, commandId) {
    console.log("stoppending")
    Pending.removePending(soul.user, commandId);
}

export function ruleMove(soul) {
    send(soul.m.channel, `${soul.user}, Don't forget to switch back to your original area. *desu*`);
}