import { CommandHandler } from "../commandHandler.js";
import { Location, getIdFromMentionString } from "../discordUtils.js";
import { Display } from "../display.js";
import { createConnectedPending } from "../pending.js";
import { Preverification, Process } from "../process.js";
import { stopStory } from "../rule.js";
import { cooldownCommand, epicJailCommand, insertReminderRetry } from "./default.js";

CommandHandler.addTrigger("duel", async(msg) => {
    const args  = msg.content.split(" ");

    if(args.length < 3) return;

    const otherUser = msg.mentions.users.find((user) => user.id === getIdFromMentionString(args.at(2)));

    if(otherUser === undefined) return;

    const users = [msg.author, otherUser];

    createConnectedPending(msg.channel.id, users, "duel");
});

const toBeRegistered = [
    {
        scenario_id: "duelEnd",
        condition: (user) => `${user.username}.*?boom`,
        place: (m) => Location.description(m),
        rule: async (soul, commandId) => stopStory(soul, commandId),
        save(soul, now) {
            insertDuel(soul, now, this.scenario_id)
        }
    },
    cooldownCommand,
    {
        scenario_id: "duelCancel",
        condition: (user) => `${user.username}.{4} Duel cancelled`,
        place: (m) => Location.content(m),
        rule: async (soul, commandId) => stopStory(soul, commandId),
    },
    epicJailCommand
];

Process.addCommands("duel", toBeRegistered)

const preverif = [
    ["cancelled", "content"],
    ["boom", "description"],
    ["cooldown", "authorName"],
    ["jail", "content"]
]

Preverification.addCommandLinks(preverif, "duel");

Display.addDisplay(`__|user|__ It's time for <:crossed_sword:788431002510557214>**DUEL**<:crossed_sword:788431002510557214> *desu*`, "duel", "default");

function insertDuel(soul, now, scenario_id) {
    insertReminderRetry({
        discord_id: soul.user.id,
        command_id: "duel",
        dTime: 2 * 60 * 60 * 1000,
        time: now,
        enabled: true,
        channel_id: soul.m.channel.id,
        message: Display.getDisplay(soul.user, "duel", scenario_id),
        fixed_cd: true
    });
}