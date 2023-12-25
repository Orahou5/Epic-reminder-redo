import { createPending } from "../scripts/pending.js";
import { Process, Settings } from "../scripts/process.js";
import { convertToMilliseconds } from "../scripts/utils.js";
import { CommandHandler } from "../system/commandHandler.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
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
        {
            data: ["usernameDash", "weekly"],
            preverif: "weekly",
            location: "authorName",
            process: defaultProcess
        },
        customizeCooldown("weekly rewards"),
        epicJailCommand
    ];

    Process.addCommands(command, toBeRegistered)
}