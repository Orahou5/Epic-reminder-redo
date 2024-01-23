import { customizeCooldown, epicJailCommand } from "../operators/commands.js";
import { createDisplay } from "../operators/default.js";
import { defaultProcess, processCustom, processTrainingPetHelper } from "../operators/operation.js";
import { contentStarProcess, usernameStar } from "../operators/usersUtils.js";
import { createPending } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { ruleSendTraining } from "../system/rule.js";
import { convertToMilliseconds } from "../system/utils.js";

const commands = {
    id: "training",
    list: [
        customizeCooldown("trained already"),
        {
            data: ["epic npc", "well done"],
            location: "description",
            user: usernameStar("description"),
            process: processCustom({display: createDisplay("ultraining", "<:cyclo:940363035296555019>")})
        },
        {
            data: ["is training"],
            ...contentStarProcess(ruleSendTraining)
        },
        {
            data: ["well done", "earned"],
            ...contentStarProcess(processTrainingPetHelper)
        },
        {
            data: ["better luck next time"],
            ...contentStarProcess(defaultProcess)
        },
        epicJailCommand
    ]
}

CommandHandler.addMultiplesTriggers(["training", "tr", "ultr", "ultraining"], async(msg) => {
    const args = msg.content.split(" ");

    if(["ultr", "ultraining"].includes(args[1].toLowerCase()) && ["p", "progress", "shop", "buy"].includes(args[2]?.toLowerCase())) return;

    createPending({ 
        msg: msg, 
        commands: commands 
    });
});

Settings.add(commands.id, {
    dTime: convertToMilliseconds({minutes: 15}),
    fixed_cd: true,
    emoji: "<:nekohappy:805866551370448926>",
});