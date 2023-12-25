export const CommandHandler = {
    triggers: {},

    addTrigger(trigger, callback) {
        this.triggers[trigger] = callback;
    },

    addMultiplesTriggers(triggers, callback) {
        triggers.forEach((trigger) => {
            this.addTrigger(trigger, callback);
        });
    },

    async handle(msg) {
        const trigger = msg.content.split(" ")[1];
        if (this.triggers[trigger] !== undefined) {
            await this.triggers[trigger](msg);
        }
    }
}