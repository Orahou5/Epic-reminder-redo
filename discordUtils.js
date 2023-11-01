export class Location {
    static content = (m) => `${m.content}`;
    static authorName = (m) => `${m?.embeds?.[0]?.author?.name}`;
    static description = (m) => `${m?.embeds?.[0]?.description}`;
    static title = (m) => `${m?.embeds?.[0]?.title}`;
    static field0Name = (m) => `${m?.embeds?.[0]?.fields?.[0]?.name}`;
    static field0Value = (m) => `${m?.embeds?.[0]?.fields?.[0]?.value}`;
    static field1Name = (m) => `${m?.embeds?.[0]?.fields?.[1]?.name}`;
    static field1Value = (m) => `${m?.embeds?.[0]?.fields?.[1]?.value}`;
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
    return string.match(/\d+/)[0];
}