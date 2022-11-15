import express from 'express'
import path from 'path'
import http from 'http'
import { fileURLToPath } from 'url'
import {Server} from 'socket.io'
import filter from 'bad-words'
import { GenerateMessage, generateLocation } from './utils/message.js'
import { addUser, removeUser, getUser, getUserInRoom } from './utils/user.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const port = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = new  Server(server)

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket)=>{
    console.log('WebSocket Connected');

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', GenerateMessage('Welcome!'))
        socket.broadcast.to(user.room).emit('message', GenerateMessage(`${user.username} has joined!`))

        callback()
    })

        socket.on('sendMessage', (message, callback)=>{
            console.log(message);
            const fil = new filter()
            if(fil.isProfane(message)){
                return callback('Profanity is not allowed')
            }
            io.emit('message',GenerateMessage (message))
            callback()
        })

        socket.on('sendLocation', (coords,callback)=>{
            io.emit('sendPosition',generateLocation(`http://google.com/maps?q=${coords.lat},${coords.lon}`))
            callback()
        })

        socket.on('disconnect', ()=>{
            io.emit('message', GenerateMessage('A user has left'))
        })
   
})

server.listen(port, ()=>{
    console.log('sever is up port ' + port);
})