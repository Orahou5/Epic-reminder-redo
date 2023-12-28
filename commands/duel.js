import { getMultiplesUsersFromMessage } from "../discord/discordUtils.js";
import { convertToMilliseconds } from "../scripts/utils.js";
import { commandsUser } from "../system/Commands.js";
import { createPendingUser } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { stopStory } from "../system/rule.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { processConnected } from "./commons/operation.js";

const command = "duel";

{
    CommandHandler.addTrigger("duel", async(msg) => {
        const users = getMultiplesUsersFromMessage({
            msg,
            start: 2,
            max: 1
        });

        if(users === undefined) return;

        createPendingUser({
            user: msg.author, 
            commandId: command, 
            channelId: msg.channel.id,
            users: users
        });
    });
    
    Settings.add(command, {
        dTime: convertToMilliseconds({hours: 2}),
        fixed_cd: true,
        emoji: "<:crossed_sword:788431002510557214>"
    });

    const toBeRegistered = [
        {
            data: ["duel", ["reward", "nobody won"]],
            location: "authorName=field0Value",
            process: processConnected(),
        },
        customizeCooldown("duel recently"),
        {
            data: ["duel cancelled"],
            location: "content",
            process: stopStory
        },
        epicJailCommand
    ];

    // Process.addCommands(command, toBeRegistered)
    commandsUser.addCommands(command, toBeRegistered);
}