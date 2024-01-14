//import { Process, Settings } from "../scripts/process.js";
import { awaitMessages } from "oceanic-collectors";
import { extendsMessage } from "../discord/discordUtils.js";
import { erpgId } from "../index.js";
import { convertToMilliseconds } from "../scripts/utils.js";
import { checkCommandUser, checkData } from "../system/Commands.js";
import { createPendingUser } from "../system/Pending.js";
import { Settings } from "../system/Settings.js";
import { CommandHandler } from "../system/commandHandler.js";
import { epicJailCommand } from "./commons/commands.js";
import { defaultProcess, processWithMove } from "./commons/operation.js";
import { usernameStar } from "./commons/usersUtils.js";

const command = "hunt";

const commands = [
    customizeCooldown("looked around"),
    {
        data: [["found and killed", "hunting together!", "found a", "fights the horde", "but lost fighting", "cried"]],
        location: "content",
        user: usernameStar("content"),
        process: defaultProcess
    },
    {
        data: ["pretends"],
        location: "content",
        user: usernameStar("content"),
        process: processWithMove
    },
    epicJailCommand
];

const baseFilter = (commands) => (pending) => (msg) => {
    if(erpgId !== msg.author.id || pending.channelId !== msg.channel.id) return false;

    const extendedMsg = extendsMessage(msg);

    const checker = checkData.bind(null, extendedMsg);

    const match = commands.find(c => {
        return checker(c.data, c.location);
    });

    if(match === undefined) return false;

    if(match.user !== undefined && !checkCommandUser(extendedMsg, match.user, pending.user)) return false;

    pending.process = match.process.bind(match);

    return true;
}

const filter = baseFilter(commands);

CommandHandler.addTrigger("hunt", async(msg) => {
    const pending = createPendingUser({user: msg.author, commandId: command, channelId: msg.channel.id});

    if(pending === undefined) return;

    const messages = await awaitMessages(msg.client, msg.channel, {filter: filter(pending), max: 1, time: 10000});

    if(messages.length === 0) return;

    pending.process(pending, extendsMessage(messages.at(0)));
});

Settings.add(command, {
    dTime: convertToMilliseconds({minutes: 1}),
    fixed_cd: true,
    emoji: "<:sword_dragon:805446534673596436>"
});