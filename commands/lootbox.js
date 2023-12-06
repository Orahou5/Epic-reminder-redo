import { CommandHandler } from "../commandHandler.js";
import { createPending } from "../pending.js";
import { Process, Settings } from "../process.js";
import { stopStory } from "../rule.js";
import { convertToMilliseconds } from "../utils.js";
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


    const toBeRegistered = [
        {
            data: ["lootbox", "successfully bought for"],
            preverif: "bought",
            location: "content",
            process: defaultProcess
        },
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
        {
            data: ["don't have enough money to buy this"],
            preverif: "money",
            location: "content",
            process: stopStory
        },
        epicJailCommand
    ];

    Process.addCommands(command, toBeRegistered)
}