import { customizeCooldown, epicJailCommand } from "../operators/commands.js";
import { defaultProcess } from "../operators/operation.js";
import { contentStarProcess } from "../operators/usersUtils.js";
import { createPending } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { convertToMilliseconds } from "../system/utils.js";

const commands = {
    id: "adventure",
    list: [
        {
            data: [["found and killed", "found a", "but lost fighting"]],
            ...contentStarProcess(defaultProcess)
        },
        customizeCooldown("been on an adventure"),
        epicJailCommand
    ]
};

CommandHandler.addMultiplesTriggers(["adv", "adventure"], async(msg) => {
    createPending({
        msg: msg,
        commands: commands, 
    });
});

Settings.add(commands.id, {
    dTime: convertToMilliseconds({hours: 1}),
    fixed_cd: true,
    emoji: "<:sword:788416329601908746>"
});