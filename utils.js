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

export function getCooldownFromMsg(msg, location) {
    const match = msg[location].match(/[^\n]+[^\*]+\*\*([^\*]+)/si)?.[1];
    if(match === undefined) return;
    const exchange = {
        s: "seconds",
        m: "minutes",
        h: "hours",
        d: "days",
    }
    const timeObj = match.split(" ").reduce((acc, curr) => {
        curr.slice(-1)
        parseInt(curr.slice(0, -1));

        acc[exchange[curr.slice(-1)]] = parseInt(curr.slice(0, -1));

        return acc;
        
    }, {});

    return convertToMilliseconds(timeObj);

}

export const dirLogCut = depth => item => console.dir(item, { depth: depth }) || item;

export const dirLog = dirLogCut(null);

export const dirLogMini = dirLogCut(1);

export function applyPercentage(baseValue, percentage){
    return baseValue - (baseValue * percentage / 100);
}

export function convertToMilliseconds({
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
}) {
    return milliseconds + 1000 * (seconds + 60 * (minutes + 60 * (hours + 24 * days)));
}

export function setOrMerge(object, property, value) {
    object[property] = {
        ...(object[property] ?? {}),
        ...value
    }
}

export function createAndSet(object, property, value) {
    if(object[property] === undefined) {
        object[property] = {};
    }

    object[property] = value;
}

//set all the path or append
export function setPath(object, path, value) {
    const [first, ...rest] = path;

    if(rest.length === 0) {
        object[first] = value;
        return;
    }

    if(object[first] === undefined) {
        object[first] = {};
    }

    setPath(object[first], rest, value);
}