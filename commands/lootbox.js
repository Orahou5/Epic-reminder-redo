import { createPending } from "../scripts/pending.js";
import { Process, Settings } from "../scripts/process.js";
import { convertToMilliseconds } from "../scripts/utils.js";
import { CommandHandler } from "../system/commandHandler.js";
import { stopStory } from "../system/rule.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { defaultProcess } from "./commons/process.js";

const command = "lootbox";

{
    CommandHandler.addTrigger("buy", async(msg) => {
        const args = msg.content.toLowerCase().split(" ");

        const bool = ["ed", "ep", "r", "u", "c"].includes(args.at(2)) && args.at(3) === "lb";
        const bool2 = ["edgy", "epic", "rare", "uncommon", "common"].includes(args.at(2)) && args.at(3) === "lootbox"

        console.log(bool, bool2);

        if(bool || bool2) {
            createPending(msg.channel.id, msg.author, command);
        }
    });

    Settings.add(command, {
        dTime: convertToMilliseconds({hours: 3}),
        fixed_cd: true,
        emoji: "<:box:788407486515249200>"
    });

    Process.addCommands(command, [
        customizeCooldown("bought a lootbox"),
        {
            data: ["mention", "you have to be level"],
            preverif: "be level",
            location: "content",
            process: stopStory
        },
        {
            data: ["mention", "are you trying to buy"],
            preverif: "buy",
            location: "content",
            process: stopStory
        },
        epicJailCommand
    ], true);

    Process.addCommands(command, [
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
    ], false);
}