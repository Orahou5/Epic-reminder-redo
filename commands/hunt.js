import { insertReminder } from "../database.js";
import { Location } from "../discordUtils.js";
import { Display } from "../display.js";
import { Preverification, Process } from "../process.js";
import { stopStory } from "../rule.js";
import { showHoursMinutesSeconds } from "../utils.js";
import { cooldownCommand, cryCommand, epicJailCommand} from "./default.js";

const toBeRegistered = [
    {
        scenario_id: "winFight",
        condition: (user) => `${user.username}\\*{2} found and killed`,
        place: (m) => Location.content(m),
        rule: async (soul, commandId) => stopStory(soul, commandId),
        save(soul, now) {
            insertHunt(soul, now, this.scenario_id)
        }
    },
    cooldownCommand,
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
    {
        scenario_id: "loseFight",
        condition: (user) => `${user.username}\\*{2} found a.*?but lost fighting`,
        place: (m) => Location.content(m),
        rule: async (soul, commandId) => stopStory(soul, commandId),
        save(soul, now) {
            insertHunt(soul, now, this.scenario_id)
        }
    },
    cryCommand(insertHunt),
    epicJailCommand
];

Process.addCommands("hunt", toBeRegistered)

const preverif = [
    ["pretends", "content"],
    ["together", "content"],
    ["fights", "content"],
    ["cried", "content"],
    ["found", "content"],
    ["cooldown", "authorName"],
    ["jail", "content"]
]

Preverification.addCommandLinks(preverif, "hunt");

Display.addDisplay(`__|user|__ It's time for <:sword_dragon:805446534673596436>**HUNT**<:sword_dragon:805446534673596436> *desu*`, "hunt", "default");

function insertHunt(soul, now, scenario_id) {
    console.log("inserting");
    showHoursMinutesSeconds("inserting hunt");
    insertReminder({
        discord_id: soul.user.id,
        command_id: "hunt",
        dTime: 60 * 1000,
        time: now,
        enabled: true,
        channel_id: soul.m.channel.id,
        message: Display.getDisplay(soul.user, "hunt", scenario_id),
        fixed_cd: true
    }).then(() => {
        console.log("inserted");
    }).catch((err) => { 
        console.log(err) 
    });
}