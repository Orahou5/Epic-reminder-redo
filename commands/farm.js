import { createPending } from "../scripts/pending.js";
import { Process, Settings } from "../scripts/process.js";
import { convertToMilliseconds } from "../scripts/utils.js";
import { CommandHandler } from "../system/commandHandler.js";
import { cryCommand, customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { defaultProcess } from "./commons/process.js";

const command = "farm";

{
    CommandHandler.addTrigger("farm", async(msg) => {
        createPending(msg.channel.id, msg.author, command);
    });

    const toBeRegistered = [
        {
            data: ["usernameStar", "plants", "seed"],
            preverif: "seed",
            location: "content",
            process: defaultProcess
        },
        customizeCooldown("farmed already"),
        {
            data: ["usernameStar", "hits the floor with their fists"],
            preverif: "hits",
            location: "content",
            process: defaultProcess
        },
        {
            data: ["usernameStar", "is about to plant another seed"],
            preverif: "seed",
            location: "content",
            process: defaultProcess
        },
        cryCommand,
        epicJailCommand
    ];

    Process.addCommands(command, toBeRegistered)

    Settings.add(command, {
        dTime: convertToMilliseconds({minutes: 10}),
        fixed_cd: true,
        emoji: ":egg:"
    });
}