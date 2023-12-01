import { insertReminder } from "../../database.js"
import { Settings } from "../../process.js"
import { showHoursMinutesSeconds } from "../../utils.js"

function createDisplay(user, commandId, emoji, emoji2 = null) {
    return `${user.mention} It's time for ${emoji}**${commandId.toUpperCase()}**${emoji2 ?? emoji} *desu*`
}

export function insertReminderRetry(soul, now, commandId, delay = 10 * 1000) {
    console.log("inserting");
    showHoursMinutesSeconds(`inserting ${commandId}`);

    const settings = Settings.get(commandId);

    insertReminder({
        discord_id: soul.user.id,
        command_id: commandId,
        dTime: settings.dTime,
        time: now,
        enabled: true,
        channel_id: soul.m.channel.id,
        message: createDisplay(soul.user, commandId, settings.emoji, settings.emoji2),
        fixed_cd: settings.fixed_cd
    }).then(() => {
        console.log("inserted");
    }).catch((err) => { 
        console.log(err);

        setTimeout(() => {
            insertReminderRetry(reminder);
        }, delay);
    });
}