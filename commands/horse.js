import { CommandHandler } from "../commandHandler.js";
import { getMultiplesUsersFromMessage } from "../discordUtils.js";
import { createConnectedPending, createPending } from "../pending.js";
import { Process, Settings } from "../process.js";
import { stopStory } from "../rule.js";
import { convertToMilliseconds } from "../utils.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { createDisplay } from "./commons/default.js";
import { processWithCustomDisplay } from "./commons/process.js";

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
    
            createConnectedPending(msg.channel.id, users, command);
        }
    });
    
    Settings.add(command, {
        dTime: convertToMilliseconds({days: 1}),
        fixed_cd: true,
        emoji: ":magnet:",
    });

    const toBeRegistered = [
        {
            data: ["usernameStar", "got a tier"],
            preverif: "tier",
            location: "description",
            process: processWithCustomDisplay(createDisplay("horse breed", ":magnet:"))
        },
        customizeCooldown("this command"),
        {
            data: ["usernameStar", "horse race"],
            preverif: "race",
            location: "content",
            process: processWithCustomDisplay(createDisplay("horse race", ":magnet:"))
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