class Commands {
    constructor() {
        this.commands = {};
    }

    addCommand(id, command) {
        if(this.commands[id] === undefined) {
            this.commands[id] = [];
        }

        this.commands[id].push(new Command(command.data, command.location, command.preverif, command.process));

        return this;
    }

    addCommands(id, commands) {
        commands.forEach((command) => {
            this.addCommand(id, command);
        });

        return this;
    }

    getCommand(id) {
        return this.commands[id];
    }

    //scan possibly useless here
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

class Command {
    constructor(data, location, preverif, process) {
        this.data = data;
        this.location = location;
        this.preverif = preverif;
        this.process = process.bind(this);
    }

    checkData(msg) {
        const string = msg[this.location]?.toLowerCase();

        if(string === undefined) return false;

        return this.data.every((data) => {
            return Array.isArray(data) ? 
            data.some((d) => string.includes(d)) : 
            string.includes(data); 
        })
    }

    execute(pending, msg, now = Date.now()) {
        this.process(pending, msg, now);
    }
}

export const commandsUser = new Commands();

export const commandsNoUser = new Commands();