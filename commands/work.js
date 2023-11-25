import { CommandHandler } from "../commandHandler.js";
import { createPending } from "../pending.js";
import { Preverification, Process, Settings } from "../process.js";
import { defaultCommands, defaultCommandsPreverif, defaultProcess, defaultProcessWithMove } from "./default.js";

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

    const toBeRegistered = [
        {
            data: {
                condition: (user) => `${user.username}.{2} got.*?(?:log|fish|apple|banana|ruby|coins)`,
                location: "content",
            },
            process: defaultProcess
        },
        ...defaultCommands,
        {
            data: {
                condition: (user) => `${user.username}.{2} fights .{2}THE RUBY DRAGON`,
                location: "content",
            },
            process: defaultProcessWithMove
        },
        {
            data: {
                condition: (user) => `${user.username}.{2} ran away`,
                location: "content",
            },
            process: defaultProcessWithMove
        },
        {
            data: {
                condition: (user) => `${user.username}.{2} sleeps.*?got 2`,
                location: "content",
            },
            process: defaultProcessWithMove
        },
        {
            data: {
                condition: (user) => `${user.username}.{2} (?:cried|sleeps)`,
                location: "content",
            },
            process: defaultProcess
        }
    ];

    Process.addCommands(command, toBeRegistered)

    const preverif = [
        ["got", "content"],
        ["sleeps", "content"],
        ["ran", "content"],
        ["cried", "content"],
        ...defaultCommandsPreverif
    ]

    Preverification.addCommandLinks(preverif, command);

    Settings.add(command, {
        dTime: 5 * 60 * 1000,
        fixed_cd: true,
        emoji: "<:ruby:788422407677149234>"
    });
}