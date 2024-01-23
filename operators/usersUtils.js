export function usernameStar(location) {
    return ({
        data(user) {
            return `**${user.username}**`;
        },
        location
    });
}

export function usernameDash(location) {
    return ({
        data(user) {
            return `${user.username} —`;
        },
        location
    });
}

export function userMention(location) {
    return ({
        data(user) {
            return `${user.mention}`;
        },
        location
    });
}

export function usernameArena(location) {
    return ({
        data(user) {
            return `**players**: ${user.username}`;
        },
        location
    });
}

function statusTemplate({location, locationUser = null, userFn, process}) {
    return ({
        location,
        user: userFn(locationUser ?? location),
        process
    });
}

export function contentStarProcess(process) {
    return statusTemplate({location: "content", userFn: usernameStar, process});
}

export function authorDashProcess(location, process) {
    return statusTemplate({location, locationUser: "authorName", userFn: usernameDash, process});
}

export function contentMentionProcess(process) {
    return statusTemplate({location: "content", userFn: userMention, process});
}