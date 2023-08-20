const path = require("path");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const urlencoded = require("body-parser").urlencoded;
const config = require("./config");
const voice = require("./routes/voice");

// check for connection string
if (!config.mongoUrl) {
  throw new Error("MONGO_URL env variable not set.");
}

var isConn;
// initialize MongoDB connection
if (mongoose.connections.length === 0) {
  mongoose.connect(config.mongoUrl);
} else {
  mongoose.connections.forEach(function (conn) {
    if (!conn.host) {
      isConn = false;
    }
  });

  if (isConn === false) {
    mongoose.connect(config.mongoUrl);
  }
}

// Create Express web app with some useful middleware
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(urlencoded({ extended: true }));
app.use(morgan("combined"));

// Twilio Webhook routes
app.post("/voice", voice.interview);
app.post("/voice/:responseId/transcribe/:questionIndex", voice.transcription);

module.exports = app;
