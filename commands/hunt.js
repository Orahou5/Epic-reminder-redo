//import { Process, Settings } from "../scripts/process.js";
import { convertToMilliseconds } from "../scripts/utils.js";
import { commandsUser } from "../system/Commands.js";
import { createPendingUser } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { defaultProcess, processWithMove } from "./commons/operation.js";

const command = "hunt";

{
    CommandHandler.addTrigger("hunt", async(msg) => {
        //createPending(msg.channel.id, msg.author, command);

        createPendingUser(msg.author, command, msg.channel.id);
    });

    Settings.add(command, {
        dTime: convertToMilliseconds({minutes: 1}),
        fixed_cd: true,
        emoji: "<:sword_dragon:805446534673596436>"
    });

    const toBeRegistered = [
        customizeCooldown("looked around"),
        {
            data: [["found and killed", "hunting together!", "found a", "fights the horde", "but lost fighting", "cried"]],
            location: "content",
            process: defaultProcess
        },
        {
            data: ["pretends"],
            location: "content",
            process: processWithMove
        },
        epicJailCommand
    ];

    commandsUser.addCommands(command, toBeRegistered);
}