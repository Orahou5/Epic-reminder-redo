import { CommandHandler } from "../commandHandler.js";
import { getMultiplesUsersFromMessage } from "../discordUtils.js";
import { createPending } from "../pending.js";
import { Process, Settings } from "../process.js";
import { convertToMilliseconds } from "../utils.js";
import { createEvent, customizeCooldown, epicJailCommand, eventNotJoin } from "./commons/commands.js";
import { defaultProcess } from "./commons/process.js";

const command = "dungeon";

{
    CommandHandler.addTrigger("miniboss", async(msg) => {
        const users = getMultiplesUsersFromMessage({
            msg,
            start: 2,
            min: 0,
            max: 10
        });

        if(users === undefined) return;

        createConnectedPending(msg.channel.id, users, command);
    });

    CommandHandler.addTrigger("minintboss", async(msg) => {
        createPending(msg.channel.id, msg.author, command);
    });
    
    Settings.add(command, {
        dTime: convertToMilliseconds({hours: 12}),
        fixed_cd: true,
        emoji: "<:fire_sacrifice:1148177713086083112>",
    });

    Settings.add("minin'tboss", {
        dTime: convertToMilliseconds({days: 4}),
        fixed_cd: true,
        emoji: "<:red_deer:940354118541774879>",
    });

    const toBeRegistered = [
        {
            data: ["usernameDash", "miniboss", "defeated"],
            preverif: "miniboss",
            location: "authorName=title",
            process: defaultProcess
        },
        customizeCooldown("fight with a boss recently"),
        createEvent("minin'tboss"),
        eventNotJoin,
        epicJailCommand
    ];

    Process.addCommands(command, toBeRegistered)
}