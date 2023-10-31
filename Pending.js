import { Preverification } from "./process.js";

export class Pending {
    //TODO: change object name
    static pending = {};
    static symlink = {};

    static addPending(channelId, user, commandId) {
        console.log("addpending");

        this.removePending(user, commandId);
        this.symlink[`${user.id}-${commandId}`] = {
            channelId,
            disable_at: Date.now() + 1000 * 60 * 5
        };

        if (this.pending[channelId] === undefined) {
            this.pending[channelId] = {};
        }

        this.pending[channelId][`${user.id}-${commandId}`] = {
            user,
            commandId,
        };
    }

    static removePending(user, commandId) {
        console.log("removepending");

        const channelId = this.symlink[`${user.id}-${commandId}`]?.channelId;

        if (channelId === undefined) return;

        delete this.pending[channelId][`${user.id}-${commandId}`];
        delete this.symlink[`${user.id}-${commandId}`];
    }

    static filterPending(msg) {
        console.log("filterpending");

        if (this.pending[msg.channel.id] === undefined) return;

        const array = Preverification.scan(msg);

        return Object.values(this.pending[msg.channel.id]).filter((value) => {
            return array.includes(value?.commandId);
        });
    }

    static deleteExpired() {
        console.log("deleteexpired");
        
        const now = Date.now();
        Object.entries(this.symlink).forEach(([key, value]) => {
            if (value.disabled_at <= now) {
                const [userId, commandId] = key.split("-");
                this.removePending(userId, commandId);
            }
        });
    }
}

export class PendingMultiple {
    static link = {};

    static addPending(channelId, users, commandId) {
        console.log("addpendingmultiple");

        this.removeMultiplePending(users, commandId);

        for(const user of users) {
            const otherUsers = users.filter((u) => u.id !== user.id);
            this.link[`${user.id}-${commandId}`] = otherUsers;
            Pending.addPending(channelId, user, commandId);
        }
    }  
    
    static removeMultiplePending(users, commandId) {
        console.log("removependingmultiplebis");

        users.forEach((user) => {
            this.removePending(user, commandId);
        });
    }

    static removePending(user, commandId) {
        console.log("removependingmultiple");

        if(this.link[`${user.id}-${commandId}`] === undefined) return;

        const otherUsers = this.link[`${user.id}-${commandId}`];

        delete this.link[`${user.id}-${commandId}`];

        Pending.removePending(user, commandId);

        this.removeMultiplePending(otherUsers, commandId);
    }
}