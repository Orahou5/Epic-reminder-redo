import { ComponentTypes } from "oceanic.js";

export function createComponentRow(components) {
    return {
        type: ComponentTypes.ACTION_ROW,
        components
    }
}