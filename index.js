const app = require("./app");
const config = require("./config");
const http = require("http");

// Create HTTP server and mount Express app
const server = http.createServer(app);
server.listen(config.port, function () {
  console.log("Express server started on *:" + config.port);
});
