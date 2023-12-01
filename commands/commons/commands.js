import { defaultProcess, defaultProcessWithoutSave } from "./process.js"

export const cryCommand = {
    data: (user) => `${user.username}.{2} cried`,
    preverif: "cried",
    location: "content",
    process: defaultProcess,
}

const cooldownCommand = {
    data: (user) => `${user.username} — cooldown`,
    preverif: "cooldown",
    location: "authorName",
    process: defaultProcessWithoutSave,
}

const epicJailCommand = {
    data: (user) => `${user.username}.{2} is now in the jail`,
    preverif: "jail",
    location: "content",
    process: defaultProcessWithoutSave,
}

export const defaultCommands = [
    cooldownCommand,
    epicJailCommand
]

export const winFight = {
    data: (user) => `${user.username}\\*{2} found and killed`,
    preverif: "found",
    location: "content",
    process: defaultProcess,
}

export const loseFight = {
    data: (user) => `${user.username}\\*{2} found a.*?but lost fighting`,
    preverif: "found",
    location: "content",
    process: defaultProcess,

}