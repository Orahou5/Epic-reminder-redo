
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

            if(prop === "finder") return () => finder(Object.assign(customProps, {content: `${target?.content}`}));

            if(prop === "regexResolve") return (stringReg, location) => {
                const regex = new RegExp(stringReg, "si");

                return regex.test(receiver[location]);
            };

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

function finder(locations) {
    let result = "noUser"
    const locationsValues = Object.values(locations)

    for (const location of locationsValues) {
        const splited = location.split(" ");

        if(splited === undefined) continue;

        if(splited.at(1) === "—") return splited.at(0);

        const candidate = splited.find((word) => {
            const bool1 = word.includes("**") && word === word.toLowerCase();
            const bool2 = word.includes("<@")
            return bool1 || bool2;
        });

        if(candidate === undefined) continue;

        if(candidate.includes("**")) return candidate.slice(2, -2);

        return getIdFromMentionString(candidate);
    }

    return result;
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