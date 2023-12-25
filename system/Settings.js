export const Settings = {
    settings: {},

    add(id, settings) {
        this.settings[id] = settings;
    },

    get(id) {
        return this.settings[id];
    }
}