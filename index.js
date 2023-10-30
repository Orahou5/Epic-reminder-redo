import "dotenv/config.js";
import { Client } from "oceanic.js";
import { Pending } from "./Pending.js";
import "./commands/hunt.js";
import "./database.js";
import { closeDatabase } from "./database.js";
import { Location } from "./discordUtils.js";
import { resolve } from "./process.js";
import { startTimeloop } from "./synchronizer.js";

export const client = new Client({ 
    auth: `Bot ${process.env.DISCORD_TOKEN_ERPG}`,
    gateway: {
        intents: ["GUILDS", "GUILD_MESSAGES", "MESSAGE_CONTENT"]
    }
});

const erpgId = "555955826880413696"

client.once("ready", async() => {
    console.log("Ready as", client.user.tag);
    startTimeloop();
});

client.on("messageCreate", async(msg) => {
    if(msg.author.bot && msg.author.id !== erpgId) return;

    if(msg.author.id === erpgId) {
        resolve(msg);
    }

    if(msg.content === "rpg hunt h") {
        console.log("pending");
        Pending.addPending(msg.channel.id, msg.author, "hunt")
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