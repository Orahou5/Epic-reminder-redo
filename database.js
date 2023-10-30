import sqlite from "sqlite3";
sqlite.verbose();

let db = new sqlite.Database("reminder.db", (err) => {
  if (err) {
    console.log(err.message);
  }
  console.log("Connected to the reminder database.");
});

db.serialize(() => {
    // 1rst operation (run create table statement)
    const query = `
        CREATE TABLE IF NOT EXISTS Player(
            discord_id text PRIMARY KEY NOT NULL,
            username text NOT NULL,
            donor integer NOT NULL DEFAULT 0,
            maried_to text,
            time_travel integer NOT NULL DEFAULT 0
        )
    `;
    db.run(query, (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });

    const query2 = `
        CREATE TABLE IF NOT EXISTS Reminder(
            discord_id text NOT NULL,
            command_id text NOT NULL,
            dTime integer NOT NULL,
            time integer NOT NULL DEFAULT 0,
            enabled integer NOT NULL DEFAULT 0,
            channel_id text NOT NULL,
            message text NOT NULL DEFAULT "No Data",
            fixed_cd integer NOT NULL DEFAULT 0,
            PRIMARY KEY (discord_id, command_id),
            FOREIGN KEY (discord_id) 
                REFERENCES Player(discord_id)
                ON UPDATE CASCADE
                ON DELETE CASCADE
        )
    `;
    db.run(query2, (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });

    const query3 = `
        CREATE TABLE IF NOT EXISTS Cooldowns(
            command_id text PRIMARY KEY NOT NULL,
            reduction integer NOT NULL DEFAULT 0
        )
    `;
    db.run(query3, (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
});

export function getReminders(delay = 0) {
    return new Promise((resolve, reject) => {
        const now = Date.now();
        const subquery = `(SELECT reduction FROM Cooldowns WHERE Cooldowns.command_id = Reminder.command_id)`;
        const query = `
            SELECT  discord_id, 
                    command_id, 
                    channel_id, 
                    message,
                    CASE fixed_cd
                        WHEN 1 THEN dTime+time
                        ELSE dTime-dTime*${subquery}/100+time
                    END timer
            FROM Reminder
            WHERE enabled = 1
            AND timer - ? <= ?
            ORDER BY timer ASC
        `;
        db.all(query, [delay, now], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}

export function disableReminder(discord_id, command_id) {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE Reminder
            SET enabled = 0
            WHERE discord_id = ?
            AND command_id = ?
        `;
        db.run(query, [discord_id, command_id], (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

export function insertOrUpdateCooldown(command_id, reduction) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT OR REPLACE INTO Cooldowns(command_id, reduction)
            VALUES(?, ?)
        `;
        db.run(query, [command_id, reduction], (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

export function getCooldown(command_id) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT reduction FROM Cooldowns
            WHERE command_id = ?
        `;
        db.get(query, [command_id], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row.reduction);
        });
    });
}

export function insertReminder(reminder) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT OR REPLACE INTO Reminder(discord_id, command_id, dTime, time, enabled, channel_id, message, fixed_cd)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.run(query, [reminder.discord_id, reminder.command_id, reminder.dTime, reminder.time, true, reminder.channel_id, reminder.message, reminder.fixed_cd], (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

export function getPlayer(discord_id) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM Player WHERE discord_id = ?
        `;
        db.get(query, [discord_id], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row);
        });
    });
}

export function insertPlayer(player) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT OR REPLACE INTO Player(discord_id, username, donor, maried_to, time_travel)
            VALUES(?, ?, ?, ?, ?)
        `;
        db.run(query, [player.discord_id, player.username, player.donor, player.maried_to, player.time_travel], (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

export function deletePlayer(discord_id) {
    return new Promise((resolve, reject) => {
        const query = `
            DELETE FROM Player WHERE discord_id = ?
        `;
        db.run(query, [discord_id], (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

export function playerExists(discord_id) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT EXISTS(SELECT * FROM Player WHERE discord_id = ?) AS exist;
        `;
        db.get(query, [discord_id], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row.exist);
        });
    });
}

export function closeDatabase(followUp) {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
        followUp();
    });
}

