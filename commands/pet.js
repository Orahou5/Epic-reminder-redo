import { CommandHandler } from "../commandHandler.js";
import { createPending } from "../pending.js";
import { Process, Settings } from "../process.js";
import { convertToMilliseconds } from "../utils.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { defaultProcess, processWithMove } from "./commons/process.js";

const command = "pet";

{
    CommandHandler.addMultiplesTriggers(["pet", "pets"], async(msg) => {
        createPending(msg.channel.id, msg.author, command)
    });
    
    Settings.add(command, {
        dTime: convertToMilliseconds({hours: 4}),
        fixed_cd: true,
        emoji: "<:foxknife:776803712626458634>"
    });

    const toBeRegistered = [
        {
            data: ["usernameStar", "got", ["log", "ruby", "coins", "fish", "apple", "banana"]],
            preverif: "got",
            location: "content",
            process: defaultProcess
        },
        {
            data: ["usernameStar", "fights **the ruby dragon**"],
            preverif: "ruby dragon",
            location: "content",
            process: processWithMove
        },
        {
            data: ["usernameStar", "ran away"],
            preverif: "ran",
            location: "content",
            process: processWithMove
        },
        {
            data: ["usernameStar", "sleeps", "got 2"],
            preverif: "sleeps",
            location: "content",
            process: processWithMove
        },
        {
            data: ["usernameStar", ["cried", "sleeps"]],
            preverif: "cried",
            location: "content",
            process: defaultProcess
        },
        customizeCooldown("got some resources"),
        epicJailCommand,
    ];

    Process.addCommands(command, toBeRegistered)
}