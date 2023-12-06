import { insertReminder } from "../../database.js";
import { Settings } from "../../process.js";
import { showHoursMinutesSeconds } from "../../utils.js";

export function createDisplay(command, emoji, emoji2 = null) {
    return function(user) {
        return `${user.mention} It's time for ${emoji}**${command.toUpperCase()}**${emoji2 ?? emoji} *desu*`
    }
}

export function checkUsername(msg, user) {
    return msg?.[this.location]?.includes(`**${user.username}**`);
}

export function insertReminderRetry({soul, now, commandId, display = null, dTime = null, isFixed = null, delay = 10 * 1000}) {
    console.log("inserting");
    showHoursMinutesSeconds(`inserting ${commandId}`);

    const settings = Settings.get(commandId);

    const displayFn = display ?? createDisplay(commandId, settings.emoji, settings.emoji2)

    insertReminder({
        discord_id: soul.user.id,
        command_id: commandId,
        dTime: dTime ?? settings.dTime,
        time: now,
        enabled: true,
        channel_id: soul.m.channel.id,
        message: displayFn(soul.user),
        fixed_cd: isFixed ?? settings.fixed_cd
    }).then(() => {
        console.log("inserted");
    }).catch((err) => { 
        console.log(err);

        setTimeout(() => {
            insertReminderRetry(reminder);
        }, delay);
    });
}