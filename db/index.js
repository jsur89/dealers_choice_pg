const pg = require("pg");

const client = new pg.Client("postgress://localhost/cards_db");

const syncAndSeed = async () => {
  const SQL = `
  DROP TABLE IF EXISTS "Athlete";
  DROP TABLE IF EXISTS "Sport";
  CREATE TABLE "Sport" (
        id INTEGER PRIMARY KEY,
        name VARCHAR(100) NOT NULL
    );
    CREATE TABLE "Athlete" (
        id INTEGER PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        sport_id INTEGER REFERENCES "Sport"(id)
    );
    INSERT INTO "Sport"(id,name) VALUES(1, 'Baseball');
    INSERT INTO "Sport"(id,name) VALUES(2, 'Football');
    INSERT INTO "Sport"(id,name) VALUES(3, 'Basketball');
    INSERT INTO "Athlete"(id,name, sport_id) VALUES(1, 'David Wright', 1);
    INSERT INTO "Athlete"(id,name, sport_id) VALUES(2, 'Derek Jeter', 1);
    INSERT INTO "Athlete"(id,name, sport_id) VALUES(3, 'Dr. Fauci', 1);
    INSERT INTO "Athlete"(id,name, sport_id) VALUES(4, 'Pedro Martinez', 1);
    INSERT INTO "Athlete"(id,name, sport_id) VALUES(5, 'Randy Johnson', 1);
    INSERT INTO "Athlete"(id,name, sport_id) VALUES(6, 'Barry Sanders', 2);
    INSERT INTO "Athlete"(id,name, sport_id) VALUES(7, 'Peyton Manning', 2);
    INSERT INTO "Athlete"(id,name, sport_id) VALUES(8, 'Michael Irving', 2);
    INSERT INTO "Athlete"(id,name, sport_id) VALUES(9, 'Jason Kidd', 3);
    INSERT INTO "Athlete"(id,name, sport_id) VALUES(10, 'Scotty Pippen', 3);
    INSERT INTO "Athlete"(id,name, sport_id) VALUES(11, 'Karl Malone', 3);
    `;
  await client.query(SQL);
};
module.exports = {
  client,
  syncAndSeed,
};
