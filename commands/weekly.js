import { CommandHandler } from "../commandHandler.js";
import { createPending } from "../pending.js";
import { Process, Settings } from "../process.js";
import { convertToMilliseconds } from "../utils.js";
import { defaultCommands } from "./commons/commands.js";
import { defaultProcess } from "./commons/process.js";

const command = "weekly";

{
    CommandHandler.addTrigger("weekly", async(msg) => {
        createPending(msg.channel.id, msg.author, command);
    });

    Settings.add(command, {
        dTime: convertToMilliseconds({days: 7}),
        fixed_cd: true,
        emoji: "<:star7:939934695662166048>"
    });

    const toBeRegistered = [
        ...defaultCommands,
        {
            data: (user) => `${user.username} — weekly`,
            preverif: "weekly",
            location: "authorName",
            process: defaultProcess
        }
    ];

    Process.addCommands(command, toBeRegistered)
}