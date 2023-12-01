import { CommandHandler } from "../commandHandler.js";
import { getIdFromMentionString } from "../discordUtils.js";
import { createConnectedPending } from "../pending.js";
import { Process, Settings } from "../process.js";
import { convertToMilliseconds } from "../utils.js";
import { defaultCommands } from "./commons/commands.js";
import { defaultProcess, defaultProcessWithoutSave } from "./commons/process.js";

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
    
    Settings.add(command, {
        dTime: convertToMilliseconds({hours: 2}),
        fixed_cd: true,
        emoji: "<:crossed_sword:788431002510557214>"
    });

    const toBeRegistered = [
        {
            data: (user) => `${user.username}.*?boom`,
            preverif: "boom",
            location: "description",
            process: defaultProcess,
        },
        ...defaultCommands,
        {
            data: (user) => `${user.username}.{4} Duel cancelled`,
            preverif: "cancelled",
            location: "content",
            process: defaultProcessWithoutSave,
        },
    ];

    Process.addCommands(command, toBeRegistered)
}