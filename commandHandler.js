export class CommandHandler {
    static triggers = {};

    static addTrigger(trigger, callback) {
        this.triggers[trigger] = callback;
    }

    static addMultiplesTriggers(triggers, callback) {
        triggers.forEach((trigger) => {
            this.addTrigger(trigger, callback);
        });
    }

    static async handle(msg) {
        const trigger = msg.content.split(" ")[1];
        if (this.triggers[trigger] !== undefined) {
            await this.triggers[trigger](msg);
        }
    }
}

