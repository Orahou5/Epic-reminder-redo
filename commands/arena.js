import { getMultiplesUsersFromMessage } from "../scripts/discordUtils.js";
import { createConnectedPending, createPending } from "../scripts/pending.js";
import { Process, Settings } from "../scripts/process.js";
import { convertToMilliseconds } from "../scripts/utils.js";
import { CommandHandler } from "../system/commandHandler.js";
import { createEvent, createEventNotJoin, customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { processConnected } from "./commons/process.js";

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

        createConnectedPending(msg.channel.id, msg.author, command, users);
    });

    CommandHandler.addTrigger("big", async(msg) => {
        const args = msg.content.split(" ");

        if(args.at(2) !== "arena") return;

        createPending(msg.channel.id, msg.author, command);
    });
    
    Settings.add(command, {
        dTime: convertToMilliseconds({hours: 24}),
        fixed_cd: true,
        emoji: ":stadium:",
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
            process: processConnected()
        },
        customizeCooldown("started an arena recently"),
        createEvent("big arena"),
        createEventNotJoin("big arena"),
        epicJailCommand
    ];

    Process.addCommands(command, toBeRegistered)
}