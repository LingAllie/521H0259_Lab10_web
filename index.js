require('dotenv').config()
const express = require('express')
const socketio = require('socket.io')

const app = express();
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/chat", (req, res) => {
  res.render("chat");
});

const PORT = process.env.PORT || 1050;
const httpServer = app.listen(PORT, () =>
  console.log("http://localhost:" + PORT)
);
const io = socketio(httpServer);

io.on("connection", (client) => {
  console.log(`Client ${client.id} connected`);

    client.on('disconnect', () => console.log(`${client.id} has left`))
})