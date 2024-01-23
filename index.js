import "dotenv/config.js";
import { Client } from "oceanic.js";
import "./database/database.js";
import { closeDatabase, unpauseAllReminders } from "./database/database.js";
import { CommandHandler } from "./system/commandHandler.js";
import "./system/imported.js";
import { startTimeloop } from "./system/synchronizer.js";

export const client = new Client({ 
    auth: `Bot ${process.env.DISCORD_TOKEN_ERPG}`,
    gateway: {
        intents: ["GUILDS", "GUILD_MESSAGES", "MESSAGE_CONTENT"]
    }
});

export const erpgId = "555955826880413696"

client.once("ready", async() => {
    console.log("Ready as", client.user.tag);
    unpauseAllReminders();
    startTimeloop();
});

client.on("messageCreate", async(msg) => {
    if(msg.author.bot && msg.author.id !== erpgId) return;

    //console.log("memberRole", msg.member.roles);
    // dirLog(msg.embeds);

    /*if(msg.author.id === erpgId) {
        const extendedMsg = extendsMessage(msg);
        resolve(extendedMsg);
    }*/

    if(msg.content.startsWith("rpg")) {
        console.log("\n\nstart")
        CommandHandler.handle(msg);
    }
})

/*client.on("messageUpdate", async(newMsg, oldMsg) => {
    updateAwaiting(newMsg);
})
*/

client.on("error", (err) => {
    console.error("Something Broke!", err);
});

function cleanUp(){
    process.exit(0)
}

function signalHandler(signal) {
    closeDatabase(cleanUp);
}

process.on('SIGINT', signalHandler)
process.on('SIGTERM', signalHandler)
process.on('SIGQUIT', signalHandler)

client.connect();