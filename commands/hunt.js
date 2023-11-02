import { CommandHandler } from "../commandHandler.js";
import { Location } from "../discordUtils.js";
import { Display } from "../display.js";
import { createPending } from "../pending.js";
import { Preverification, Process } from "../process.js";
import { stopStory } from "../rule.js";
import { cryCommand, defaultCommands, defaultCommandsPreverif, insertReminderRetry, loseFight, winFight } from "./default.js";

const command = "hunt";

CommandHandler.addTrigger("hunt", async(msg) => {
    createPending(msg.channel.id, msg.author, command);
});

const toBeRegistered = [
    winFight(insertHunt),
    ...defaultCommands,
    {
        scenario_id: "fightTogether",
        condition: (user) => `${user.username}.*? are hunting together`,
        place: (m) => Location.content(m),
        rule: async (soul, commandId) => stopStory(soul, commandId),
        save(soul, now) {
            insertHunt(soul, now, this.scenario_id)
        }
    },
    {
        scenario_id: "zombieFight",
        condition: (user) => `${user.username}.{2} fights the horde`,
        place: (m) => Location.content(m),
        rule: async (soul, commandId) => stopStory(soul, commandId),
        save(soul, now) {
            insertHunt(soul, now, this.scenario_id)
        }
    },
    {
        scenario_id: "zombieJoin",
        condition: (user) => `${user.username}.{2} pretends`,
        place: (m) => Location.content(m),
        async rule(soul, commandId){
            ruleMove(soul);
            stopStory(soul, commandId);
        },
        save(soul, now) {
            insertHunt(soul, now, this.scenario_id)
        }
    },
    loseFight(insertHunt),
    cryCommand(insertHunt),
];

Process.addCommands(command, toBeRegistered)

const preverif = [
    ["pretends", "content"],
    ["together", "content"],
    ["fights", "content"],
    ["cried", "content"],
    ["found", "content"],
    ...defaultCommandsPreverif
]

Preverification.addCommandLinks(preverif, command);

Display.addDisplay(`__|user|__ It's time for <:sword_dragon:805446534673596436>**HUNT**<:sword_dragon:805446534673596436> *desu*`, command, "default");

function insertHunt(soul, now, scenario_id) {
    insertReminderRetry({
        discord_id: soul.user.id,
        command_id: command,
        dTime: 60 * 1000,
        time: now,
        enabled: true,
        channel_id: soul.m.channel.id,
        message: Display.getDisplay(soul.user, command, scenario_id),
        fixed_cd: true
    });
}