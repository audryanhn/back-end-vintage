//---------------------------- CARA KEDUA KEDUA CONNECT DB-----------------------------
// import bodyParser from "body-parser";
// import express from "express";
// import router from "./routes/api";
// import db from "./utils/database";

// async function init() {
//   try {
//     const result = await db();
//     console.log("db connection result : ", result);

//     const app = express();
//     const PORT = 3000;

//     app.use(bodyParser.json());

//     app.use("/api", router);

//     app.listen(PORT, () => {
//       console.log(`Server is running on http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.log("error", error);
//   }
// }

// init();

// --------------------- CARA PERTAMA CONNECT DB ----------------------------

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import router from "./routes/api";
import "./utils/database";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res, next) => {
  res.status(200).json({ message: "Server Is Running" });
  next();
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
