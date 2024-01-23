import { defaultProcess } from "../operators/operation.js";
import { createPending } from "../system/Pending.js";

const commands = {
    id: "pet",
    list: []   
};

{
    CommandHandler.addMultiplesTriggers(["pet", "pets"], async(msg) => {
        createPending({
            msg: msg,
            commands: commands,
            timeOut: convertToMilliseconds({minutes: 1})
        });
    });
    
    Settings.add(command, {
        dTime: convertToMilliseconds({hours: 4}),
        fixed_cd: true,
        emoji: "<:foxknife:776803712626458634>"
    });

    const toBeRegistered = [
        {
            data: ["usernameStar", "got", ["log", "ruby", "coins", "fish", "apple", "banana"]],
            preverif: "got",
            location: "content",
            process: defaultProcess
        },
        {
            data: ["usernameStar", "fights **the ruby dragon**"],
            preverif: "ruby dragon",
            location: "content",
            process: processWithMove
        },
        {
            data: ["usernameStar", "ran away"],
            preverif: "ran",
            location: "content",
            process: processWithMove
        },
        {
            data: ["usernameStar", "sleeps", "got 2"],
            preverif: "sleeps",
            location: "content",
            process: processWithMove
        },
        {
            data: ["usernameStar", ["cried", "sleeps"]],
            preverif: "cried",
            location: "content",
            process: defaultProcess
        },
        customizeCooldown("got some resources"),
        epicJailCommand,
    ];

    Process.addCommands(command, toBeRegistered)
}

// TODO: make a database Table for levels of fast and register for each user the level of their pets fast from F to SS+
// then create multiples reminders for when epic is called
const list = [
    {
        data: ["pet", "started an adventure"],
        location: "content",
        process: defaultProcess
    }
]

export let canPetSent = (soul) => ({
    name: "petSent",
    condition: `pets? ha(?:s|ve) started an adventure`,
    place: (m) => Location.content(m),
    async rule(){
        stopStory(soul);
    },
    save(m, now) {
        canSavePet(soul) (strGeneric(soul)) (m, now);
    }
});

export let canPetTimeTravel = (soul) => ({
    name: "petTimeTravel",
    condition: `for some completely unknown reason, the following pets are back instantly`,
    place: (m) => Location.content(m),
    async rule(m){
        stopStory(soul);
        ruleTimeTravel(soul) (m);
    },
    save(m, now) {
        canSavePet(soul) (strGeneric(soul)) (m, now);
    }
});

export let canPetTimeTravel2 = (soul) => ({
    name: "petTimeTravel2",
    condition: `Your pet has started an... wait what`,
    place: (m) => Location.content(m),
    async rule(){
        stopStory(soul);
        ruleTimeTravelBis(soul);
    },
    save(m, now) {
        canSavePet(soul) (strGeneric(soul)) (m, now);
    }
});

export let canPetCancel = (soul) => ({
    name: "petCancel",
    condition: `${soul.user}, .*? pet adventure\\(s\\) cancelled`,
    place: (m) => Location.content(m),
    rule: async () => stopStory(soul),
});

export let canPetCantCancel = (soul) => ({
    name: "petCantCancel",
    condition: `${soul.user}, you cannot cancel the adventure of your pet`,
    place: (m) => Location.content(m),
    rule: async () => stopStory(soul),
});

export let canPetCantCancel2 = (soul) => ({
    name: "petCantCancel2",
    condition: `${soul.user}, your pet .*? is not in an adventure`,
    place: (m) => Location.content(m),
    rule: async () => stopStory(soul),
});

export let canPetNoRequirement = (soul) => ({
    name: "petNoRequirement",
    condition: `${soul.user}, no pets met the requirement`,
    place: (m) => Location.content(m),
    rule: async () => stopStory(soul),
});

export let canPetNoSend = (soul) => ({
    name: "petNoSend",
    condition: `${soul.user}, you cannot send another pet to an adventure`,
    place: (m) => Location.content(m),
    rule: async () => stopStory(soul),
});

export let canPetNoSend2 = (soul) => ({
    name: "petNoSend2",
    condition: `${soul.user}, your pet .*? is already in an adventure`,
    place: (m) => Location.content(m),
    rule: async () => stopStory(soul),
});

export let canPetNoSelect = (soul) => ({
    name: "petNoSelect",
    condition: `${soul.user}, what pet(?:\\(s\\))? are you trying to select`,
    place: (m) => Location.content(m),
    rule: async () => stopStory(soul),
});

export let canPetNoUse = (soul) => ({
    name: "petNoUse",
    condition: `${soul.user}, what action are you trying to use`,
    place: (m) => Location.content(m),
    rule: async () => stopStory(soul),
});

export let canPetTournamentSent = (soul) => ({
    name: "petTournamentSent",
    condition: `pet successfully sent to the pet tournament`,
    place: (m) => Location.content(m),
    async rule(){
        stopStory(soul);
    },
    save(m, now) {
        canSave(soul) (strGeneric(soul)) (m, now);
    }
});

export let canPetNoSendTournament = (soul) => ({
    name: "petNoSendTournament",
    condition: `You cannot send another pet to the \\*{2}pet tournament`,
    place: (m) => Location.description(m),
    rule: async () => stopStory(soul),
});