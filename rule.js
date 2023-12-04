import { buttonEmoji, buttonNo, buttonString, buttonStringEmoji, buttonYes, createComponentRow, send } from "./discordUtils.js";
import { findPending } from "./pending.js";

export function stopStory(soul, commandId) {
    console.log("stoppending")
    findPending(soul.user, commandId)?.removeFromPending();
}

export function ruleMove(soul) {
    send(soul.m.channel, `${soul.user}, Don't forget to switch back to your original area. *desu*`);
}

export function rulePetHelper(soul) {
    const match = soul.m?.["field0Value"]?.match(/^\D+(\d+)\D+(\d+)/i)

    console.log(soul.m?.["field0Value"])

    if(match?.length < 3) return;

    const happiness = +match[1];
    const hunger = +match[2];

    console.log(happiness, hunger);

    const hungerCommands = Math.floor(hunger / 20) + (hunger % 20 > 10 ? 1 : 0);
    const happinessCommands = 6 - hungerCommands;

    const estimatedValue = {
        happiness: Math.min(happiness + 10 * happinessCommands, 100),
        hunger: Math.max(hunger - 20 * hungerCommands, 0),
    } 

    const percentage = Math.min(((20/17) * (estimatedValue.happiness - estimatedValue.hunger)), 100).toFixed(2);

    const arrayOfCommands = [...Array(hungerCommands).fill("feed"), ...Array(happinessCommands).fill("pat")];

    const arrayOfButtons = arrayOfCommands.map((command, index) => {
        return buttonStringEmoji(command, {
            name: trainingUtility.pethelper[command]
        }, command + index, true);
    });

    soul.m.channel.createMessage({
        content: `${soul.user.mention} For an average chance of taming of ${percentage}%, do the following:\n\`${arrayOfCommands.join(" ")}\``,
        components: [
            createComponentRow(arrayOfButtons.slice(0, 3)),
            createComponentRow(arrayOfButtons.slice(3))
        ]
    })
}

export function ruleSendTraining(soul) {
    const spot = ["mine!", "casino?", "field!", "forest!", "river!"].find((spot) => soul.m.content.includes(spot)).slice(0, -1);

    trainingUtility[spot]?.fn?.(soul.m, soul.user);
}

const trainingUtility = {
    forest: {
        fn: ruleForest
    },
    river: {
        "normiefish": "1 : normie fish",
        "goldenfish": "2 : golden fish",
        "epicfish": "3 : EPIC fish",
        fn: ruleRiver
    },
    casino: {
        "four leaf clover": "four_leaf_clover",
        "gift": "gift",
        "diamond": "gem",
        "dice": "game_die",
        "coin": "coin",
        fn: ruleCasino
    },
    mine: {
        fn: ruleMine
    },
    field: {
        "first": 1,
        "second": 2,
        "third": 3,
        "fourth": 4,
        "fifth": 5,
        "sixth": 6,
        fn: ruleField
    },
    pethelper: {
        "pat": "❤️",
        "feed": "🌮",
    },
    response(user, answer) {
        return `${user.mention} The response to this question is : \`${answer}\``
    }
}

function ruleForest(msg, user) {
    const matchAll = [...msg.content.matchAll(/:([^:]+):/gi)];

    if(matchAll === null || matchAll?.length < 6) return;

    const comparator = matchAll.pop();

    const number = matchAll.reduce((acc, current) => {
        return acc + (current[1] === comparator[1] ? 1 : 0);
    }, 0);

    const fn = (str) => {
        const bool = str === `${number}`;
        return buttonString(str, bool);
    }

    const firstRow = ["0", "1", "2"].map(fn);
    const secondRow = ["3", "4", "5"].map(fn);

    msg.channel.createMessage({
        content: trainingUtility.response(user, number),
        components: [
            createComponentRow(firstRow),
            createComponentRow(secondRow)
        ]
    })

}

function ruleRiver(msg, user) {
    const match = msg.content.match(/[^:]+:([^:]+)/i);

    if(match?.length < 2) return;

    const answer = trainingUtility.river?.[match[1]?.toLowerCase()];

    msg.channel.createMessage({
        content: trainingUtility.response(user, answer),
        components: [
            createComponentRow([
                buttonString("normie fish", answer === "1 : normie fish"),
                buttonString("golden fish", answer === "2 : golden fish"),
                buttonString("EPIC fish", answer === "3 : EPIC fish")
            ])
        ]
    })
}

function ruleCasino(msg, user) {
    const match = msg.content.match(/[^\n]+\n[^\*]+[\*]+([^\*]+)[^:]+:([^:]+)/mi);

    if(match?.length < 3) return;

    const bool = trainingUtility.casino?.[match[1]?.toLowerCase()] === match[2];

    msg.channel.createMessage({
        content: trainingUtility.response(user, bool ? "yes" : "no"),
        components: [
            createComponentRow([
                buttonYes(bool),
                buttonNo(!bool)
            ])
        ]
    })
}

function ruleMine(msg, user) {
    msg.channel.createMessage({
        content: trainingUtility.response(user, "i don't know"),
        components: [
            createComponentRow([
                buttonYes(false),
                buttonNo(false)
            ])
        ]
    })
}

function ruleField(msg, user) {
    const match = msg.content.match(/[^\n]+\n[^\*]+[\*]+([^\*]+)[^:]+:([^:]+)/mi);

    if(match?.length < 3) return;

    const char = match[2].charAt(trainingUtility.field?.[match[1]?.toLowerCase()] - 1).toLowerCase();

    const fn = (button) => {
        const bool = button.customID.endsWith(char);
        return buttonStringEmoji(undefined, button.emoji, button.customID, bool)
    }

    const firstRow = msg.components?.[0]?.components.map(fn);

    const secondRow = msg.components?.[1]?.components.map(fn);

    msg.channel.createMessage({
        content: trainingUtility.response(user, char.toUpperCase()),
        components: [
            createComponentRow(firstRow),
            createComponentRow(secondRow)
        ]
    })
}