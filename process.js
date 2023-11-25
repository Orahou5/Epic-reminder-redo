import { filterPending } from "./pending.js";

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
    }
}

export const Preverification = {
    commandsLink: [],

    addCommandLink(keyword, id) {
        this.commandsLink.push({
            keyword: keyword[0],
            locationString: keyword[1],
            id
        });

        return this;
    },

    addCommandLinks(arrayOfKeyword, id) {
        arrayOfKeyword.forEach((keyword) => {
            this.addCommandLink(keyword, id);
        });

        return this;
    },

    scan(message) {
        const ids = this.commandsLink.filter((link) => {
            return message[link.locationString].toLowerCase().includes(link.keyword.toLowerCase()) ?? false;
        }).map((link) => {
            return link.id;
        })

        return [...new Set(ids)]
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

export function resolve(msg) {
    const now = Date.now();

    const array = filterPending(msg);

    array.forEach((pending) => {
        const command = Process.getCommand(pending.commandId).find((command) => {
            return msg.regexResolve(command.data.condition(pending.user), command.data.location);
        });

        console.log("resolve", pending?.user?.username, pending.commandId, command?.data?.condition(pending.user));

        if(command === undefined) return;

        const soul = {
            user: pending.user, 
            m: msg
        }

        command.process(soul, pending.commandId, now);
    })
}