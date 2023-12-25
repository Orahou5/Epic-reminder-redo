import { createPending } from "../scripts/pending.js";
import { Process, Settings } from "../scripts/process.js";
import { convertToMilliseconds } from "../scripts/utils.js";
import { CommandHandler } from "../system/commandHandler.js";
import { ruleSendTraining } from "../system/rule.js";
import { customizeCooldown, epicJailCommand } from "./commons/commands.js";
import { createDisplay } from "./commons/default.js";
import { defaultProcess, processCustom, processPetHelper, processTrainingPetHelper } from "./commons/process.js";

const command = "training";

{
    CommandHandler.addMultiplesTriggers(["training", "tr", "ultr", "ultraining"], async(msg) => {
        const args = msg.content.split(" ");

        if(["ultr", "ultraining"].includes(args[1].toLowerCase()) && ["p", "progress", "shop", "buy"].includes(args[2]?.toLowerCase())) return;

        createPending(msg.channel.id, msg.author, command)
    });

    Settings.add(command, {
        dTime: convertToMilliseconds({minutes: 15}),
        fixed_cd: true,
        emoji: "<:nekohappy:805866551370448926>",
    });

    const toBeRegistered = [
        customizeCooldown("trained already"),
        {
            data: ["usernameStar", "epic npc", "well done"],
            preverif: "well done",
            location: "description",
            process: processCustom({display: createDisplay("ultraining", "<:cyclo:940363035296555019>")})
        },
        {
            data: ["usernameStar", "is training"],
            preverif: "is training",
            location: "content",
            process : ruleSendTraining
        },
        {
            data: ["usernameStar", "well done", "earned"],
            preverif: "well done",
            location: "content",
            process: processTrainingPetHelper
        },
        {
            data: ["usernameStar", "better luck next time"],
            preverif: "luck",
            location: "content",
            process: defaultProcess
        },
        epicJailCommand
    ];

    Process.addCommands(command, toBeRegistered)

    Process.addCommand("pethelper", {
        data: ["usernameStar", "is approaching"],
        preverif: "suddenly",
        location: "field0Name",
        process: processPetHelper
    })
}