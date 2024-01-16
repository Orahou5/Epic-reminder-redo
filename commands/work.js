import { convertToMilliseconds } from "../scripts/utils.js";
import { createPending } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { contentStarProcess } from "./commons/default.js";
import { defaultProcess, processWithMove } from "./commons/operation.js";

const commands = {
    id: "work",
    list: [
        {
            data: ["got", ["log", "ruby", "coins", "fish", "apple", "banana"]],
            ...contentStarProcess(defaultProcess)
        },
        customizeCooldown("got some resources"),
        {
            data: [["fights **the ruby dragon**", "ran away"]],
            ...contentStarProcess(processWithMove)
        },
        {
            data: ["sleeps", "got 2"],
            ...contentStarProcess(processWithMove)
        },
        {
            data: [["cried", "sleeps"]],
            ...contentStarProcess(defaultProcess)
        },
        epicJailCommand,
    ]
};

CommandHandler.addMultiplesTriggers([  
    "chop", "fish", "pickup", "mine", 
    "axe", "net", "ladder", "pickaxe",
    "bowsaw", "boat", "tractor", "drill",
    "chainsaw", "bigboat", "greenhouse", "dynamite" 
], async(msg) => {
    createPending({
        msg: msg,
        commands: commands, 
        timeOut: convertToMilliseconds({seconds: 20})
    });
});

Settings.add(commands.id, {
    dTime: convertToMilliseconds({minutes: 5}),
    fixed_cd: true,
    emoji: "<:ruby:788422407677149234>"
});