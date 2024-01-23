import { customizeCooldown, epicJailCommand } from "../operators/commands.js";
import { displayRaid, displayUpgrade } from "../operators/display.js";
import { processGuild } from "../operators/operation.js";
import { usernameStar } from "../operators/usersUtils.js";
import { createPending } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { convertToMilliseconds } from "../system/utils.js";

const commands = {
    id: "guild",
    list: [
        customizeCooldown("guild has already raided or been upgraded"), //TODO: Make one for entire guild
        {
            data: ["raided"],
            user: usernameStar("description"),
            location: "description",
            process: processGuild({display: displayRaid})
        },
        {
            data: ["guild", "upgrade", "95"],
            location: "description=field0Value",
            process: processGuild({display: displayRaid})
        },
        {
            data: ["guild", "upgrade"],
            location: "description",
            process: processGuild({display: displayUpgrade})
        },
        epicJailCommand
    ]
};

CommandHandler.addTrigger("guild", async(msg) => {
    const args = msg.content.toLowerCase().split(" ");

    if(args.at(2) !== "raid" && args.at(2) !== "upgrade") return;

    createPending({
        msg: msg,
        commands: commands,
    })
});

Settings.add(commands.id, {
    dTime: convertToMilliseconds({hours: 2}),
    fixed_cd: true,
    emoji: ":headstone:"
});