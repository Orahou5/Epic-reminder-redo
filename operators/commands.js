import { stopStory } from "../system/rule.js"
import { defaultProcess, processCustom, processEvent } from "./operation.js"
import { contentMentionProcess, contentStarProcess, usernameDash, usernameStar } from "./usersUtils.js"

export const cryCommand = {
    data: ["cried"],
    preverif: "cried",
    location: "content",
    process: defaultProcess,
}

export function customizeCooldown(regString) {
    return {
        data: ["cooldown", regString],
        location: "authorName=title",
        user: usernameDash("authorName"),
        process: processCustom({retrieveDTime: true, users: []}),
    }
}

export const epicJailCommand = {
    data: ["is now in the jail"],
    location: "content",
    user: usernameStar("content"),
    process: stopStory
}

export function createEvent(eventKey) {
    return {
        data: ["successfully registered", `${eventKey}`],
        ...contentStarProcess(processEvent(eventKey)),
    }
}

export function createEventNotJoin(eventKey) {
    return {
        data: ["you are already registered"],
        ...contentMentionProcess(processEvent(eventKey, false)),
    }
}