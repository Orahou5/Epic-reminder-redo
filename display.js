export class Display {
    static display = {}

    static addDisplay(display, command_id, scenario_id) {
        this.display[command_id] = {
            [scenario_id](user) {
                return display.replace("__|user|__", user.mention);
            }
        };
    }

    static getDisplay(user, command_id, scenario_id) {
        return this.display?.[command_id]?.[scenario_id]?.(user) ?? this.display?.[command_id]?.["default"]?.(user) ?? `No display found for ${command_id} ${scenario_id}`;
    }
}

export function sendContent(channel, content) {
    channel.send(content);
}