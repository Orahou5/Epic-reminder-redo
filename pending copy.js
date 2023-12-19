// import { Process } from "./process.js";

import { setPath } from "./utils.js";

// const pending = {};
// const symlink = {};

// export class Pending {
//     constructor(user, commandId) {
//         console.log("createpending");
//         this.user = user;
//         this.commandId = commandId;
//     }

//     addToPending(channelId) {
//         console.log("addpending");

//         if(pending[channelId] === undefined) {
//             pending[channelId] = {};
//         }

//         const userComandId = `${this.user.id}-${this.commandId}`;

//         pending[channelId][userComandId] = this;

//         const obj = {
//             pending: this,
//             channelId,
//             disable_at: Date.now() + 1000 * 60 * 5
//         };

//         symlink[userComandId] = obj;
//         symlink[pending.user.username] = obj;
//     }

//     removeFromPending() {
//         console.log("removepending");

//         const channelId = symlink[`${this.user.id}-${this.commandId}`]?.channelId;

//         if (channelId === undefined) return;

//         delete pending[channelId][`${this.user.id}-${this.commandId}`];
//         delete symlink[`${this.user.id}-${this.commandId}`];
//     }

//     hasPending() {
//         return symlink[`${this.user.id}-${this.commandId}`] !== undefined;
//     }
// }

// export class PendingConnected extends Pending {
//     constructor(user, commandId, users) {
//         console.log("createconnectedpending");
//         super(user, commandId);
//         this.users = users;
//     }

//     getUsers() {
//         return this.users;
//     }
// }

// export function findPending(user, commandId) {
//     console.log("findpending");

//     const channelId = symlink[`${user.id}-${commandId}`]?.channelId;

//     return pending[channelId]?.[`${user.id}-${commandId}`];
// }

// export function filterPending(msg) {
//     console.log("filterpending");

//     if (pending[msg.channel.id] === undefined) return;

//     const scannedCommands = Process.scan(msg);

//     return {
//         pending: Object.values(pending[msg.channel.id]).filter((value) => {
//             return Object.keys(scannedCommands).includes(value?.commandId);
//         }),
//         commands: scannedCommands
//     }
    
// }

// export function deleteExpired() {
//     console.log("deleteexpired");
    
//     const now = Date.now();
//     Object.entries(symlink).forEach(([key, value]) => {
//         if (value.disabled_at <= now) {
//             const [userId, commandId] = key.split("-");
//             console.log("deleting expired", userId, commandId);
//             this.removeFromPending(userId, commandId);
//         }
//     });
// }

// function createPendingCustom(connected) {
//     return function(channelId, user, commandId, users = []) {
//         console.log("createpending");

//         const pending = connected ? new PendingConnected(user, commandId, users) : new Pending(user, commandId);
//         pending.addToPending(channelId);

//         return pending;
//     }
// }

// export const createPending = createPendingCustom(false);
// export const createConnectedPending = createPendingCustom(true);

export const pendings = {
    add(pending, channelId) {
        setPath(this, [channelId, pending.commandId, pending.user.id], pending);
    }
};

const symlink = {
    add(pending, channelId) {
        const obj = {
            pending,
            channelId,
            disable_at: Date.now() + 1000 * 60 * 5
        }

        setPath(this, [pending.user.id, channelId, pending.commandId], obj);

        setPath(this, [pending.user.username, channelId, pending.commandId], obj);
    }
};

const commandlink = {
    add(pending, channelId) {
        setPath(this, [pending.commandId, channelId, pending.user.id], pending);
    }
}

const ongoings = {};

class Pending {
    constructor(user, commandId, channelId) {
        this.user = user;
        this.commandId = commandId;
        
    }

    addPending() {

    }
}
