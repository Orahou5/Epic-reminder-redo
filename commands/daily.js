import { customizeCooldown, epicJailCommand } from "../operators/commands.js";
import { defaultProcess } from "../operators/operation.js";
import { authorDashProcess } from "../operators/usersUtils.js";
import { createPending } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { convertToMilliseconds } from "../system/utils.js";

const commands = {
    id: "daily",
    list: [
        {
            data: ["daily"],
            ...authorDashProcess("authorName", defaultProcess),
        },
        customizeCooldown("daily rewards"),
        epicJailCommand
    ]
}

CommandHandler.addTrigger("daily", async(msg) => {
    createPending({
        msg: msg,
        commands: commands, 
    });
});

Settings.add(commands.id, {
    dTime: convertToMilliseconds({days: 1}),
    fixed_cd: true,
    emoji: "<:daily:939925508186062848>"
});