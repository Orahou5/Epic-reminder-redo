import { convertToMilliseconds } from "../scripts/utils.js";
import { commandsUser } from "../system/Commands.js";
import { createPendingUser } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { defaultProcess, processWithMove } from "./commons/operation.js";

const command = "work";

{
    CommandHandler.addMultiplesTriggers([  
        "chop", "fish", "pickup", "mine", 
        "axe", "net", "ladder", "pickaxe",
        "bowsaw", "boat", "tractor", "drill",
        "chainsaw", "bigboat", "greenhouse", "dynamite" 
    ], async(msg) => {
        createPendingUser({user: msg.author, commandId: command, channelId: msg.channel.id});
    });
    
    Settings.add(command, {
        dTime: convertToMilliseconds({minutes: 5}),
        fixed_cd: true,
        emoji: "<:ruby:788422407677149234>"
    });

    const toBeRegistered = [
        {
            data: ["got", ["log", "ruby", "coins", "fish", "apple", "banana"]],
            location: "content",
            process: defaultProcess
        },
        {
            data: [["fights **the ruby dragon**", "ran away"]],
            location: "content",
            process: processWithMove
        },
        {
            data: ["sleeps", "got 2"],
            preverif: "sleeps",
            location: "content",
            process: processWithMove
        },
        {
            data: [["cried", "sleeps"]],
            preverif: "cried",
            location: "content",
            process: defaultProcess
        },
        customizeCooldown("got some resources"),
        epicJailCommand,
    ];

    commandsUser.addCommands(command, toBeRegistered);
}