import { convertToMilliseconds } from "../scripts/utils.js";
import { commandsUser } from "../system/Commands.js";
import { createPendingUser } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { ruleSendTraining } from "../system/rule.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { createDisplay } from "./commons/default.js";
import { defaultProcess, processCustom, processPetHelper, processTrainingPetHelper } from "./commons/operation.js";

const command = "training";

{
    CommandHandler.addMultiplesTriggers(["training", "tr", "ultr", "ultraining"], async(msg) => {
        const args = msg.content.split(" ");

        if(["ultr", "ultraining"].includes(args[1].toLowerCase()) && ["p", "progress", "shop", "buy"].includes(args[2]?.toLowerCase())) return;

        createPendingUser({user: msg.author, commandId: command, channelId: msg.channel.id})
    });

    Settings.add(command, {
        dTime: convertToMilliseconds({minutes: 15}),
        fixed_cd: true,
        emoji: "<:nekohappy:805866551370448926>",
    });

    const toBeRegistered = [
        customizeCooldown("trained already"),
        {
            data: ["epic npc", "well done"],
            location: "description",
            process: processCustom({display: createDisplay("ultraining", "<:cyclo:940363035296555019>")})
        },
        {
            data: ["is training"],
            location: "content",
            process : ruleSendTraining
        },
        {
            data: ["well done", "earned"],
            location: "content",
            process: processTrainingPetHelper
        },
        {
            data: ["better luck next time"],
            location: "content",
            process: defaultProcess
        },
        epicJailCommand
    ];

    // Process.addCommands(command, toBeRegistered)
    commandsUser.addCommands(command, toBeRegistered);

    commandsUser.addCommand("pethelper", {
        data: ["is approaching"],
        location: "field0Name",
        process: processPetHelper
    })
}