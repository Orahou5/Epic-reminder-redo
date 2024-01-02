import { extractUserAndChannelId } from "../discord/discordUtils.js";
import { convertToMilliseconds } from "../scripts/utils.js";
import { commandsNoUser, commandsUser } from "../system/Commands.js";
import { createDoublePending } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { stopStory } from "../system/rule.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { defaultProcess } from "./commons/operation.js";

const command = "lootbox";

{
    CommandHandler.addTrigger("buy", async(msg) => {
        const args = msg.content.toLowerCase().split(" ");

        const bool = ["ed", "ep", "r", "u", "c"].includes(args.at(2)) && args.at(3) === "lb";
        const bool2 = ["edgy", "epic", "rare", "uncommon", "common"].includes(args.at(2)) && args.at(3) === "lootbox"

        console.log(bool, bool2);

        if(bool || bool2) {
            createDoublePending({...extractUserAndChannelId(msg), commandId: command})
        }
    });

    Settings.add(command, {
        dTime: convertToMilliseconds({hours: 3}),
        fixed_cd: true,
        emoji: "<:box:788407486515249200>"
    });

    commandsUser.addCommands(command, [
        customizeCooldown("bought a lootbox"),
        {
            data: ["you have to be level"],
            location: "content",
            process: stopStory
        },
        {
            data: ["are you trying to buy"],
            location: "content",
            process: stopStory
        },
        epicJailCommand
    ]);

    commandsNoUser.addCommands(command, [
        {
            data: ["lootbox", "successfully bought for"],
            preverif: "bought",
            location: "content",
            process: defaultProcess
        },
        {
            data: ["don't have enough money to buy this"],
            preverif: "money",
            location: "content",
            process: stopStory
        }
    ]);
}