import { stopStory } from "../../system/rule.js"
import { defaultProcess, processCustom } from "./operation.js"

export const cryCommand = {
    data: ["usernameStar", "cried"],
    preverif: "cried",
    location: "content",
    process: defaultProcess,
}

export function customizeCooldown(regString) {
    return {
        data: ["cooldown", regString],
        location: "authorName=title",
        process: processCustom({retrieveDTime: true}),
    }
}

export const epicJailCommand = {
    data: ["is now in the jail"],
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

            processCustom({retrieveDTime: true}).call(this, soul, eventKey, now);
        }
    }
}

export function createEventNotJoin(eventKey) {
    return {
        data: ["mention", "you are already registered"],
        preverif: `registered`,
        location: "content",
        process(soul, commandId, now = Date.now()) {
            processCustom({retrieveDTime: true}).call(this, soul, eventKey, now);
        }
    }
}