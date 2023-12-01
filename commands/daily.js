import { CommandHandler } from "../commandHandler.js";
import { createPending } from "../pending.js";
import { Process, Settings } from "../process.js";
import { convertToMilliseconds } from "../utils.js";
import { defaultCommands } from "./commons/commands.js";
import { defaultProcess } from "./commons/process.js";

const command = "daily";

{
    CommandHandler.addTrigger("daily", async(msg) => {
        createPending(msg.channel.id, msg.author, command);
    });

    Settings.add(command, {
        dTime: convertToMilliseconds({days: 1}),
        fixed_cd: true,
        emoji: "<:daily:939925508186062848>"
    });

    const toBeRegistered = [
        ...defaultCommands,
        {
            data: (user) => `${user.username} — daily`,
            preverif: "daily",
            location: "authorName",
            process: defaultProcess
        }
    ];

    Process.addCommands(command, toBeRegistered)
}
