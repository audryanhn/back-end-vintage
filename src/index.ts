//---------------------------- CARA KEDUA KEDUA CONNECT DB-----------------------------
// import bodyParser from "body-parser";
// import cors from "cors";
// import express from "express";
// import docs from "./docs/docRoutes";
// import router from "./routes/api";
// import db from "./utils/database";

// async function init() {
//   try {
//     const result = await db();
//     console.log("db connection result : ", result);

//     const app = express();
//     const PORT = 3000;

//     app.use(bodyParser.json());
//     app.use(cors());

//     app.get("/", (req, res, next) => {
//       res.status(200).json({ status: "200 - server running properly" });
//     });

//     app.use("/api", router);
//     docs(app);

//     app.listen(PORT, () => {
//       console.log(`Server is running on http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.log("error", error);
//   }
// }

// init();

// --------------------- CARA PERTAMA CONNECT DB ----------------------------

// import bodyParser from "body-parser";
// import cors from "cors";
// import express from "express";
// import docs from "./docs/docRoutes";
// import router from "./routes/api";
// import "./utils/database";

// const app = express();
// const PORT = 3000;

// app.use(bodyParser.json());
// app.use(cors());

// app.get("/", (req, res, next) => {
//   res.status(200).json({ message: "Server Is Running" });
//   next();
// });

// app.use("/api", router);
// docs(app);

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

//---------------------------- CARA KEDUA KETIGA CONNECT DB-----------------------------

import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import docs from "./docs/docRoutes";
import router from "./routes/api";
import db from "./utils/database";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db();

    console.log(`DB Connection Status : ${result}`);

    next();
  } catch (error) {
    console.log("DB Connection error : ", error);
    return res.status(500).json({
      status: "500 - Internal Server Error",
      error: "db Connection failed",
    });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "200 - Server is Running properly" });
});

app.use("/api", router);
docs(app);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
