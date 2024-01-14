
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
