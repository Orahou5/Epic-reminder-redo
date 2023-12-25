import { getMultiplesUsersFromMessage } from "../scripts/discordUtils.js";
import { createConnectedPending, createPending } from "../scripts/pending.js";
import { Process, Settings } from "../scripts/process.js";
import { convertToMilliseconds } from "../scripts/utils.js";
import { CommandHandler } from "../system/commandHandler.js";
import { stopStory } from "../system/rule.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { createDisplay } from "./commons/default.js";
import { processConnected, processCustom } from "./commons/process.js";

const command = "horse";

{
    CommandHandler.addTrigger("horse", async(msg) => {
        const args = msg.content.toLowerCase().split(" ");

        if(args.at(2) === "race") createPending(msg.channel.id, msg.author, command);

        else if(["breed", "breeding"].includes(args.at(2))){
            const users = getMultiplesUsersFromMessage({
                msg,
                start: 3,
                max: 1
            });

            if(users === undefined) return;
    
            createConnectedPending(msg.channel.id, msg.author, command, users);
        }
    });
    
    Settings.add(command, {
        dTime: convertToMilliseconds({days: 1}),
        fixed_cd: true,
        emoji: ":magnet:",
    });

    const toBeRegistered = [
        {
            data: ["usernameDash", "horse breeding", "got a tier"],
            preverif: "tier",
            location: "authorName=description",
            process: processConnected({display: createDisplay("horse breed", ":magnet:")}),
        },
        customizeCooldown("this command"),
        {
            data: ["usernameStar", "horse race"],
            preverif: "race",
            location: "content",
            process: processCustom({display: createDisplay("horse race", ":magnet:")})
        },
        {
            data: ["mention", "horse breeding cancelled"],
            preverif: "cancelled",
            location: "content",
            process: stopStory
        },
        {
            data: ["mention", "another player to use this command"],
            preverif: "player",
            location: "content",
            process: stopStory
        },
        {
            data: ["mention", "tier V or higher"],
            preverif: "or higher",
            location: "content",
            process: stopStory
        },
        {
            data: ["mention", "you are registered already"],
            preverif: "registered",
            location: "content",
            process: stopStory
        },
        epicJailCommand
    ];

    Process.addCommands(command, toBeRegistered)
}