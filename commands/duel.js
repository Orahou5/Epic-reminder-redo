import { getMultiplesUsersFromMessage } from "../scripts/discordUtils.js";
import { createConnectedPending } from "../scripts/pending.js";
import { Process, Settings } from "../scripts/process.js";
import { convertToMilliseconds } from "../scripts/utils.js";
import { CommandHandler } from "../system/commandHandler.js";
import { stopStory } from "../system/rule.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { processConnected } from "./commons/process.js";

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
            process: processConnected(),
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