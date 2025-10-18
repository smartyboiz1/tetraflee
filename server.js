import express from "express";
import path from "path";
import generate from "./api/suggest.js";

const app = express();
const PORT = process.env.PORT ||
5000;

app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json());

app.post("/api/suggest", generate);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

