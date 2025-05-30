import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Book_Reviews",
  password: "123",
  port: 5432,
});

db.connect();

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books");
    const books_list = result.rows;
   // console.log(books_list);
        res.render("index.ejs", {
        books: books_list,
        title: "Book Reviews"
    });
  } catch (err) {
    console.error("Error loading items:", err);
    res.status(500).send("Error loading items.");
  }
});

app.get("/books/new", async (req, res) => {
  try {
    res.render("new.ejs", { title: "Add Book Review" });
  } catch (err) {
    console.error("Error loading page:", err);
    res.status(500).send("Error loading page.");
  }
});

app.post("/books", async (req, res) => {
  try {
    console.log(req.body);
     const newRating = req.body.rating;
     const newReview = req.body.review;
     const newTitle = req.body.title;
     const newIsbn = req.body.isbn; 
    if (newRating && newReview && newTitle && newIsbn?.trim()) {
      await db.query("INSERT INTO books (rating,book_name,isbn_code,review) VALUES ($1,$2,$3,$4)", [newRating, newTitle, newIsbn, newReview]);
    }
    res.redirect("/");
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).send("Error adding item.");
  }
});

app.get("/books/:id/edit", async (req, res) => {
  const bookId = req.params.id;
  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1", [bookId]);
    const book = result.rows[0];
   // console.log(book);
    if (!book) {
      return res.status(404).send("Libro no encontrado.");
    }
    res.render("edit.ejs", { book , title: "Book Review"}); 
  } catch (err) {
    console.error("Error al cargar el libro:", err);
    res.status(500).send("Error al cargar el libro.");
  }
});

app.post("/books/:id/edit", async (req, res) => {
  const bookId = req.params.id;
  const updateRating = req.body.rating;
  const updateReview = req.body.review;
  const updateTitle = req.body.title;
  console.log(req.body);
  try {
    console.log(updateRating, updateReview, updateTitle);
    if (updateRating && updateTitle && updateReview?.trim()) {
      await db.query(
        "UPDATE books SET rating = $1, book_name = $2, review = $3  WHERE id = $4",
        [updateRating, updateTitle, updateReview, bookId]
      );
    }
    res.redirect("/");
  } catch (err) {
    console.error("Error editing item:", err);
    res.status(500).send("Error editing item.");
  }
});

app.post("/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    if (bookId) {
      await db.query("DELETE FROM books WHERE id = $1", [bookId]);
    }
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).send("Error deleting item.");
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});