export function showHoursMinutesSeconds(display = "mouchard", milliseconds = Date.now()){
    const date = new Date(milliseconds);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    console.log(`${display} : ${hour}h ${minutes}m ${seconds}s`)
}

export function escape(string){
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export const dirLogCut = depth => item => console.dir(item, { depth: depth }) || item;

export const dirLog = dirLogCut(null);

export const dirLogMini = dirLogCut(1);

export function applyPercentage(baseValue, percentage){
    return baseValue - (baseValue * percentage / 100);
}
