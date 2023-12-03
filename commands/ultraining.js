import { CommandHandler } from "../commandHandler.js";
import { createPending } from "../pending.js";
import { Process, Settings } from "../process.js";
import { convertToMilliseconds } from "../utils.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { defaultProcess } from "./commons/process.js";

const command = "ultraining";

{
    CommandHandler.addMultiplesTriggers(["ultr", "ultraining"], async(msg) => {
        const args = msg.content.split(" ");

        if(args.length > 2 || ["p", "progress", "shop"].includes(args[2]?.toLowerCase())) return;

        createPending(msg.channel.id, msg.author, command)
    });

    Settings.add(command, {
        dTime: convertToMilliseconds({minutes: 15}),
        fixed_cd: true,
        emoji: "<:cyclo:940363035296555019>",
        command: "training"
    });

    const toBeRegistered = [
        customizeCooldown("trained already"),
        {
            data: ["usernameStar", "epic npc", "well done"],
            preverif: "well done",
            location: "description",
            process: defaultProcess
        },
        epicJailCommand
    ];

    Process.addCommands(command, toBeRegistered)
}