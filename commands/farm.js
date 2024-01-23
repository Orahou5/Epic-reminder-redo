import { cryCommand, customizeCooldown, epicJailCommand } from "../operators/commands.js";
import { defaultProcess } from "../operators/operation.js";
import { contentStarProcess } from "../operators/usersUtils.js";
import { createPending } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { convertToMilliseconds } from "../system/utils.js";

const commands = {
    id: "farm",
    list: [
        {
            data: ["plants", "seed"],
            ...contentStarProcess(defaultProcess)
        },
        customizeCooldown("farmed already"),
        {
            data: ["hits the floor with their fists"],
            ...contentStarProcess(defaultProcess)
        },
        {
            data: ["is about to plant another seed"],
            ...contentStarProcess(defaultProcess)
        },
        cryCommand,
        epicJailCommand
    ]
};

CommandHandler.addTrigger("farm", async(msg) => {
    createPending({
        msg: msg,
        commands: commands, 
    });
});

Settings.add(commands.id, {
    dTime: convertToMilliseconds({minutes: 10}),
    fixed_cd: true,
    emoji: ":egg:"
});