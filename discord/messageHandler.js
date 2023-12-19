import { client } from "../index.js";

// const messageHandler = {
//     channel: {},
//     client: client,
//     stack: {
//         usernameStar: createStack(user => `**${user.username}**`),
//         usernameDash: createStack(user => `${user.username} —`),
//         mention: createStack(user => `${user.mention}`),
//         noUser: createStack(user => ``),
//     },

//     startMessageHandler() {
//         this.client.on("messageCreate", (msg) => {
//             this.getStack
//         });
//     },

//     getStack(user, msg, location) {
//         return Object.values(this.stack).find((stack) => {
//             return msg?.[location].includes(stack.identification(user))
//         });
//     },

//     sendToCollector({channel, stack, filter, timeout = convertToMilliseconds({minutes: 5})}) {
//         const valid = this.stack[stack] !== undefined ? stack : "noUser";
//         this.stack[valid].push({channelId : channel.id, filter, timeout});
//         this.channel[channel.id] = channel;
//     },

//     deleteAllTimeout() {
//         const now = Date.now();
//         Object.values(this.stack).forEach((stack) => {
//             Object.entries(stack).forEach(([key, value]) => {
//                 if(value?.timeout < now) {
//                     delete stack[key];
//                 }
//             })
//         });
//     }
// }

// function createStack(callback = (user) => {return user.username}) {
//     return {
//         identification: callback,
//     }
// }

const messageHandler = {
    channel: {},
    client: client,

    getBestCandidates(msg, location) {
        
    },

}