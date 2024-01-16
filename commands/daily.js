import { convertToMilliseconds } from "../scripts/utils.js";
import { createPending } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { defaultProcess } from "./commons/operation.js";
import { authorDashProcess } from "./commons/usersUtils.js";

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