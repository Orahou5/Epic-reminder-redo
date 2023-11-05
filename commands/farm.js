import { CommandHandler } from "../commandHandler.js";
import { Location } from "../discordUtils.js";
import { Display } from "../display.js";
import { createPending } from "../pending.js";
import { Preverification, Process } from "../process.js";
import { stopStory } from "../rule.js";
import { cryCommand, defaultCommands, defaultCommandsPreverif, insertReminderRetry } from "./default.js";

const command = "farm";

{
    CommandHandler.addTrigger("farm", async(msg) => {
        createPending(msg.channel.id, msg.author, command);
    });

    const toBeRegistered = [
        {
            scenario_id: "plantFarm",
            condition: (user) => `${user.username}.{2} plants.*?seed`,
            place: (m) => Location.content(m),
            rule: async (soul, commandId) => stopStory(soul, commandId),
            save(soul, now) {
                insertFarm(soul, now, this.scenario_id)
            }
        },
        ...defaultCommands,
        {
            scenario_id: "farmFight",
            condition: (user) => `${user.username}.{2} HITS THE FLOOR WITH THEIR FISTS`,
            place: (m) => Location.content(m),
            rule: async (soul, commandId) => stopStory(soul, commandId),
            save(soul, now) {
                insertFarm(soul, now, this.scenario_id);
            },
        },
        {
            scenario_id: "farmAnother",
            condition: (user) => `${user.username}.{2} is about to plant another seed`,
            place: (m) => Location.content(m),
            rule: async (soul, commandId) => stopStory(soul, commandId),
            save(soul, now) {
                insertFarm(soul, now, this.scenario_id);
            },
        },
        cryCommand(insertFarm),
    ];

    Process.addCommands(command, toBeRegistered)

    const preverif = [
        ["seed", "content"],
        ["hits", "content"],
        ["cried", "content"],
        ...defaultCommandsPreverif
    ]

    Preverification.addCommandLinks(preverif, command);

    Display.addDisplay(`__|user|__ It's time for :egg:**FARM**:egg: *desu*`, command, "default");
}

function insertFarm(soul, now, scenario_id) {
    insertReminderRetry({
        discord_id: soul.user.id,
        command_id: command,
        dTime: 10 * 60 * 1000,
        time: now,
        enabled: true,
        channel_id: soul.m.channel.id,
        message: Display.getDisplay(soul.user, command, scenario_id),
        fixed_cd: true
    });
}