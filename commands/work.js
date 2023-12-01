import { CommandHandler } from "../commandHandler.js";
import { createPending } from "../pending.js";
import { Process, Settings } from "../process.js";
import { convertToMilliseconds } from "../utils.js";
import { defaultCommands } from "./commons/commands.js";
import { defaultProcess, defaultProcessWithMove } from "./commons/process.js";

const command = "work";

{
    CommandHandler.addMultiplesTriggers([  
        "chop", "fish", "pickup", "mine", 
        "axe", "net", "ladder", "pickaxe",
        "bowsaw", "boat", "tractor", "drill",
        "chainsaw", "bigboat", "greenhouse", "dynamite" 
    ], async(msg) => {
        createPending(msg.channel.id, msg.author, command)
    });
    
    Settings.add(command, {
        dTime: convertToMilliseconds({minutes: 5}),
        fixed_cd: true,
        emoji: "<:ruby:788422407677149234>"
    });

    const toBeRegistered = [
        {
            data: (user) => `${user.username}.{2} got.*?(?:log|fish|apple|banana|ruby|coins)`,
            preverif: "got",
            location: "content",
            process: defaultProcess
        },
        ...defaultCommands,
        {
            data: (user) => `${user.username}.{2} fights .{2}THE RUBY DRAGON`,
            preverif: "got",
            location: "content",
            process: defaultProcessWithMove
        },
        {
            data: (user) => `${user.username}.{2} ran away`,
            preverif: "ran",
            location: "content",
            process: defaultProcessWithMove
        },
        {
            data: (user) => `${user.username}.{2} sleeps.*?got 2`,
            preverif: "sleeps",
            location: "content",
            process: defaultProcessWithMove
        },
        {
            data: (user) => `${user.username}.{2} (?:cried|sleeps)`,
            preverif: "cried",
            location: "content",
            process: defaultProcess
        }
    ];

    Process.addCommands(command, toBeRegistered)
}