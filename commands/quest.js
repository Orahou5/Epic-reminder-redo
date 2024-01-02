import { extractUserAndChannelId } from "../discord/discordUtils.js";
import { convertToMilliseconds } from "../scripts/utils.js";
import { commandsUser } from "../system/Commands.js";
import { createPendingUser } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { stopStory } from "../system/rule.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { createDisplay } from "./commons/default.js";
import { defaultProcess, processCustom } from "./commons/operation.js";

const command = "quest";

{
    CommandHandler.addMultiplesTriggers(["quest", "epic"], async(msg) => {
        const args = msg.content.toLowerCase().split(" ");

        const bool = args.at(1) === "quest" && args.at(2) !== "cancel";
        const bool2 = args.at(1) === "epic" && args.at(2) === "quest";

        if(bool || bool2) createPendingUser({...extractUserAndChannelId(msg), commandId: command})
    });
    
    Settings.add(command, {
        dTime: convertToMilliseconds({hours: 6}),
        fixed_cd: true,
        emoji: "<:lightscroll:826595062413525012>",
    });

    const toBeRegistered = [
        {
            data: ["got a", "new quest"],
            location: "content",
            process: defaultProcess
        },
        {
            data: ["you did not accept the quest"],
            location: "content",
            process: processCustom({dTime: convertToMilliseconds({hours: 1}), isFixed: true})
        },
        {
            data: ["epic quest", ["rewards", "better luck next time"]],
            location: "authorName=field0Name",
            process: processCustom({display: createDisplay("epic quest", ":horse_racing:")})
        },
        customizeCooldown("claimed a quest"),
        {
            data: ["quest", "completed"],
            location: "authorName=description",
            process: stopStory
        },
        {
            data: ["epic quest cancelled"],
            location: "content",
            process: stopStory
        },
        epicJailCommand
    ];

    commandsUser.addCommands(command, toBeRegistered);
}