import { CommandHandler } from "../commandHandler.js";
import { getMultiplesUsersFromMessage } from "../discordUtils.js";
import { createConnectedPending, createPending } from "../pending.js";
import { Process, Settings } from "../process.js";
import { convertToMilliseconds } from "../utils.js";
import { createEvent, createEventNotJoin, customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { createDisplay } from "./commons/default.js";
import { processConnected } from "./commons/process.js";

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

        createConnectedPending(msg.channel.id, msg.author, command, users);
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
            process: processConnected({display: createDisplay("miniboss", "<:fire_sacrifice:1148177713086083112>")}),
        },
        customizeCooldown("fight with a boss recently"),
        createEvent("minin'tboss"),
        createEventNotJoin("minin'tboss"),
        epicJailCommand
    ];

    Process.addCommands(command, toBeRegistered)
}