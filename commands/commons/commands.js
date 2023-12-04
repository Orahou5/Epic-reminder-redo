import { stopStory } from "../../rule.js"
import { defaultProcess, processWithCustomTime } from "./process.js"

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
        process: processWithCustomTime,
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