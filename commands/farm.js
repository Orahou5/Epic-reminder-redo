import { CommandHandler } from "../commandHandler.js";
import { createPending } from "../pending.js";
import { Preverification, Process, Settings } from "../process.js";
import { cryCommand, defaultCommands, defaultCommandsPreverif, defaultProcess } from "./default.js";

const command = "farm";

{
    CommandHandler.addTrigger("farm", async(msg) => {
        createPending(msg.channel.id, msg.author, command);
    });

    const toBeRegistered = [
        {
            data: {
                condition: (user) => `${user.username}.{2} plants.*?seed`,
                location: "content",
            },
            process: defaultProcess
        },
        ...defaultCommands,
        {
            data: {
                condition: (user) => `${user.username}.{2} HITS THE FLOOR WITH THEIR FISTS`,
                location: "content",
            },
            process: defaultProcess
        },
        {
            data: {
                condition: (user) => `${user.username}.{2} is about to plant another seed`,
                location: "content",
            },
            process: defaultProcess
        },
        cryCommand,
    ];

    Process.addCommands(command, toBeRegistered)

    const preverif = [
        ["seed", "content"],
        ["hits", "content"],
        ["cried", "content"],
        ...defaultCommandsPreverif
    ]

    Preverification.addCommandLinks(preverif, command);

    Settings.add(command, {
        dTime: 10 * 60 * 1000,
        fixed_cd: true,
        emoji: ":egg:"
    });
}