import { CommandHandler } from "../commandHandler.js";
import { Location } from "../discordUtils.js";
import { Display } from "../display.js";
import { createPending } from "../pending.js";
import { Preverification, Process } from "../process.js";
import { stopStory } from "../rule.js";
import { defaultCommands, defaultCommandsPreverif, insertReminderRetry } from "./default.js";

const command = "work";

CommandHandler.addMultiplesTriggers([  
    "chop", "fish", "pickup", "mine", 
    "axe", "net", "ladder", "pickaxe",
    "bowsaw", "boat", "tractor", "drill",
    "chainsaw", "bigboat", "greenhouse", "dynamite" 
], async(msg) => {
    createPending(msg.channel.id, msg.author, command)
});

const toBeRegistered = [
    {
        scenario_id: "gotMaterials",
        condition: (user) => `${user.username}.{2} got.*?(?:log|fish|apple|banana|ruby|coins)`,
        place: (m) => Location.content(m),
        rule: async (soul, commandId) => stopStory(soul, commandId),
        save(soul, now) {
            insertWork(soul, now, this.scenario_id)
        }
    },
    ...defaultCommands,
    {
        scenario_id: "rubyDragonFight",
        condition: (user) => `${user.username}.{2} fights .{2}THE RUBY DRAGON`,
        place: (m) => Location.content(m),
        async rule(soul, commandId){
            ruleMove(soul);
            stopStory(soul, commandId);
        },
        save(soul, now) {
            insertWork(soul, now, this.scenario_id)
        }
    },
    {
        scenario_id: "rubyDragonRun",
        condition: (user) => `${user.username}.{2} ran away`,
        place: (m) => Location.content(m),
        async rule(soul, commandId){
            ruleMove(soul);
            stopStory(soul, commandId);
        },
        save(soul, now) {
            insertWork(soul, now, this.scenario_id)
        }
    },
    {
        scenario_id: "rubyDragonSleep",
        condition: (user) => `${user.username}.{2} sleeps.*?got 2`,
        place: (m) => Location.content(m),
        async rule(soul, commandId){
            ruleMove(soul);
            stopStory(soul, commandId);
        },
        save(soul, now) {
            insertWork(soul, now, this.scenario_id)
        }
    },
    {
        scenario_id: "workSleepCry",
        condition: (user) => `${user.username}.{2} (?:cried|sleeps)`,
        place: (m) => Location.content(m),
        rule: async (soul, commandId) => stopStory(soul, commandId),
        save(soul, now) {
            insertWork(soul, now, this.scenario_id)
        }
    },
];

Process.addCommands(command, toBeRegistered)

const preverif = [
    ["got", "content"],
    ["sleeps", "content"],
    ["ran", "content"],
    ["cried", "content"],
    ...defaultCommandsPreverif
]

Preverification.addCommandLinks(preverif, command);

Display.addDisplay(`__|user|__ It's time for <:ruby:788422407677149234>**WORK**<:ruby:788422407677149234> *desu*`, command, "default");

function insertWork(soul, now, scenario_id) {
    insertReminderRetry({
        discord_id: soul.user.id,
        command_id: command,
        dTime: 5 * 60 * 1000,
        time: now,
        enabled: true,
        channel_id: soul.m.channel.id,
        message: Display.getDisplay(soul.user, command, scenario_id),
        fixed_cd: true
    }, 20 * 1000);
}