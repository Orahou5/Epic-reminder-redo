import { convertToMilliseconds, deleteAllEmptyOnDepth, iterateDeep, setPath, showDate } from "../scripts/utils.js";
import { commandsNoUser, commandsUser } from "./Commands.js";

export const pendingUser = {
    add(pending, channelId) {
        setPath(this, [channelId, pending.user.username, pending.commandId], pending);
    },
    remove(pending, channelId) {
        delete this[channelId][pending.user.username][pending.commandId];
    },
};

const pendingNoUser = {
    add(pending, channelId) {
        setPath(this, [channelId, `${pending.user.id}-${pending.commandId}`], pending);
    },
    remove(pending, channelId) {
        delete this[channelId][`${pending.user.id}-${pending.commandId}`];
    },
};

{
    function deleteExpired(depth) {
        return function() {
            const cb = (pending) => {
                if(pending.disabled) {
                    pending.removeFromStack();
                    showDate("deleted", pending.user.username, pending.commandId)
                    //console.log("deleted", pending.user.username, pending.commandId)
                }
            }

            iterateDeep(this, depth, cb);
        }
    }

    function deleteEmpty(depth) {
        return function() {
            deleteAllEmptyOnDepth(this, depth);
        }
    }

    function filter(channelId, username = null) {
        console.log("filter", this, channelId, username);
        const path = (username ? this?.[channelId]?.[username] : this?.[channelId]) ?? {};

        return Object.values(path);
    }

    function define(obj, expi, empty) {
        Object.defineProperties(obj, {
            add: {enumerable: false, writable: false},
            remove: {enumerable: false, writable: false},
            deleteExpired: {value: deleteExpired(expi), enumerable: false, writable: false},
            deleteEmpty: {value: deleteEmpty(empty), enumerable: false, writable: false},
            filter: {value: filter, enumerable: false, writable: false},
        });
    }

    define(pendingUser, 3, 2);
    define(pendingNoUser, 2, 1);
}

class Pending {
    constructor(user, commandId, commands, channelId, stack, users = [], disable_at = Date.now() + convertToMilliseconds({minutes: 5})) {
        console.log("createpending");
        this.user = user;
        this.commandId = commandId;
        this.commands = commands.getCommand(commandId);
        this.channelId = channelId;
        this.stack = stack;
        this.users = users;
        this.pendingConnections = [];

        this.disable_at = disable_at;

        this.addToStack();
    }

    addConnection(pending) {
        this.pendingConnections.push(pending);
    }

    addToStack() {
        this.stack.add(this, this.channelId);
    }

    removeFromStack() {
        this.stack.remove(this, this.channelId);
        this.pendingConnections.forEach((pending) => {
            pending.stack.remove(pending, pending.channelId);
        });
    }

    getUsersConnected() {
        return this.users;
    }

    filterCommands(msg) {
        return this.commands.filter((command) => {
            return command.checkPreverif(msg);
        });
    }

    resolve(msg, now = Date.now()) {
        if(this.disabled) return;
        
        this.commands.forEach((command) => {
            const bool = command.checkData(msg);

            if(!bool) return;

            console.log("resolve", this?.user?.username, this.commandId, command?.data);

            command.execute(this, msg, now);
        });
    }

    get disabled() {
        return this.disable_at <= Date.now();
    }
}

const createPending = (commands, stack) => ({user, commandId, channelId, users = [], disable_at = convertToMilliseconds({minutes: 5})}) => {
    const pending = new Pending(user, commandId, commands, channelId, stack, users, Date.now() + disable_at);
    pending.addToStack();
    return pending;
}

export const createPendingUser = createPending(commandsUser, pendingUser);
export const createPendingNoUser = createPending(commandsNoUser, pendingNoUser);

export const createDoublePending = (user, commandId, channelId, users = []) => {
    const pending1 = createPendingUser(user, commandId, channelId, users);
    const pending2 = createPendingNoUser(user, commandId, channelId, users);

    addConnection(pending1, pending2);

    return [pending1, pending2];
}

export function addConnection(pending1, pending2) {
    pending1.addConnection(pending2);
    pending2.addConnection(pending1);
}

export function deleteExpired() {
    pendingUser.deleteExpired();
    pendingUser.deleteEmpty();

    pendingNoUser.deleteExpired();
    pendingNoUser.deleteEmpty();
}

export function filterPending(msg) {
    const box = msg.finder();

    if(box === "noUser") return pendingNoUser.filter(msg.channel.id);

    return pendingUser.filter(msg.channel.id, box);
}