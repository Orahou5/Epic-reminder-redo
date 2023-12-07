import { CommandHandler } from "../commandHandler.js";
import { getMultiplesUsersFromMessage } from "../discordUtils.js";
import { createConnectedPending } from "../pending.js";
import { Process, Settings } from "../process.js";
import { stopStory } from "../rule.js";
import { convertToMilliseconds } from "../utils.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { connectedProcess, defaultProcess } from "./commons/process.js";

const command = "duel";

{
    CommandHandler.addTrigger("duel", async(msg) => {
        const users = getMultiplesUsersFromMessage({
            msg,
            start: 2,
            max: 1
        });

        if(users === undefined) return;

        createConnectedPending(msg.channel.id, msg.author, command, users);
    });
    
    Settings.add(command, {
        dTime: convertToMilliseconds({hours: 2}),
        fixed_cd: true,
        emoji: "<:crossed_sword:788431002510557214>"
    });

    const toBeRegistered = [
        {
            data: ["usernameDash", "duel", "boom"],
            preverif: "boom",
            location: "authorName=description",
            process: connectedProcess,
        },
        customizeCooldown("duel recently"),
        {
            data: ["usernameStar", "duel cancelled"],
            preverif: "cancelled",
            location: "content",
            process: stopStory
        },
        epicJailCommand
    ];

    Process.addCommands(command, toBeRegistered)
}