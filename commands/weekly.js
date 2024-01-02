import { extractUserAndChannelId } from "../discord/discordUtils.js";
import { convertToMilliseconds } from "../scripts/utils.js";
import { commandsUser } from "../system/Commands.js";
import { createPendingUser } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { defaultProcess } from "./commons/operation.js";

const command = "weekly";

{
    CommandHandler.addTrigger("weekly", async(msg) => {
        createPendingUser({...extractUserAndChannelId(msg), commandId: command})
    });

    Settings.add(command, {
        dTime: convertToMilliseconds({days: 7}),
        fixed_cd: true,
        emoji: "<:star7:939934695662166048>"
    });

    const toBeRegistered = [
        {
            data: ["weekly"],
            location: "authorName",
            process: defaultProcess
        },
        customizeCooldown("weekly rewards"),
        epicJailCommand
    ];

    commandsUser.addCommands(command, toBeRegistered);
}