import { Location } from "../discordUtils.js"
import { stopStory } from "../rule.js"

export const cryCommand = (saveMethod) => ({
    scenario_id: "cry",
    condition: (user) => `${user.username}.{2} cried`,
    place: (m) => Location.content(m),
    rule: async (soul, commandId) => stopStory(soul, commandId),
    save(soul, now) {
        saveMethod(soul, now, this.scenario_id)
    }
})

export const cooldownCommand = {
    scenario_id: "cooldown",
    condition: (user) => `${user.username} — cooldown`,
    place: (m) => Location.authorName(m),
    rule: async (soul, commandId) => stopStory(soul, commandId),
}

export const epicJailCommand = {
    scenario_id: "epicJail",
    condition: (user) => `${user.username}.{2} is now in the jail`,
    place: (m) => Location.content(m),
    rule: async (soul, commandId) => stopStory(soul, commandId),
}