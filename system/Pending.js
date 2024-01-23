import { MessageCollector } from "oceanic-collectors";
import { extendsMessage } from "../discord/discordUtils.js";
import { erpgId } from "../index.js";
import { checkCommandUser, checkData } from "./Commands.js";
import { stopStory } from "./rule.js";
import { convertToMilliseconds, deleteAllEmptyOnDepth, setPath, showDate } from "./utils.js";

export const pendings = {
    add(pending) {
        if(this?.[pending.user.id]?.[pending.commandId] !== undefined) {
            this[pending.user.id][pending.commandId].stop();
        }
        setPath(this, [pending.user.id, pending.commandId], pending);
    },
    remove(pending) {
        delete this[pending.user.id][pending.commandId];
    },
    deleteEmpty() {
        deleteAllEmptyOnDepth(this, 1);
    }
};

class Pending {
    constructor(user, channelId, commands, stack, users = [], timeOut = convertToMilliseconds({minutes: 5})) {
        console.log("createpending");
        this.user = user;
        this.commandId = commands?.id;
        this.commands = commands?.list;
        this.channelId = channelId;
        this.stack = stack;
        this.users = users;
        this.process = stopStory;
        this.collector = null;
        this.timeOut = timeOut;
    }

    filter(msg) {
        if(erpgId !== msg.author.id || this.channelId !== msg.channel.id) return false;
    
        const extendedMsg = extendsMessage(msg);
    
        const match = this.commands.find(c => {
            // console.log("[", c.location, ":", extendedMsg[c.location], "]");
            // console.log("commands :", c, "\n")
            return checkData(extendedMsg, c.data, c.location);
        });

        if(match === undefined) return false;
    
        if(match.user !== undefined && !checkCommandUser(extendedMsg, match.user, this.user)) return false;
    
        this.process = match.process.bind(match);
    
        return true;
    }

    start(message) {
        this.collector = new MessageCollector(message.client, message.channel, {filter: this.filter.bind(this), time: this.timeOut});
        this.stack.add(this);

        this.collector.on("collect", (msg) => {
            this.process(this, extendsMessage(msg));
        });

        this.collector.on("end", (_, reason) => {
            if(reason === "time") showDate("deleted", this.user.username, this.commandId);
            this.stack.remove(this, this.channelId);
        });
    }

    stop(reason = "user") {
        this.collector?.stop(reason);
    }
}

const createPendingBase = (stack) => ({msg, user = null, commands, users = [], timeOut = convertToMilliseconds({seconds: 20})}) => {
    const pending = new Pending(user ?? msg.author, msg.channel.id, commands, stack, users, timeOut);
    pending.start(msg);
    return pending;
}

export const createPending = createPendingBase(pendings);

export function deleteExpired() {
    pendings.deleteEmpty();
}