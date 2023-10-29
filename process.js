import { Location } from "./discordUtils.js";

export class Pending {
    //TODO: change object name
    static pending = {};

    static addPending(channel, user, commandId) {
        console.log("addpending")
        if(this.pending[channel.id] === undefined) {
            this.pending[channel.id] = [];
        }
        this.pending[channel.id].push([user, commandId]);
    }

    static removePending(channel, user, commandId) {
        if(this.pending[channel.id] === undefined) {
            return;
        }
        this.pending[channel.id] = this.pending[channel.id].filter((pending) => {
            return pending[0].id !== user.id && pending[1] !== commandId;
        })
    }

    static filterPending(msg) {
        if(this.pending[msg.channel.id] === undefined) return;
        const array = Preverification.scan(msg);
        return this.pending[msg.channel.id].filter((pending) => {
            return array.includes(pending[1]);
        })
    }
}

export class Process {
    static commands = {};

    static addCommand(id, command) {
        if(this.commands[id] === undefined) {
            this.commands[id] = [];
        }
        this.commands[id].push(command);

        return this;
    }

    static addCommands(id, commands) {
        console.log("addcommands")
        if(this.commands[id] === undefined) {
            this.commands[id] = [];
        }
        this.commands[id].push(...commands);

        return this;
    }

    static getCommand(id) {
        return this.commands[id];
    }
}

export class Preverification{
    static commandsLink = [];

    static addCommandLink(keyword, id) {
        this.commandsLink.push({
            keyword: keyword[0],
            locationString: keyword[1],
            id
        });

        return this;
    }

    static addCommandLinks(arrayOfKeyword, id) {
        arrayOfKeyword.forEach((keyword) => {
            this.addCommandLink(keyword, id);
        });

        return this;
    }

    static scan(message) {
        console.log("scan")
        return this.commandsLink.filter((link) => {
            return Location?.[link.locationString]?.(message)?.includes(link.keyword) ?? false;
        }).map((link) => {
            return link.id;
        })
    }
}

function regexResolve(stringReg, location) {
    const regex = new RegExp(stringReg, "si");
    return regex.test(location);
}

export function resolve(msg) {
    const now = Date.now();
    const array = Pending.filterPending(msg);
    array.forEach((pending) => {
        const command = Process.getCommand(pending[1]).find((command) => {
            console.log("regexResolve : ", regexResolve(command.condition(pending[0]), command.place(msg)));
            return regexResolve(command.condition(pending[0]), command.place(msg));
        });

        const soul = {
            user: pending[0], 
            m: msg
        }

        command.rule?.(soul, pending[1])
        command.save?.(soul, now);
    })
}