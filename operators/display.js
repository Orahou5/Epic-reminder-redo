import { createDisplayGuild } from "./default.js"

export const displayRaid = createDisplayGuild("guild raid", "</guild raid:961046237753257994>", ":headstone:")
export const displayUpgrade = createDisplayGuild("guild upgrade", "</guild upgrade:961046237753257994>", ":headstone:")

export const emojiMisc = {
    winkies: "<:winkies:917483819664285726>",

    smilepink: "<:smilepink:954043648603983893>",

    mewheart: "<:mew_heart:849804087972200458>",

    think: "<:think:813194042115358793>",

    kyaa: "<:kyaa:940353030300246098>",

    redDeer: "<:red_deer:940354118541774879>",

    beam: "<:beam:813194042149699674>",

    pouts: "<:pouts:761953214496112640>",

    nom: "<:nom:983855251876626442>",

    swordRight: "<:sword_right:985477769624420353>",

    swordLeft: "<:sword_left:985477768672325652>",
}

export function removeExcessWhitespace(str) {
    return str.replace(/\s+/g, ' ').trim();
};