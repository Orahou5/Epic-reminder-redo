import { CommandHandler } from "../commandHandler.js";
import { createPending } from "../pending.js";
import { Process, Settings } from "../process.js";
import { customizeCooldown, epicJailCommand, loseFight, winFight } from "./commons/commands.js";

const command = "adventure";

{
    CommandHandler.addMultiplesTriggers(["adv", "adventure"], async(msg) => {
        createPending(msg.channel.id, msg.author, command);
    });

    const toBeRegistered = [
        winFight,
        customizeCooldown("been on an adventure"),
        loseFight,
        epicJailCommand
    ];

    Process.addCommands(command, toBeRegistered)

    Settings.add(command, {
        dTime: 60 * 60 * 1000,
        fixed_cd: true,
        emoji: "<:sword:788416329601908746>"
    });
}