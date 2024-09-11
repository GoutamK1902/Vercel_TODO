import express from "express";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// Connect to the database
pool
  .connect()
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.error("Connection error:", error.message));

// Initialize Express app
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true })); // Replaced bodyParser with express built-in parser
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const { rows: items } = await db.query(
      "SELECT * FROM items ORDER BY id ASC"
    );
    res.render("index.ejs", { listTitle: "Today", listItems: items });
  } catch (error) {
    console.error("Error fetching items:", error.message);
    res.status(500).send("Server error");
  }
});

app.post("/add", async (req, res) => {
  const { newItem: item } = req.body;
  if (req.body.newItem !== "") {
    try {
      await db.query("INSERT INTO items (task) VALUES ($1)", [item]);
      res.redirect("/");
    } catch (error) {
      console.error("Error adding item:", error.message);
      res.status(500).send("Server error");
    }
  } else {
    console.log("Task Cannot be empty! Atleast take a breath!");
    res.redirect("/");
  }
});

app.post("/edit", async (req, res) => {
  const { updatedItemTitle: item, updatedItemId: id } = req.body;
  try {
    await db.query("UPDATE items SET task = $1 WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (error) {
    console.error("Error editing item:", error.message);
    res.status(500).send("Server error");
  }
});

app.post("/delete", async (req, res) => {
  const { deleteItemId: id } = req.body;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting item:", error.message);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));

// import express from "express";
// import bodyParser from "body-parser";
// import pg from "pg";

// const db = new pg.Client({
//   user: "postgres",
//   host: "localhost",
//   database: "permalist",
//   password: "masterdev",
//   port: 5432,
// });

// try {
//   db.connect();
//   console.log("Connected to DB");
// } catch (error) {
//   console.log(error.message);
//   console.log(error.detail);
// }

// const app = express();
// const port = 3000;

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));

// let items = [];

// app.get("/", async (req, res) => {
//   try {
//     const result = await db.query("SELECT * FROM items ORDER BY id ASC");
//     items = result.rows;

//     res.render("index.ejs", {
//       listTitle: "Today",
//       listItems: items,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.post("/add", async (req, res) => {
//   const item = req.body.newItem;
//   try {
//     await db.query(
//       `
//     INSERT INTO items (task)
//     VALUES ($1)
//     `,
//       [item]
//     );
//     res.redirect("/");
//   } catch (error) {
//     console.log(error.message);
//     console.log(error.detail);
//   }
// });

// app.post("/edit", async (req, res) => {
//   const item = req.body.updatedItemTitle;
//   const id = req.body.updatedItemId;

//   try {
//     await db.query("UPDATE items SET task = ($1) WHERE id = $2", [item, id]);
//     res.redirect("/");
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.post("/delete", async (req, res) => {
//   const item = req.body.deleteItemId;
//   try {
//     const result = await db.query(
//       `
//     DELETE FROM items
//     WHERE id=($1)
//     `,
//       [item]
//     );
//     res.redirect("/");
//   } catch (error) {
//     console.log(error.message);
//     console.log(error.detail);
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
