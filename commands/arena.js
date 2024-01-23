import { getMultiplesUsersFromMessage } from "../discord/discordUtils.js";
import { createEvent, createEventNotJoin, customizeCooldown, epicJailCommand } from "../operators/commands.js";
import { defaultProcess } from "../operators/operation.js";
import { usernameArena } from "../operators/usersUtils.js";
import { createPending } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { convertToMilliseconds } from "../system/utils.js";

const commands = {
    id: "arena",
    list: [
        {
            data: [":arenacookie:", "**reward**"],
            user: usernameArena("field1Value"),
            location: "field1Value",
            process: defaultProcess
        },
        customizeCooldown("started an arena recently"),
        createEvent("big arena"),
        createEventNotJoin("big arena", false),
        epicJailCommand
    ]   
};

CommandHandler.addTrigger("arena", async(msg) => {
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

CommandHandler.addTrigger("big", async(msg) => {
    const args = msg.content.split(" ");

    if(args.at(2) !== "arena") return;

    createPending({
        msg: msg,
        commands: commands,
        timeOut: convertToMilliseconds({minutes: 18})
    })
});

Settings.add(commands.id, {
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