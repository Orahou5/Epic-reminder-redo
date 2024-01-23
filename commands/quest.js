import { customizeCooldown, epicJailCommand } from "../operators/commands.js";
import { createDisplay } from "../operators/default.js";
import { defaultProcess, processCustom } from "../operators/operation.js";
import { authorDashProcess, contentMentionProcess, contentStarProcess } from "../operators/usersUtils.js";
import { createPending } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { stopStory } from "../system/rule.js";
import { convertToMilliseconds } from "../system/utils.js";

const commands = {
    id: "quest",
    list: [
        {
            data: ["got a **new quest**"],
            ...contentStarProcess(defaultProcess)
        },
        {
            data: ["you did not accept the quest"],
            ...contentMentionProcess(processCustom({dTime: convertToMilliseconds({hours: 1}), isFixed: true}))
        },
        {
            data: ["epic quest", ["rewards", "better luck next time"]],
            ...authorDashProcess("authorName=field0Name", processCustom({display: createDisplay("epic quest", ":horse_racing:")}))
        },
        customizeCooldown("claimed a quest"),
        {
            data: ["quest", "completed"],
            ...authorDashProcess("authorName=description", stopStory)
        },
        {
            data: ["epic quest cancelled"],
            ...contentMentionProcess(stopStory),
        },
        epicJailCommand
    ]
};

CommandHandler.addMultiplesTriggers(["quest", "epic"], async(msg) => {
    const args = msg.content.toLowerCase().split(" ");

    const bool = args.at(1) === "quest" && args.at(2) !== "cancel";
    const bool2 = args.at(1) === "epic" && args.at(2) === "quest";

    if(bool || bool2) {
        createPending({ 
            msg: msg, 
            commands: commands 
        });
    }
});

Settings.add(commands.id, {
    dTime: convertToMilliseconds({hours: 6}),
    fixed_cd: true,
    emoji: "<:lightscroll:826595062413525012>",
});