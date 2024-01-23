import { ComponentTypes } from "oceanic.js";

export function extendsMessage(msg) {
    const handler = {
        get(target, prop, receiver) {
            const value = Reflect.get(target, prop);

            if(value !== undefined) return value;

            const customProps = {
                authorName: `${target?.embeds?.[0]?.author?.name}`,
                description: `${target?.embeds?.[0]?.description}`,
                title: `${target?.embeds?.[0]?.title}`,
                field0Name: `${target?.embeds?.[0]?.fields?.[0]?.name}`,
                field0Value: `${target?.embeds?.[0]?.fields?.[0]?.value}`,
                field1Name: `${target?.embeds?.[0]?.fields?.[1]?.name}`,
                field1Value: `${target?.embeds?.[0]?.fields?.[1]?.value}`,
            }

            if(customProps[prop] !== undefined) return customProps[prop];

            return getFromProp(prop, receiver);
        }
    }

    return new Proxy(msg, handler);
}

function getFromProp(prop, receiver) {
    const multipleProp = prop.split("=")
    if(multipleProp.length > 1) {
        return multipleProp.reduceRight((acc, curr) => {
            return `${receiver[curr]}\n${acc}`;
        }, "");
    }
    return undefined;
}

export function send(channel, content) {
    channel.createMessage({
        content: content
    }).catch((err) => {
        console.log(err);
        console.log("retrying in 5 minutes");
        setTimeout(() => {
            send(channel, content);
        }, 5 * 60 * 1000);
    });
}

export function getIdFromMentionString(string) {
    return string.match(/<@!?(\d+)>/)?.[1];
}

export function getMultiplesUsersFromMessage({msg, start = 2, min = 1, max = 10}) {
    const args  = msg.content.split(" ");

    if(args.length < start + min) return;

    const users = [];

    for(let i = start; i < start + max && i < args.length; i++) {
        const otherUser = msg.mentions.users.find((user) => user.id === getIdFromMentionString(args.at(i)));
        if(otherUser === undefined) continue;
        users.push(otherUser);
    }

    return users;
}

export function createComponentRow(components) {
    return {
        type: ComponentTypes.ACTION_ROW,
        components
    };
}
