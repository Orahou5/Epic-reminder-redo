import { CommandHandler } from "../commandHandler.js";
import { createPending } from "../pending.js";
import { Process, Settings } from "../process.js";
import { convertToMilliseconds } from "../utils.js";
import { cryCommand, defaultCommands } from "./commons/commands.js";
import { defaultProcess } from "./commons/process.js";

const command = "farm";

{
    CommandHandler.addTrigger("farm", async(msg) => {
        createPending(msg.channel.id, msg.author, command);
    });

    const toBeRegistered = [
        {
            data: (user) => `${user.username}.{2} plants.*?seed`,
            preverif: "seed",
            location: "content",
            process: defaultProcess
        },
        ...defaultCommands,
        {
            data: (user) => `${user.username}.{2} HITS THE FLOOR WITH THEIR FISTS`,
            preverif: "hits",
            location: "content",
            process: defaultProcess
        },
        {
            data: (user) => `${user.username}.{2} is about to plant another seed`,
            preverif: "seed",
            location: "content",
            process: defaultProcess
        },
        cryCommand,
    ];

    Process.addCommands(command, toBeRegistered)

    Settings.add(command, {
        dTime: convertToMilliseconds({minutes: 10}),
        fixed_cd: true,
        emoji: ":egg:"
    });
}