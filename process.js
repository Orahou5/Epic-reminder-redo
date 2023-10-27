export class Pending {
    //TODO: change object name
    static array = {};

    static addPending(channel, user, commandId) {
        if(this.array[channel.id] === undefined) {
            this.array[channel.id] = [];
        }
        this.array.push([user, commandId]);
    }

    static removePending(channel, user, commandId) {
        if(this.array[channel.id] === undefined) {
            return;
        }
        this.array = this.array.filter((pending) => {
            return pending[0].id !== user.id && pending[1] !== commandId;
        })
    }

    static filterPending(msg) {
        const array = Preverification.scan(msg);
        return this.array[msg.channel.id].filter((pending) => {
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


//TODO: Wrong, redo from this point
function resolve(msg, user) {
    const array = Pending.filterPending(msg);
    array.forEach((pending) => {
        Process.getCommand(pending[1]).forEach((command) => {
            command(msg, user);
        })
    })
}