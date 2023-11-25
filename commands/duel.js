import { CommandHandler } from "../commandHandler.js";
import { getIdFromMentionString } from "../discordUtils.js";
import { createConnectedPending } from "../pending.js";
import { Preverification, Process, Settings } from "../process.js";
import { defaultCommands, defaultCommandsPreverif, defaultProcess, defaultProcessWithoutSave } from "./default.js";

const command = "duel";

{
    CommandHandler.addTrigger("duel", async(msg) => {
        const args  = msg.content.split(" ");

        if(args.length < 3) return;

        const otherUser = msg.mentions.users.find((user) => user.id === getIdFromMentionString(args.at(2)));

        if(otherUser === undefined) return;

        const users = [msg.author, otherUser];

        createConnectedPending(msg.channel.id, users, command);
    });

    const toBeRegistered = [
        {
            data: {
                condition: (user) => `${user.username}.*?boom`,
                location: "description",
            },
            process: defaultProcess,
        },
        ...defaultCommands,
        {
            data: {
                condition: (user) => `${user.username}.{4} Duel cancelled`,
                location: "content",
            },
            process: defaultProcessWithoutSave,
        },
    ];

    Process.addCommands(command, toBeRegistered)

    const preverif = [
        ["cancelled", "content"],
        ["boom", "description"],
        ...defaultCommandsPreverif
    ]

    Preverification.addCommandLinks(preverif, command);

    Settings.add(command, {
        dTime: 2 * 60 * 60 * 1000,
        fixed_cd: true,
        emoji: "<:crossed_sword:788431002510557214>"
    });
}