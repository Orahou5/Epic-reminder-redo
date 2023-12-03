import { filterPending } from "./pending.js";
import { dirLog } from "./utils.js";

export const Process = {
    commands: {},

    addCommand(id, command) {
        if(this.commands[id] === undefined) {
            this.commands[id] = [];
        }
        this.commands[id].push(command);

        return this;
    },

    addCommands(id, commands) {
        if(this.commands[id] === undefined) {
            this.commands[id] = [];
        }
        this.commands[id].push(...commands);

        return this;
    },

    getCommand(id) {
        return this.commands[id];
    },

    scan(message) {
        return Object.entries(this.commands).reduce((acc, [id, commands]) => {
            const filteredCommands = commands.filter((command) => {
                return message[command.location].toLowerCase().includes(command.preverif)
            })
            if(filteredCommands.length > 0) {
                acc[id] = filteredCommands;
            }
            return acc;
        }, {});
    }
}

export const Settings = {
    settings: {},

    add(id, settings) {
        this.settings[id] = settings;
    },

    get(id) {
        return this.settings[id];
    }
}

const resolveAlias = {
    "usernameStar": (user) => `**${user.username}**`,
    "usernameDash": (user) => `${user.username} —`,
    "mention": (user) => user.mention,
}

function resolveMsg(msg, command, user) {
    const string = msg[command.location].toLowerCase();
    console.log(string)
    return command.data.every((data) => {
        return Array.isArray(data) ? 
        data.some((d) => string.includes(d)) : 
        string.includes(resolveAlias[data]?.(user) ?? data ); 
    })
    //return command.data.test(msg[command.location]) && command?.check?.(msg, user);
}

export function resolve(msg) {
    const now = Date.now();

    const object = filterPending(msg);

    if(object === undefined) return;

    object.pending.forEach((pending) => {
        const command = object.commands[pending.commandId].find((command) => {
            return resolveMsg(msg, command, pending.user)
            //return msg.regexResolve(command.data(pending.user), command.location);
        });

        console.log("resolve", pending?.user?.username, pending.commandId, command?.data);

        if(command === undefined) return;

        const soul = {
            user: pending.user, 
            m: msg
        }

        command.process(soul, pending.commandId, now);
    });
}