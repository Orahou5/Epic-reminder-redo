import { insertReminder } from "../database.js"
import { Location } from "../discordUtils.js"
import { stopStory } from "../rule.js"
import { showHoursMinutesSeconds } from "../utils.js"

export const cryCommand = (saveMethod) => ({
    scenario_id: "cry",
    condition: (user) => `${user.username}.{2} cried`,
    place: (m) => Location.content(m),
    rule: async (soul, commandId) => stopStory(soul, commandId),
    save(soul, now) {
        saveMethod(soul, now, this.scenario_id)
    }
})

const cooldownCommand = {
    scenario_id: "cooldown",
    condition: (user) => `${user.username} — cooldown`,
    place: (m) => Location.authorName(m),
    rule: async (soul, commandId) => stopStory(soul, commandId),
}

const epicJailCommand = {
    scenario_id: "epicJail",
    condition: (user) => `${user.username}.{2} is now in the jail`,
    place: (m) => Location.content(m),
    rule: async (soul, commandId) => stopStory(soul, commandId),
}

export const defaultCommands = [
    cooldownCommand,
    epicJailCommand
]

export const defaultCommandsPreverif = [
    ["cooldown", "authorName"],
    ["jail", "content"]
]

export const winFight = (saveMethod) => ({
    scenario_id: "winFight",
    condition: (user) => `${user.username}\\*{2} found and killed`,
    place: (m) => Location.content(m),
    rule: async (soul, commandId) => stopStory(soul, commandId),
    save(soul, now) {
        saveMethod(soul, now, this.scenario_id)
    }
})

export const loseFight = (saveMethod) => ({
    scenario_id: "loseFight",
    condition: (user) => `${user.username}\\*{2} found a.*?but lost fighting`,
    place: (m) => Location.content(m),
    rule: async (soul, commandId) => stopStory(soul, commandId),
    save(soul, now) {
        saveMethod(soul, now, this.scenario_id)
    }
})

export function insertReminderRetry(reminder, delay = 10 * 1000) {
    console.log("inserting");
    showHoursMinutesSeconds(`inserting ${reminder.command_id}`);

    insertReminder(reminder).then(() => {
        console.log("inserted");
    }).catch((err) => { 
        console.log(err);

        setTimeout(() => {
            insertReminderRetry(reminder);
        }, delay);
    });
}