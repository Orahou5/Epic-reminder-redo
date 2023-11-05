import { CommandHandler } from "../commandHandler.js";
import { Location, getIdFromMentionString } from "../discordUtils.js";
import { Display } from "../display.js";
import { createConnectedPending } from "../pending.js";
import { Preverification, Process } from "../process.js";
import { stopStory } from "../rule.js";
import { defaultCommands, defaultCommandsPreverif, insertReminderRetry } from "./default.js";

const command = "duel";

{
    CommandHandler.addTrigger("duel", async(msg) => {
        const args  = msg.content.split(" ");

        if(args.length < 3) return;

        const otherUser = msg.mentions.users.find((user) => user.id === getIdFromMentionString(args.at(2)));

        if(otherUser === undefined) return;

        const users = [msg.author, otherUser];

        createConnectedPending(msg.channel.id, users, command);
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
        ...defaultCommands,
        {
            scenario_id: "duelCancel",
            condition: (user) => `${user.username}.{4} Duel cancelled`,
            place: (m) => Location.content(m),
            rule: async (soul, commandId) => stopStory(soul, commandId),
        }
    ];

    Process.addCommands(command, toBeRegistered)

    const preverif = [
        ["cancelled", "content"],
        ["boom", "description"],
        ...defaultCommandsPreverif
    ]

    Preverification.addCommandLinks(preverif, command);

    Display.addDisplay(`__|user|__ It's time for <:crossed_sword:788431002510557214>**DUEL**<:crossed_sword:788431002510557214> *desu*`, command, "default");
}

function insertDuel(soul, now, scenario_id) {
    insertReminderRetry({
        discord_id: soul.user.id,
        command_id: command,
        dTime: 2 * 60 * 60 * 1000,
        time: now,
        enabled: true,
        channel_id: soul.m.channel.id,
        message: Display.getDisplay(soul.user, command, scenario_id),
        fixed_cd: true
    });
}