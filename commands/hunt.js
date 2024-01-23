//import { Process, Settings } from "../scripts/process.js";
import { customizeCooldown, epicJailCommand } from "../operators/commands.js";
import { defaultProcess, processWithMove } from "../operators/operation.js";
import { contentStarProcess } from "../operators/usersUtils.js";
import { createPending } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { convertToMilliseconds } from "../system/utils.js";

const commands = {
    id: "hunt",
    list: [
        customizeCooldown("looked around"),
        {
            data: [["found and killed", "hunting together!", "found a", "fights the horde", "but lost fighting", "cried"]],
            ...contentStarProcess(defaultProcess)
        },
        {
            data: ["pretends"],
            ...contentStarProcess(processWithMove)
        },
        epicJailCommand
    ]
}

CommandHandler.addTrigger("hunt", async(msg) => {
    createPending({
        msg: msg,
        commands: commands, 
    });
});

Settings.add(commands.id, {
    dTime: convertToMilliseconds({minutes: 1}),
    fixed_cd: true,
    emoji: "<:sword_dragon:805446534673596436>"
});