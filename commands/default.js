export const cryCommand = (saveMethod) => ({
    scenario_id: "cry",
    condition: (username) => `${username}.{2} cried`,
    place: (m) => Location.content(m),
    rule: async (soul, commandId) => stopStory(soul, commandId),
    save(soul, now) {
        saveMethod(soul, now, this.scenario_id)
    }
})

export const cooldownCommand = {
    scenario_id: "cooldown",
    condition: (username) => `${username} — cooldown`,
    place: (m) => Location.authorName(m),
    rule: async (soul, commandId) => stopStory(soul, commandId),
}

export const epicJailCommand = {
    scenario_id: "epicJail",
    condition: (username) => `${username}.{2} is now in the jail`,
    place: (m) => Location.content(m),
    rule: async (soul, commandId) => stopStory(soul, commandId),
}