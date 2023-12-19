import { defaultProcess, processWithMove } from "../commands/commons/process.js";
import { getIdFromMentionString } from "../discordUtils.js";
import { stopStory } from "../rule.js";

class Command {
    constructor(pending) {
        this.pending = pending;
    }

    usernameStar(user) {
        return `**${user.username}**`;
    }

    usernameDash(user) {
        return `${user.username} —`;
    }

    mention(user) {
        return `${user.mention}`;
    }

    noUser(user) {
        return ``;
    }

    finder(msg, location) {
        const splited = msg?.[location].split(" ");
    
        if(splited === undefined) return;
    
        if(splited.at(1) === "—") return splited.at(0);
    
        const candidate = splited.find((word) => {
            const bool1 = word.includes("**") && word === word.toLowerCase();
            const bool2 = word.includes("<@")
            return bool1 || bool2;
        });
    
        if(candidate === undefined) return "noUser";
    
        if(candidate.includes("**")) return candidate.slice(2, -2);
    
        return getIdFromMentionString(candidate);
    }

    match(msg, locations) {
        const user = locations.map((location) => {
            return {
                finder: this.finder(msg, location),
                location: location
            };
        }).find((user) => {
            return user.finder !== "noUser";
        }) ?? {
            finder: "noUser",
            location: "content"
        };

        //TODO: Something, too tired to think about it

        return this.matcher[user.location] ?? {};
    }
}

Command.prototype.matcher = {

}

class Hunt {
    constructor(pending) {
        super(pending);
    }


}

Hunt.prototype.matcher = {
    content: {
        "found and killed": defaultProcess,
        "but lost fighting": defaultProcess,
        "is now in the jail": stopStory,
        "cried": defaultProcess,
        "hunting together!": defaultProcess,
        "found a": defaultProcess,
        "fights the horde": defaultProcess,
        "pretends": processWithMove
    },
    authorName: {
        "cooldown": stopStory,
    }
}

