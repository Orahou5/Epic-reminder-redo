export class Pending {
    //TODO: change object name
    static pending = {};

    static addPending(channel, user, commandId) {
        if(this.pending[channel.id] === undefined) {
            this.pending[channel.id] = [];
        }
        this.pending.push([user, commandId]);
    }

    static removePending(channel, user, commandId) {
        if(this.pending[channel.id] === undefined) {
            return;
        }
        this.pending = this.pending.filter((pending) => {
            return pending[0].id !== user.id && pending[1] !== commandId;
        })
    }

    static filterPending(msg) {
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
            keyword,
            id
        });

        return this;
    }

    static scan(message) {
        return this.commandsLink.filter((link) => {
            return message.content.includes(link.keyword);
        }).map((link) => {
            return link.id;
        })
    }
}

function regexResolve(stringReg, location) {
    const regex = new RegExp(stringReg, "si");
    return regex.test(location);
}

export function resolve(msg, user) {
    const now = Date.now();
    const array = Pending.filterPending(msg);
    array.forEach((pending) => {
        Process.getCommand(pending[1]).forEach((command) => {
            if(!regexResolve(command.condition(pending[0].username), command.place(msg))) return;

            const soul = {
                user, 
                m: msg
            }

            command?.rule(soul, pending[1])
            command?.save(soul, now);
        })
    })
}