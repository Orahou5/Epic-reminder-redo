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
            time_travel integer NOT NULL DEFAULT 0,
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
            dTime text NOT NULL,
            enabled integer NOT NULL DEFAULT 0,
            channel_id text NOT NULL,
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
});

db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Close the database connection.');
});