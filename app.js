const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

const publicRoutes = require("./routes/public");

app.use("/", publicRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Public API Microservice is running on http://localhost:${port}`);
});
