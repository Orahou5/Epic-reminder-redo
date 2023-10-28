import { insertReminder } from "../database.js";
import { Process } from "../process.js";
import { stopStory } from "../rule.js";
import { cooldownCommand, cryCommand, epicJailCommand} from "./default.js";


const toBeRegistered = [
    {
        scenario_id: "winFight",
        condition: (username) => `${username}\\*{2} found and killed`,
        place: (m) => Location.content(m),
        rule: async (soul, commandId) => stopStory(soul, commandId),
        save(soul, now) {
            insertHunt(soul, now, this.scenario_id)
        }
    },
    {
        scenario_id: "loseFight",
        condition: (username) => `${username}\\*{2} found a.*?but lost fighting`,
        place: (m) => Location.content(m),
        rule: async (soul, commandId) => stopStory(soul, commandId),
        save(soul, now) {
            insertHunt(soul, now, this.scenario_id)
        }
    },
    {
        scenario_id: "zombieCry",
        condition: (username) => `${username}.{2} cried`,
        place: (m) => Location.content(m),
        rule: async (soul, commandId) => stopStory(soul, commandId),
        save(soul, now) {
            insertHunt(soul, now, this.scenario_id)
        }
    },
    cryCommand(insertHunt),
    {
        scenario_id: "zombieFight",
        condition: (username) => `${username}.{2} fights the horde`,
        place: (m) => Location.content(m),
        rule: async (soul, commandId) => stopStory(soul, commandId),
        save(soul, now) {
            insertHunt(soul, now, this.scenario_id)
        }
    },
    {
        scenario_id: "zombieJoin",
        condition: (username) => `${username}.{2} pretends`,
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
        scenario_id: "fightTogether",
        condition: (username) => `${username}.*? are hunting together`,
        place: (m) => Location.content(m),
        rule: async (soul, commandId) => stopStory(soul, commandId),
        save(soul, now) {
            insertHunt(soul, now, this.scenario_id)
        }
    },
    cooldownCommand,
    epicJailCommand
];

Process.addCommands("hunt", toBeRegistered)

function insertHunt(soul, now, scenario_id) {
    insertReminder({
        discord_id: soul.user.id,
        command_id: "hunt",
        dTime: 60 * 1000,
        time: now,
        enabled: true,
        channel_id: soul.m.channel.id,
        scenario_id,
        fixed_cd: false
    });
}