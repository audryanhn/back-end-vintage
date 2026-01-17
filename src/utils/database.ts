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

// import mongoose from "mongoose";
// import { DATABASE_URL } from "./env";

// mongoose
//   .connect(DATABASE_URL, { dbName: "vintage-back-end" })
//   .then(() => {
//     console.log("Succesfully connected to DB");
//   })
//   .catch((error) => {
//     console.log("Error occured while trying to connect to DB");
//     console.log(error);
//   });

//------------------ CARA KETIGA ------------------------

import mongoose from "mongoose";
import { DATABASE_URL } from "./env";

declare global {
  var mongoose: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function db() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      dbName: "vintage-back-end",
      bufferCommands: false,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(DATABASE_URL, opts)
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;

    throw e;
  }

  return cached.conn;
}

export default db;
