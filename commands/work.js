import { createPending } from "../scripts/pending.js";
import { Process, Settings } from "../scripts/process.js";
import { convertToMilliseconds } from "../scripts/utils.js";
import { CommandHandler } from "../system/commandHandler.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { defaultProcess, processWithMove } from "./commons/process.js";

const command = "work";

{
    CommandHandler.addMultiplesTriggers([  
        "chop", "fish", "pickup", "mine", 
        "axe", "net", "ladder", "pickaxe",
        "bowsaw", "boat", "tractor", "drill",
        "chainsaw", "bigboat", "greenhouse", "dynamite" 
    ], async(msg) => {
        createPending(msg.channel.id, msg.author, command);
    });
    
    Settings.add(command, {
        dTime: convertToMilliseconds({minutes: 5}),
        fixed_cd: true,
        emoji: "<:ruby:788422407677149234>"
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