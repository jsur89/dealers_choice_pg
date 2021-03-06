const { client, syncAndSeed } = require("./db");

//Here is where express fits in...
const express = require("express");
const path = require("path");
const app = express();

app.use("/assets", express.static(path.join(__dirname, "assets"))); //set up a stattic path

//configuring the express pipeline
app.get("/sport/:id", async (req, res, next) => {
  try {
    const promises = [
      client.query('SELECT * FROM "Sport" WHERE id=$1;', [req.params.id]),
      client.query('SELECT * FROM "Athlete" WHERE sport_id=$1;', [
        req.params.id,
      ]),
    ];

    const [sportsResponse, athletesResponse] = await Promise.all(promises);
    const sports = sportsResponse.rows[0];
    const athletes = athletesResponse.rows;

    response = await client.query(
      'SELECT * FROM "Athlete" WHERE sport_id=$1;',
      [req.params.id]
    ); //the response that we're getting from our Postgress Server.

    res.send(`
        <html>
            <head>
                <link rel='stylesheet' href='/assets/styles.css' />
            </head>
            <body>
                <h1>Cards World</h1>
                <h2><a href='/'>Sports</a>(${sports.name})</h2>
                <ul>
                ${athletes
                  .map(
                    (athlete) => `
                  <li>
                  ${athlete.name}
                  </li>
                  `
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
                <ul class="tooltip">
                    ${sports
                      .map(
                        (sport) => `
                        <li>
                        <a href='/sport/${sport.id}'>
                            ${sport.name}
                            </a>
                        </li>`
                      )
                      .join("")}
                      <span class="tooltiptext">Click Me</span>
                </ul>
            </body>
        </html>
    `);
  } catch (ex) {
    next(ex);
  }
});

const port = process.env.PORT || 3000; //set up a port...or if there is no port for us, choose port 3000

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
