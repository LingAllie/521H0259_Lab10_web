require('dotenv').config()
const { name } = require('ejs')
const express = require('express')
const socketio = require('socket.io')

const app = express()
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/chat', (req, res) => {
    res.render('chat')
})

const PORT = process.env.PORT || 1050
const httpServer = app.listen(PORT, () => console.log('http://localhost:' + PORT))
const io = socketio(httpServer)

io.on('connection', client => {
    console.log(`Client ${client.id} connected`);

    let users = Array.from(io.sockets.sockets.values())
        .map(socket => ({id: socket.id, name: socket.username}))
    console.log(users);

    client.on('disconnect', () => {
        console.log(`\t\t${client.id} has left`)

        //inform all remain users before we leave
        client.broadcast.emit('user-leave', client.id);
    })

    client.on('register-name', username => {
        client.username = username

        // send register information to all remained users
        client.broadcast.emit('register-name', {id: client.id, username: username})
    })

    //send list of users are online for new user
    client.emit('list-users', users)

    //send new user information for all previous users
    client.broadcast.emit('new-user', {id: client.id, name: client.name})

})