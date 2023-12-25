import { ButtonStyles } from "oceanic.js";

class Button {
    constructor() {
        this.type = ComponentTypes.BUTTON;
        this.style = ButtonStyles.SECONDARY;
        this.customID = "";
        this.label = "";
        this.emoji = "";
        this.disabled = true;
    }

    setStyle(style) {
        this.style = style;
        return this;
    }

    setCustomID(customID) {
        this.customID = customID;
        return this;
    }

    setLabel(label) {
        this.label = label;
        return this;
    }

    setEmoji(emoji) {
        this.emoji = emoji;
        return this;
    }

    setDisabled(disabled) {
        this.disabled = disabled;
        return this;
    }

    build() {
        return {
            type: this.type,
            style: this.style,
            customID: this.customID,
            label: this.label,
            emoji: this.emoji,
            disabled: this.disabled
        }
    }
}

class ButtonSuccess extends Button {
    constructor(activated) {
        super();
        this.setStyle(activated);
    }

    setStyle(activated) {
        this.style = activated ? ButtonStyles.SUCCESS : ButtonStyles.SECONDARY;
        return this;
    }
}

class ButtonDanger extends Button {
    constructor(activated) {
        super();
        this.setStyle(activated);
    }

    setStyle(activated) {
        this.style = activated ? ButtonStyles.DANGER : ButtonStyles.SECONDARY;
        return this;
    }
}

const buttonStringEmoji = (string, emoji, customID, activated) => new ButtonSuccess(activated).setCustomID(customID).setLabel(string).setEmoji(emoji).build();
const buttonEmoji = (emoji, activated) => new ButtonSuccess(activated).setCustomID(emoji.name).setEmoji(emoji).build();
const buttonString = (string, activated) => new ButtonSuccess(activated).setCustomID(string).setLabel(string).build();
const buttonNo = (activated) => new ButtonDanger(activated).setCustomID("no").setLabel("no").build();
const buttonYes = (activated) => buttonString("yes", activated);

export { buttonStringEmoji, buttonEmoji, buttonString, buttonNo, buttonYes };