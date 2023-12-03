export function extendsMessage(msg) {
    const handler = {
        get(target, prop, receiver) {
            switch(prop) {
                case "authorName":
                    return `${target?.embeds?.[0]?.author?.name}`;
                case "description":
                    return `${target?.embeds?.[0]?.description}`;
                case "title":
                    return `${target?.embeds?.[0]?.title}`;
                case "field0Name":
                    return `${target?.embeds?.[0]?.fields?.[0]?.name}`;
                case "field0Value":
                    return `${target?.embeds?.[0]?.fields?.[0]?.value}`;
                case "field1Name":
                    return `${target?.embeds?.[0]?.fields?.[1]?.name}`;
                case "field1Value":
                    return `${target?.embeds?.[0]?.fields?.[1]?.value}`;
                case "regexResolve":
                    return (stringReg, location) => {
                        const regex = new RegExp(stringReg, "si");

                        return regex.test(receiver[location]);
                    }
                default:
                    const multipleProp = prop.split("=")
                    if(multipleProp.length > 1) {
                        return multipleProp.reduceRight((acc, curr) => {
                            return `${receiver[curr]} ${acc}`;
                        }, "");
                    }
                    return Reflect.get(target, prop);
            }
        }
    }

    return new Proxy(msg, handler);
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
    return string.match(/^<@!?(\d+)>$/)?.[1];
}

export function getMultiplesUsersFromMessage(msg, min = 1, max = 10) {
    const args  = msg.content.split(" ");

    if(args.length < 2 + min) return;

    const users = [msg.author];

    for(let i = 2; i < 2 + max && i < args.length; i++) {
        const otherUser = msg.mentions.users.find((user) => user.id === getIdFromMentionString(args.at(i)));
        users.push(otherUser);
    }

    return users;
}