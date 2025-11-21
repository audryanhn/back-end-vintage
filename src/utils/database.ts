//------------------ CARA KEDUA ------------------------

// import mongoose from "mongoose";
// import { DATABASE_URL } from "./env";

// const connect = async () => {
//   try {
//     await mongoose.connect(DATABASE_URL, { dbName: "vintage-back-end" });
//     return Promise.resolve("db connected successfully");
//   } catch (error) {
//     return Promise.reject(error);
//   }
// };

// export default connect;

//------------------ CARA PERTAMA ------------------------

import mongoose from "mongoose";
import { DATABASE_URL } from "./env";

mongoose
  .connect(DATABASE_URL, { dbName: "vintage-back-end" })
  .then(() => {
    console.log("Succesfully connected to DB");
  })
  .catch((error) => {
    console.log("Error occured while trying to connect to DB");
    console.log(error);
  });
