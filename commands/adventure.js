import { createPending } from "../scripts/pending.js";
import { commandsUser } from "../system/Commands.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { defaultProcess } from "./commons/operation.js";

const command = "adventure";

{
    CommandHandler.addMultiplesTriggers(["adv", "adventure"], async(msg) => {
        createPending(msg.channel.id, msg.author, command);
    });

    const toBeRegistered = [
        {
            data: [["found and killed", "found a", "but lost fighting"]],
            location: "content",
            process: defaultProcess
        },
        customizeCooldown("been on an adventure"),
        epicJailCommand
    ];

    commandsUser.addCommands(command, toBeRegistered);

    Settings.add(command, {
        dTime: 60 * 60 * 1000,
        fixed_cd: true,
        emoji: "<:sword:788416329601908746>"
    });
}