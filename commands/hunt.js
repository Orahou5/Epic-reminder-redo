import { CommandHandler } from "../commandHandler.js";
import { pendings } from "../pending copy.js";
import { createPending } from "../pending.js";
import { Process, Settings } from "../process.js";
import { convertToMilliseconds } from "../utils.js";
import { cryCommand, customizeCooldown, epicJailCommand, loseFight, winFight } from "./commons/commands.js";
import { defaultProcess, processWithMove } from "./commons/process.js";

const command = "hunt";

{
    CommandHandler.addTrigger("hunt", async(msg) => {
        const pending = createPending(msg.channel.id, msg.author, command);

        pendings.add(pending, msg.channel.id);

        console.log("hunt trigger", pendings);
    });

    Settings.add(command, {
        dTime: convertToMilliseconds({minutes: 1}),
        fixed_cd: true,
        emoji: "<:sword_dragon:805446534673596436>"
    });

    const toBeRegistered = [
        winFight,
        customizeCooldown("looked around"),
        {
            data: ["usernameStar", "hunting together!"],
            preverif: "together",
            location: "content",
            process: defaultProcess
        },
        {
            data: ["usernameStar", "found a"],
            preverif: "found a",
            location: "content",
            process: defaultProcess
        },
        {
            data: ["usernameStar", "fights the horde"],
            preverif: "fights",
            location: "content",
            process: defaultProcess
        },
        {
            data: ["usernameStar", "pretends"],
            preverif: "pretends",
            location: "content",
            process: processWithMove
        },
        loseFight,
        cryCommand,
        epicJailCommand
    ];

    Process.addCommands(command, toBeRegistered)
}