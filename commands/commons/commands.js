import { stopStory } from "../../rule.js"
import { createDisplay } from "./default.js"
import { defaultProcess, processCustom } from "./process.js"

export const cryCommand = {
    data: ["usernameStar", "cried"],
    preverif: "cried",
    location: "content",
    process: defaultProcess,
}

export function customizeCooldown(regString, preverif = null) {
    return {
        data: ["usernameDash", "cooldown", regString],
        preverif: preverif ?? regString,
        location: "authorName=title",
        process: processCustom({retrieveDTime: true}),
    }
}

export const epicJailCommand = {
    data: ["usernameStar", "is now in the jail"],
    preverif: "jail",
    location: "content",
    process: stopStory
}

export const winFight = {
    data: ["usernameStar", "found and killed"],
    preverif: "found",
    location: "content",
    process: defaultProcess,
}

export const loseFight = {
    data: ["usernameStar", "but lost fighting"],
    preverif: "fighting",
    location: "content",
    process: defaultProcess,

}

export function createEvent(eventKey) {
    return {
        data: ["usernameStar", "successfully registered", `${eventKey}`],
        preverif: `${eventKey}`,
        location: "content",
        process(soul, commandId, now = Date.now()) {
            defaultProcess(soul, commandId, now);

            processCustom({retrieveDTime: true})(soul, eventKey, now);
        }
    }
}

export const eventNotJoin = {
    data: ["mention", "you are already registered"],
    preverif: "registered",
    location: "content",
    process: stopStory,
}