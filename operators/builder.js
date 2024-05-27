import { createBase } from "./default.js";
import { emojiMisc, removeExcessWhitespace } from "./display.js";

function createDefaultHandler(defaultValue) {
    return {
        get: function (obj, prop) {
            return obj.hasOwnProperty(prop) ? obj[prop] : defaultValue;
        }
    }
}

const converter = {
    id: new Proxy({
        user: (id) => `<@${id}>`,
        guild: (id) => `<@&${id}>`, 
    }, createDefaultHandler((id) => `<@${id}>`)),

    base: new Proxy({
        none: (command, mode) => `It's time for ${createBase(command, mode)} *desu*`,
        guild: (command, mode) => `Hey, Hey, ${createBase(command, mode)} is ready again! *desu*`,
    }, createDefaultHandler((command, mode) => `It's time for ${createBase(command, mode)} *desu*`)),

    mode: new Proxy({
        none: () => ``,
        raid: () => `raid`,
        upgrade: () => `upgrade`,
        hard: () => `h`,
        alone: () => `a`,
        together: () => `t`,
    }, createDefaultHandler(() => ``)),

    fluff: new Proxy({
        none: () => ``,
        zombieJoin: () => `Mmh? You faked being a part of the zombie army? Smart! ${emojiMisc.smilepink}`,
        zombieFight: () => `How was the zombie army? Perhaps you are going to see it again soon? ${emojiMisc.smilepink}`,
    }, createDefaultHandler(() => ``)),

    slash: new Proxy({
        none: () => ``,
        raid: () => `You can do it with </guild raid:961046237753257994>!`,
        upgrade: () => `You can do it with </guild upgrade:961046237753257994>!`,
    }, createDefaultHandler(() => ``)),
}
export function buildMessage(tokens, userId) {
    const ping = converter.id[tokens.id](userId);

    const mode = tokens.mode.split("-").map((token) => converter.mode[token]()).join(" ");

    const fluff = converter.fluff[tokens.fluff]();

    const base = converter.base[tokens.base](ping, tokens.subcommand, mode);

    const slash = converter.slash[tokens.slash]();

    return removeExcessWhitespace(`${ping} ${fluff} ${base} ${slash}`);
}

/* id-token = 0 for userid, 1 for guild
 * base-token = 0 for base message, higher for custom message
 * mode-token = 0 for nothing, higher for custom
 * fluff-token = 0 for nothing, higher for custom
 * slash-token = 0 for nothing, higher for custom
 * subcommand-token = 0 for same, higher for custom
 * */