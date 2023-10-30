import { Pending } from "./Pending.js";

export function stopStory(soul, commandId) {
    console.log("stoppending")
    Pending.removePending(soul.m.channel, soul.user, commandId);
}