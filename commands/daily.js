import { CommandHandler } from "../commandHandler.js";
import { createPending } from "../pending.js";
import { Preverification, Process, Settings } from "../process.js";
import { convertToMilliseconds } from "../utils.js";
import { defaultCommands, defaultCommandsPreverif, defaultProcess } from "./default.js";

const command = "daily";

{
    CommandHandler.addTrigger("daily", async(msg) => {
        createPending(msg.channel.id, msg.author, command);
    });

    const toBeRegistered = [
        ...defaultCommands,
        {
            data: {
                condition: (user) => `${user.username} — daily`,
                location: "authorName",
            },
            process: defaultProcess
        }
    ];

    Process.addCommands(command, toBeRegistered)

    const preverif = [
        ["daily", "authorName"],
        ...defaultCommandsPreverif
    ]

    Preverification.addCommandLinks(preverif, command);

    Settings.add(command, {
        dTime: convertToMilliseconds({days: 1}),
        fixed_cd: true,
        emoji: "<:daily:939925508186062848>"
    });
}