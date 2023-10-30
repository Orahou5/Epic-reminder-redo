import { Pending } from "./Pending.js";
import { Location } from "./discordUtils.js";

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
        
        const ids = this.commandsLink.filter((link) => {
            return Location?.[link.locationString]?.(message)?.includes(link.keyword) ?? false;
        }).map((link) => {
            return link.id;
        })

        console.log("scan", ids);

        return [...new Set(ids)]
    }
}

function regexResolve(stringReg, location) {
    const regex = new RegExp(stringReg, "si");
    return regex.test(location);
}

export function resolve(msg) {
    const now = Date.now();

    const array = Pending.filterPending(msg);

    console.log("resolve", array);

    array.forEach((pending) => {
        const command = Process.getCommand(pending.commandId).find((command) => {
            console.log("regexResolve : ", regexResolve(command.condition(pending.user), command.place(msg)));
            return regexResolve(command.condition(pending.user), command.place(msg));
        });

        const soul = {
            user: pending.user, 
            m: msg
        }

        command.rule?.(soul, pending.commandId)
        command.save?.(soul, now);
    })
}