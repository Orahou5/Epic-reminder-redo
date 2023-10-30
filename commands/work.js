import { Pending } from "../Pending.js";
import { CommandHandler } from "../commandHandler.js";
import { insertReminder } from "../database.js";
import { Location } from "../discordUtils.js";
import { Display } from "../display.js";
import { Preverification, Process } from "../process.js";
import { stopStory } from "../rule.js";
import { showHoursMinutesSeconds } from "../utils.js";
import { cooldownCommand, epicJailCommand } from "./default.js";

CommandHandler.addMultiplesTriggers([  
    "chop", "fish", "pickup", "mine", 
    "axe", "net", "ladder", "pickaxe",
    "bowsaw", "boat", "tractor", "drill",
    "chainsaw", "bigboat", "greenhouse", "dynamite" 
], async(msg) => {
    Pending.addPending(msg.channel.id, msg.author, "work")
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
    cooldownCommand,
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
    epicJailCommand
];

Process.addCommands("work", toBeRegistered)

const preverif = [
    ["got", "content"],
    ["sleeps", "content"],
    ["ran", "content"],
    ["cried", "content"],
    ["cooldown", "authorName"],
    ["jail", "content"]
]

Preverification.addCommandLinks(preverif, "work");

Display.addDisplay(`__|user|__ It's time for <:ruby:788422407677149234>**WORK**<:ruby:788422407677149234> *desu*`, "work", "default");

function insertWork(soul, now, scenario_id) {
    console.log("inserting");
    showHoursMinutesSeconds("inserting work");
    insertReminder({
        discord_id: soul.user.id,
        command_id: "work",
        dTime: 5 * 60 * 1000,
        time: now,
        enabled: true,
        channel_id: soul.m.channel.id,
        message: Display.getDisplay(soul.user, "work", scenario_id),
        fixed_cd: true
    }).then(() => {
        console.log("inserted");
        
    }).catch((err) => { 
        console.log(err) 

        setTimeout(() => {
            insertWork(soul, now, scenario_id);
        }, 20 * 1000);
    });
}