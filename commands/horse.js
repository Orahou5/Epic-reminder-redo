import { extractUserAndChannelId, getMultiplesUsersFromMessage } from "../discord/discordUtils.js";
import { convertToMilliseconds } from "../scripts/utils.js";
import { commandsUser } from "../system/Commands.js";
import { createPendingUser } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { stopStory } from "../system/rule.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { createDisplay } from "./commons/default.js";
import { processConnected, processCustom } from "./commons/operation.js";

const command = "horse";

{
    CommandHandler.addTrigger("horse", async(msg) => {
        const args = msg.content.toLowerCase().split(" ");

        if(args.at(2) === "race") createPendingUser({...extractUserAndChannelId(msg), commandId: command})

        else if(["breed", "breeding"].includes(args.at(2))){
            const users = getMultiplesUsersFromMessage({
                msg,
                start: 3,
                max: 1
            });

            if(users === undefined) return;
    
            createPendingUser({...extractUserAndChannelId(msg), commandId: command, users: users})
        }
    });
    
    Settings.add(command, {
        dTime: convertToMilliseconds({days: 1}),
        fixed_cd: true,
        emoji: ":magnet:",
    });

    const toBeRegistered = [
        {
            data: ["horse breeding", "got a tier"],
            location: "authorName=description",
            process: processConnected({display: createDisplay("horse breed", ":magnet:")}),
        },
        customizeCooldown("this command"),
        {
            data: ["horse race"],
            location: "content",
            process: processCustom({display: createDisplay("horse race", ":magnet:")})
        },
        {
            data: [["horse breeding cancelled", "another player to use this command", "tier V or higher", "you are registered already"]],
            location: "content",
            process: stopStory
        },
        epicJailCommand
    ];

    commandsUser.addCommands(command, toBeRegistered);
}