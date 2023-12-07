import { CommandHandler } from "../commandHandler.js";
import { getMultiplesUsersFromMessage } from "../discordUtils.js";
import { createConnectedPending, createPending } from "../pending.js";
import { Process, Settings } from "../process.js";
import { convertToMilliseconds } from "../utils.js";
import { createEvent, createEventNotJoin, customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { defaultProcess } from "./commons/process.js";

const command = "arena";

{
    CommandHandler.addTrigger("arena", async(msg) => {
        const users = getMultiplesUsersFromMessage({
            msg,
            start: 2,
            min: 0,
            max: 10
        });

        if(users === undefined) return;

        createConnectedPending(msg.channel.id, users, command);
    });

    CommandHandler.addTrigger("big", async(msg) => {
        const args = msg.content.split(" ");

        if(args.at(2) !== "arena") return;

        createPending(msg.channel.id, msg.author, command);
    });
    
    Settings.add(command, {
        dTime: convertToMilliseconds({hours: 24}),
        fixed_cd: true,
        emoji: "<:fire_sacrifice:1148177713086083112>",
    });

    Settings.add("big arena", {
        dTime: convertToMilliseconds({days: 4}),
        fixed_cd: true,
        emoji: "<:sword_right:985477769624420353>",
        emoji2: "<:sword_left:985477768672325652>"
    });

    const toBeRegistered = [
        {
            data: ["username", ":arenacookie:", "**reward**"],
            preverif: "reward",
            location: "field1Value",
            process: defaultProcess
        },
        customizeCooldown("started an arena recently"),
        createEvent("big arena"),
        createEventNotJoin("big arena"),
        epicJailCommand
    ];

    Process.addCommands(command, toBeRegistered)
}