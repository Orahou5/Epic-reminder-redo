import { getMultiplesUsersFromMessage } from "../discord/discordUtils.js";
import { createEvent, createEventNotJoin, customizeCooldown, epicJailCommand } from "../operators/commands.js";
import { createDisplay } from "../operators/default.js";
import { processCustom } from "../operators/operation.js";
import { authorDashProcess } from "../operators/usersUtils.js";
import { createPending } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { convertToMilliseconds } from "../system/utils.js";

const commands = {
    id: "dungeon",
    list: [
        {
            data: ["miniboss", "defeated"],
            ...authorDashProcess(
                "authorName=title", 
                processCustom({display: createDisplay("miniboss", "<:fire_sacrifice:1148177713086083112>")})
            )
        },
        customizeCooldown("fight with a boss recently"),
        createEvent("minin'tboss"),
        createEventNotJoin("minin'tboss"),
        epicJailCommand
    ]
};

CommandHandler.addTrigger("miniboss", async(msg) => {
    const users = getMultiplesUsersFromMessage({
        msg,
        start: 2,
        min: 0,
        max: 10
    });

    if(users === undefined) return;

    createPending({
        msg: msg,
        commands: commands, 
        users: users,
        timeOut: convertToMilliseconds({minutes: 18})
    })
});

CommandHandler.addTrigger("minintboss", async(msg) => {
    createPending({
        msg: msg,
        commands: commands,
        timeOut: convertToMilliseconds({minutes: 18})
    })
});

Settings.add(commands.id, {
    dTime: convertToMilliseconds({hours: 12}),
    fixed_cd: true,
    emoji: "<:fire_sacrifice:1148177713086083112>",
});

Settings.add("minin'tboss", {
    dTime: convertToMilliseconds({days: 4}),
    fixed_cd: true,
    emoji: "<:red_deer:940354118541774879>",
});