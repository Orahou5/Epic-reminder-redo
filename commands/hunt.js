import { CommandHandler } from "../commandHandler.js";
import { createPending } from "../pending.js";
import { Preverification, Process, Settings } from "../process.js";
import { cryCommand, defaultCommands, defaultCommandsPreverif, defaultProcess, defaultProcessWithMove, loseFight, winFight } from "./default.js";

const command = "hunt";

{
    CommandHandler.addTrigger("hunt", async(msg) => {
        createPending(msg.channel.id, msg.author, command);
    });

    const toBeRegistered = [
        winFight,
        ...defaultCommands,
        {
            data: {
                condition: (user) => `${user.username}.*? are hunting together`,
                location: "content",
            },
            process: defaultProcess
        },
        {
            data: {
                condition: (user) => `${user.username}.{2} fights the horde`,
                location: "content",
            },
            process: defaultProcess
        },
        {
            data: {
                condition: (user) => `${user.username}.{2} pretends`,
                location: "content",
            },
            process: defaultProcessWithMove

        },
        loseFight,
        cryCommand,
    ];

    Process.addCommands(command, toBeRegistered)

    const preverif = [
        ["pretends", "content"],
        ["together", "content"],
        ["fights", "content"],
        ["cried", "content"],
        ["found", "content"],
        ...defaultCommandsPreverif
    ]

    Preverification.addCommandLinks(preverif, command);

    Settings.add(command, {
        dTime: 60 * 1000,
        fixed_cd: true,
        emoji: "<:sword_dragon:805446534673596436>"
    });
}