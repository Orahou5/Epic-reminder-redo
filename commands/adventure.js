import { CommandHandler } from "../commandHandler.js";
import { Display } from "../display.js";
import { createPending } from "../pending.js";
import { Preverification, Process } from "../process.js";
import { defaultCommands, defaultCommandsPreverif, insertReminderRetry, loseFight, winFight } from "./default.js";

const command = "adventure";

{
    CommandHandler.addMultiplesTriggers(["adv", "adventure"], async(msg) => {
        createPending(msg.channel.id, msg.author, command);
    });

    const toBeRegistered = [
        winFight(insertadventure),
        ...defaultCommands,
        loseFight(insertadventure),
    ];

    Process.addCommands(command, toBeRegistered)

    const preverif = [
        ["found", "content"],
        ...defaultCommandsPreverif
    ]

    Preverification.addCommandLinks(preverif, command);

    Display.addDisplay(`__|user|__ It's time for <:sword:788416329601908746>**ADVENTURE**<:sword:788416329601908746> *desu*`, command, "default");
}

function insertadventure(soul, now, scenario_id) {
    insertReminderRetry({
        discord_id: soul.user.id,
        command_id: command,
        dTime: 60 * 60 * 1000,
        time: now,
        enabled: true,
        channel_id: soul.m.channel.id,
        message: Display.getDisplay(soul.user, command, scenario_id),
        fixed_cd: true
    });
}