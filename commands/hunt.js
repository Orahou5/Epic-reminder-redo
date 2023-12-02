import { CommandHandler } from "../commandHandler.js";
import { createPending } from "../pending.js";
import { Process, Settings } from "../process.js";
import { convertToMilliseconds } from "../utils.js";
import { cooldownPersonalization, cryCommand, epicJailCommand, loseFight, winFight } from "./commons/commands.js";
import { defaultProcess, defaultProcessWithMove } from "./commons/process.js";

const command = "hunt";

{
    CommandHandler.addTrigger("hunt", async(msg) => {
        createPending(msg.channel.id, msg.author, command);
    });

    Settings.add(command, {
        dTime: convertToMilliseconds({minutes: 1}),
        fixed_cd: true,
        emoji: "<:sword_dragon:805446534673596436>"
    });

    const toBeRegistered = [
        winFight,
        cooldownPersonalization("looked around"),
        {
            data: (user) => `${user.username}.*? are hunting together`,
            preverif: "together",
            location: "content",
            process: defaultProcess
        },
        {
            data: (user) => `${user.username}\\*{2} found a`,
            preverif: "found a",
            location: "content",
            process: defaultProcess
        },
        {
            data: (user) => `${user.username}.{2} fights the horde`,
            preverif: "fights",
            location: "content",
            process: defaultProcess
        },
        {
            data: (user) => `${user.username}.{2} pretends`,
            preverif: "pretends",
            location: "content",
            process: defaultProcessWithMove
        },
        loseFight,
        cryCommand,
        epicJailCommand
    ];

    Process.addCommands(command, toBeRegistered)
}