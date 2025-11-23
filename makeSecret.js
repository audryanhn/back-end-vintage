const crypto = require("crypto"); // libary bawaan node js udah ada dari sananya

const secret = crypto.randomBytes(16).toString("hex");

console.log(secret);
