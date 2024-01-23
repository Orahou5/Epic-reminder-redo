import { customizeCooldown, epicJailCommand } from "../operators/commands.js";
import { defaultProcess } from "../operators/operation.js";
import { authorDashProcess } from "../operators/usersUtils.js";
import { createPending } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { convertToMilliseconds } from "../system/utils.js";

const commands = {
    id: "weekly",
    list: [
        {
            data: ["weekly"],
            ...authorDashProcess("authorName", defaultProcess),
        },
        customizeCooldown("weekly rewards"),
        epicJailCommand
    ]
}

CommandHandler.addTrigger("weekly", async(msg) => {
    createPending({
        msg: msg,
        commands: commands, 
    });
});

Settings.add(commands.id, {
    dTime: convertToMilliseconds({days: 7}),
    fixed_cd: true,
    emoji: "<:star7:939934695662166048>"
});
