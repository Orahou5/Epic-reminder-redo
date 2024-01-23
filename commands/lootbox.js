import { customizeCooldown, epicJailCommand } from "../operators/commands.js";
import { defaultProcess } from "../operators/operation.js";
import { contentMentionProcess } from "../operators/usersUtils.js";
import { createPending } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { stopStory } from "../system/rule.js";
import { convertToMilliseconds } from "../system/utils.js";

const commands = {
    id: "lootbox",
    list: [
        customizeCooldown("bought a lootbox"),
        {
            data: ["lootbox", "successfully bought for"],
            location: "content",
            process: defaultProcess
        },
        {
            data: ["don't have enough money to buy this"],
            location: "content",
            process: stopStory
        },
        {
            data: ["you have to be level"],
            ...contentMentionProcess(stopStory)
        },
        {
            data: ["are you trying to buy"],
            ...contentMentionProcess(stopStory)
        },
        epicJailCommand
    ]
};

CommandHandler.addTrigger("buy", async(msg) => {
    const args = msg.content.toLowerCase().split(" ");

    const bool = ["ed", "ep", "r", "u", "c"].includes(args.at(2)) && args.at(3) === "lb";
    const bool2 = ["edgy", "epic", "rare", "uncommon", "common"].includes(args.at(2)) && args.at(3) === "lootbox"

    console.log(bool, bool2);

    if(bool || bool2) {
        createPending({
            msg: msg,
            commands: commands, 
        });
    }
});

Settings.add(commands.id, {
    dTime: convertToMilliseconds({hours: 3}),
    fixed_cd: true,
    emoji: "<:box:788407486515249200>"
});