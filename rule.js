export function stopStory(soul, commandId) {
    Pending.removePending(soul.m.channel, soul.user, commandId);
}