import { CommandHandler } from "../commandHandler.js";
import { createPending } from "../pending.js";
import { Preverification, Process, Settings } from "../process.js";
import { convertToMilliseconds } from "../utils.js";
import { defaultCommands, defaultCommandsPreverif, defaultProcess } from "./default.js";

const command = "weekly";

{
    CommandHandler.addTrigger("weekly", async(msg) => {
        createPending(msg.channel.id, msg.author, command);
    });

    const toBeRegistered = [
        ...defaultCommands,
        {
            data: {
                condition: (user) => `${user.username} — weekly`,
                location: "authorName",
            },
            process: defaultProcess
        }
    ];

    Process.addCommands(command, toBeRegistered)

    const preverif = [
        ["weekly", "authorName"],
        ...defaultCommandsPreverif
    ]

    Preverification.addCommandLinks(preverif, command);

    Settings.add(command, {
        dTime: convertToMilliseconds({days: 7}),
        fixed_cd: true,
        emoji: "<:star7:939934695662166048>"
    });
}