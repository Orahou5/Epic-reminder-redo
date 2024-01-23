import { getMultiplesUsersFromMessage } from "../discord/discordUtils.js";
import { customizeCooldown, epicJailCommand } from "../operators/commands.js";
import { createDisplay } from "../operators/default.js";
import { processCustom } from "../operators/operation.js";
import { authorDashProcess, contentMentionProcess, contentStarProcess } from "../operators/usersUtils.js";
import { createPending } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { stopStory } from "../system/rule.js";
import { convertToMilliseconds } from "../system/utils.js";

const commands = {
    id : "horse",
    list: [
        {
            data: ["horse breeding", "got a tier"],
            ...authorDashProcess( "authorName=description", processCustom({display: createDisplay("horse breed", ":magnet:")})),
        },
        customizeCooldown("this command"),
        {
            data: ["horse race"],
            ...contentStarProcess(processCustom({display: createDisplay("horse race", ":magnet:")}))
        },
        {
            data: [["horse breeding cancelled", "another player to use this command", "tier V or higher", "you are registered already"]],
            ...contentMentionProcess(stopStory)
        },
        epicJailCommand
    ]
} 

CommandHandler.addTrigger("horse", async(msg) => {
    const args = msg.content.toLowerCase().split(" ");

    if(args.at(2) === "race") {
        createPending({
            msg: msg,
            commands: commands, 
        });
    }

    else if(["breed", "breeding"].includes(args.at(2))){
        const users = getMultiplesUsersFromMessage({
            msg,
            start: 3,
            max: 1
        });

        if(users === undefined) return;

        createPending({
            msg: msg,
            commands: commands, 
            users: users,
            timeOut: convertToMilliseconds({minutes: 18})
        });
    }
});
    
Settings.add(commands.id, {
    dTime: convertToMilliseconds({days: 1}),
    fixed_cd: true,
    emoji: ":magnet:",
});