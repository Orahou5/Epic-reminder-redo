import { CommandHandler } from "../commandHandler.js";
import { getMultiplesUsersFromMessage } from "../discordUtils.js";
import { createConnectedPending } from "../pending.js";
import { Process, Settings } from "../process.js";
import { convertToMilliseconds } from "../utils.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { defaultProcess, defaultProcessWithoutSave } from "./commons/process.js";

const command = "duel";

{
    CommandHandler.addTrigger("duel", async(msg) => {
        const users = getMultiplesUsersFromMessage(msg, 1, 1);

        if(users === undefined) return;

        createConnectedPending(msg.channel.id, users, command);
    });
    
    Settings.add(command, {
        dTime: convertToMilliseconds({hours: 2}),
        fixed_cd: true,
        emoji: "<:crossed_sword:788431002510557214>"
    });

    const toBeRegistered = [
        {
            data: ["usernameStar", "boom"],
            preverif: "boom",
            location: "description",
            process: defaultProcess,
        },
        customizeCooldown("duel recently"),
        {
            data: ["usernameStar", "duel cancelled"],
            preverif: "cancelled",
            location: "content",
            process: defaultProcessWithoutSave,
        },
        epicJailCommand
    ];

    Process.addCommands(command, toBeRegistered)
}