import { CommandHandler } from "../commandHandler.js";
import { createPending } from "../pending.js";
import { Process, Settings } from "../process.js";
import { stopStory } from "../rule.js";
import { convertToMilliseconds } from "../utils.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { createDisplay } from "./commons/default.js";
import { defaultProcess, processCustom, processWithCustomDisplay } from "./commons/process.js";

const command = "quest";

{
    CommandHandler.addTrigger("quest", async(msg) => {
        const args = msg.content.toLowerCase().split(" ");

        if(args.at(2) !== "cancel") createPending(msg.channel.id, msg.author, command);
    });

    CommandHandler.addTrigger("epic", async(msg) => {
        const args = msg.content.toLowerCase().split(" ");

        if(args.at(2) === "quest") createPending(msg.channel.id, msg.author, command);
    });
    
    Settings.add(command, {
        dTime: convertToMilliseconds({hours: 6}),
        fixed_cd: true,
        emoji: "<:lightscroll:826595062413525012>",
    });

    const toBeRegistered = [
        {
            data: ["usernameStar", "got a", "new quest"],
            preverif: "quest",
            location: "content",
            process: defaultProcess
        },
        {
            data: ["mention", "you did not accept the quest"],
            preverif: "quest",
            location: "content",
            process: processCustom({dTime: convertToMilliseconds({hours: 1}), isFixed: true})
        },
        {
            data: ["usernameDash", "epic quest", ["rewards", "better luck next time"]],
            preverif: "epic quest",
            location: "authorName=field0Name",
            process: processWithCustomDisplay(createDisplay("epic quest", ":horse_racing:"))
        },
        customizeCooldown("claimed a quest"),
        {
            data: ["usernameDash", "quest", "completed"],
            preverif: "completed",
            location: "authorName=description",
            process: stopStory
        },
        {
            data: ["mention", "epic quest cancelled"],
            preverif: "cancelled",
            location: "content",
            process: stopStory
        },
        epicJailCommand
    ];

    Process.addCommands(command, toBeRegistered)
}