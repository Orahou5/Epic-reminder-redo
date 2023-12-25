import { filterPending } from "../system/Pending.js";

export function resolve(msg) {
    const now = Date.now();

    filterPending(msg).forEach((pending) => {
        pending.resolve(msg, now);
    })
}