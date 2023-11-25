import { insertReminder } from "../database.js"
import { Settings } from "../process.js"
import { ruleMove, stopStory } from "../rule.js"
import { showHoursMinutesSeconds } from "../utils.js"

export const cryCommand = {
    data: {
        condition: (user) => `${user.username}.{2} cried`,
        location: "content",
    },
    process: defaultProcess,
}

const cooldownCommand = {
    data: {
        condition: (user) => `${user.username} — cooldown`,
        location: "authorName",
    },
    process: defaultProcessWithoutSave,
}

const epicJailCommand = {
    data: {
        condition: (user) => `${user.username}.{2} is now in the jail`,
        location: "content",
    },
    process: defaultProcessWithoutSave,
}

export const defaultCommands = [
    cooldownCommand,
    epicJailCommand
]

export const defaultCommandsPreverif = [
    ["cooldown", "authorName"],
    ["jail", "content"]
]

export const winFight = {
    data: {
        condition: (user) => `${user.username}\\*{2} found and killed`,
        location: "content",
    },
    process: defaultProcess,
}

export const loseFight = {
    data: {
        condition: (user) => `${user.username}\\*{2} found a.*?but lost fighting`,
        location: "content",
    },
    process: defaultProcess,

}

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

function createDisplay(user, commandId, emoji, emoji2 = null) {
    return `${user.mention} It's time for ${emoji}**${commandId.toUpperCase()}**${emoji2 ?? emoji} *desu*`
}

function insertReminderRetry(soul, now, commandId, delay = 10 * 1000) {
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