import { getMultiplesUsersFromMessage } from "../discord/discordUtils.js";
import { customizeCooldown, epicJailCommand } from "../operators/commands.js";
import { defaultProcess } from "../operators/operation.js";
import { authorDashProcess, contentStarProcess } from "../operators/usersUtils.js";
import { createPending } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { stopStory } from "../system/rule.js";
import { convertToMilliseconds } from "../system/utils.js";

const commands = {
    id: "duel",
    list: [
        {
            data: ["duel", ["reward", "nobody won"]],
            ...authorDashProcess("authorName=field0Value", defaultProcess),
        },
        customizeCooldown("duel recently"),
        {
            data: ["duel cancelled"],
            ...contentStarProcess(stopStory)
        },
        epicJailCommand
    ]
};

CommandHandler.addTrigger("duel", async(msg) => {
    const users = getMultiplesUsersFromMessage({
        msg,
        start: 2,
        max: 1
    });

    if(users === undefined) return;

    createPending({
        msg: msg,
        commands: commands,
        users: users,
        timeOut: convertToMilliseconds({minutes: 2})
    });
});

Settings.add(commands.id, {
    dTime: convertToMilliseconds({hours: 2}),
    fixed_cd: true,
    emoji: "<:crossed_sword:788431002510557214>"
});