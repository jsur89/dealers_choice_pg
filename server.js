//Bring in the Postgress library
const pg = require("pg");

//Now, we want to create a postgress client
const client = new pg.Client("postgress://localhost/cards_db");

const syncAndSeed = async () => {
  const SQL = `
  DROP TABLE IF EXISTS "Sport";  
  CREATE TABLE "Sport" (
        id INTEGER PRIMARY KEY,
        name VARCHAR(100) NOT NULL
    );
    CREATE TABLE "Sport" (
        id INTEGER PRIMARY KEY,
        name VARCHAR(100) NOT NULL
    );
    INSERT INTO "Sport"(id,name) VALUES(1, 'Baseball');
    INSERT INTO "Sport"(id,name) VALUES(2, 'Football');
    INSERT INTO "Sport"(id,name) VALUES(3, 'Basketball');
    `;
  await client.query(SQL);
};

//connect to the client
const setUp = async () => {
  try {
    await client.connect();
    await syncAndSeed();
  } catch (ex) {
    console.log(ex);
  }
};
//You have to run setUp
setUp();
