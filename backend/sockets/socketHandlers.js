const events = require("../events");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.emit("eventsList", events);

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};
