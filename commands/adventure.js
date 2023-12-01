import { CommandHandler } from "../commandHandler.js";
import { createPending } from "../pending.js";
import { Process, Settings } from "../process.js";
import { defaultCommands, loseFight, winFight } from "./commons/commands.js";

const command = "adventure";

{
    CommandHandler.addMultiplesTriggers(["adv", "adventure"], async(msg) => {
        createPending(msg.channel.id, msg.author, command);
    });

    const toBeRegistered = [
        winFight,
        ...defaultCommands,
        loseFight,
    ];

    Process.addCommands(command, toBeRegistered)

    Settings.add(command, {
        dTime: 60 * 60 * 1000,
        fixed_cd: true,
        emoji: "<:sword:788416329601908746>"
    });
}