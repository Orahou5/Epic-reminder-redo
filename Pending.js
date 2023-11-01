import { Preverification } from "./process.js";

const pending = {};
const symlink = {};

class Pending {
    constructor(user, commandId) {
        this.user = user;
        this.commandId = commandId;
    }

    addToPending(channelId) {
        console.log("addpending");

        if(pending[channelId] === undefined) {
            pending[channelId] = {};
        }

        const userComandId = `${this.user.id}-${this.commandId}`;

        pending[channelId][userComandId] = this;

        symlink[userComandId] = {
            channelId,
            disable_at: Date.now() + 1000 * 60 * 5
        };
    }

    removeFromPending() {
        console.log("removepending");

        const channelId = symlink[`${this.user.id}-${this.commandId}`]?.channelId;

        if (channelId === undefined) return;

        delete pending[channelId][`${this.user.id}-${this.commandId}`];
        delete symlink[`${this.user.id}-${this.commandId}`];
    }

    hasPending() {
        return symlink[`${this.user.id}-${this.commandId}`] !== undefined;
    }
}

export function createPending(channelId, user, commandId) {
    console.log("createpending");

    const pending = new Pending(user, commandId);
    pending.addToPending(channelId);

    return pending;
}

export function findPending(user, commandId) {
    console.log("findpending");

    const channelId = symlink[`${user.id}-${commandId}`]?.channelId;

    return pending[channelId]?.[`${user.id}-${commandId}`];
}

export function filterPending(msg) {
    console.log("filterpending");

    if (pending[msg.channel.id] === undefined) return;

    const array = Preverification.scan(msg);

    return Object.values(pending[msg.channel.id]).filter((value) => {
        return array.includes(value?.commandId);
    });
}

export function deleteExpired() {
    console.log("deleteexpired");
    
    const now = Date.now();
    Object.entries(symlink).forEach(([key, value]) => {
        if (value.disabled_at <= now) {
            const [userId, commandId] = key.split("-");
            this.removeFromPending(userId, commandId);
        }
    });
}

export function createConnectedPending(channelId, users, commandId) {
    console.log("createconnectedpending");

    const pendingProxy = new Proxy(Pending.prototype.removeFromPending, {
        apply: function(target, thisArg, args) {
            console.log(`Removing pending for user ${thisArg.user.id}`);

            if(!thisArg.hasPending()) return;

            target.apply(thisArg, args);

            users.forEach(user => {
                if(user.id === thisArg.user.id) return;

                const pendingTemp = findPending(user, commandId);
                
                if(pendingTemp === undefined) return;

                pendingTemp.removeFromPending();
            });

            return true;
        }
    });

    users.forEach(user => {
        const pendingUser = createPending(channelId, user, commandId);
        pendingUser.removeFromPending = pendingProxy;
    });
}