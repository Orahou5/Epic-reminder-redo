import { CommandHandler } from "../commandHandler.js";
import { createPending } from "../pending.js";
import { Process, Settings } from "../process.js";
import { convertToMilliseconds } from "../utils.js";
import { epicJailCommand } from "./commons/commands.js";
import { createDisplayGuild } from "./commons/default.js";
import { processGuild } from "./commons/process.js";

const command = "guild";

{
    CommandHandler.addTrigger("guild", async(msg) => {
        const args = msg.content.toLowerCase().split(" ");

        if(args.at(2) !== "raid" && args.at(2) !== "upgrade") return;

        createPending(msg.channel.id, msg.member, command);
    });

    Settings.add(command, {
        dTime: convertToMilliseconds({hours: 2}),
        fixed_cd: true,
        emoji: ":headstone:"
    });

    const displayRaid = createDisplayGuild("guild raid", "</guild raid:961046237753257994>", ":headstone:")
    const displayUpgrade = createDisplayGuild("guild upgrade", "</guild upgrade:961046237753257994>", ":headstone:")

    const toBeRegistered = [
        {
            data: ["usernameDash", "cooldown", "guild has already raided or been upgraded"],
            preverif: "guild",
            location: "authorName=title",
            process: processGuild({retrieveDTime: true, display: displayRaid}),  
        },
        {
            data: ["usernameStar", "raided"],
            preverif: "raided",
            location: "description",
            process: processGuild({display: displayRaid})
        },
        {
            data: ["guild", "upgrade", "95"],
            preverif: "95",
            location: "description=field0Value",
            process: processGuild({display: displayRaid})
        },
        {
            data: ["guild", "upgrade"],
            preverif: "upgrade",
            location: "description",
            process: processGuild({display: displayUpgrade})
        },
        epicJailCommand
    ];

    Process.addCommands(command, toBeRegistered)
}