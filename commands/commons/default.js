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

export function getRoleStartingWith(member, prefix) {
    return member.client.guilds.get(member.guildID).roles.find(role => member.roles.includes(role.id) && role.name.includes(prefix));
    
}

export function createDisplayGuild(command, interactionCommand, emoji, emoji2 = null){
    return function(user) {
        return `${user.mention} Hey, Hey, ${emoji}**${command.toUpperCase()}**${emoji2 ?? emoji} is ready again! *desu* You can do it with ${interactionCommand}!`
    }
}

export function insertReminderRetry({user, msg, now, commandId, display = null, dTime = null, isFixed = null, delay = 10 * 1000}) {
    console.log("inserting");
    showHoursMinutesSeconds(`inserting ${commandId}`);

    const settings = Settings.get(commandId);

    const displayFn = display ?? createDisplay(commandId, settings.emoji, settings.emoji2)

    insertReminder({
        discord_id: user.id,
        command_id: commandId,
        dTime: dTime ?? settings.dTime,
        time: now,
        enabled: true,
        channel_id: msg.channel.id,
        message: displayFn(user),
        fixed_cd: isFixed ?? settings.fixed_cd
    }).then(() => {
        console.log("inserted");
    }).catch((err) => { 
        console.log(err);

        setTimeout(() => {
            insertReminderRetry({user, msg, now, commandId, display, dTime, isFixed, delay});
        }, delay);
    });
}