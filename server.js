const pg = require("pg"); //Bring in the Postgress library

//Here is where express fits in...
const express = require("express");
const path = require("path");
const app = express();

app.use("/assets", express.static(path.join(__dirname, "assets"))); //set up a stattic path

//configuring the express pipeline
app.get("/", async (req, res, next) => {
  try {
    const response = await client.query('SELECT * FROM "Sport";'); //the response that we're getting from our Postgress Server.
    const sports = response.rows;
    res.send(`
        <html>
            <head>
                <link rel='stylesheet' href='/assets/styles.css' />
            </head>
            <body>
                <h1>Cards World</h1>
                <h2>Sports</h2>
                <ul>
                    ${sports
                      .map(
                        (sport) => `
                        <li>
                        <a href='/brands/${sports.id}'>
                            ${sport.name}
                            </a>
                        </li>`
                      )
                      .join("")}
                </ul>
            </body>
        </html>
    `);
  } catch (ex) {
    next(ex);
  }
});

const port = process.env.PORT || 3000; //set up a port...or if there is no port for us, choose port 3000

//Now, we want to create a postgress client
const client = new pg.Client("postgress://localhost/cards_db");

/*
below, "Sport" is the parent table and
"Athlete is the child table" We basically say that
an athlete belong to a sport. 
*/
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

//connect to the client
const setUp = async () => {
  try {
    await client.connect();
    await syncAndSeed();
    console.log("You are connected to the database.");
    app.listen(port, () => console.log(`Listening on port ${port}`)); //if successful, console log a text string
  } catch (ex) {
    console.log(ex);
  }
};
//You have to run setUp
setUp();
