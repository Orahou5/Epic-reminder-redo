import { Pending } from "./process.js";

export function stopStory(soul, commandId) {
    console.log("stoppending")
    Pending.removePending(soul.m.channel, soul.user, commandId);
}