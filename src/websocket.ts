import { io } from './http'

interface User {
  socket_id: string
  username: string
  room: string
}

interface Message {
  username: string
  room: string
  text: string
  createdAt: Date
}

const users: User[] = []
const messages: Message[] = []

const fetchMessagesByRoom = (room: string) => {
  const messagesRoom = messages.filter(m => m.room === room)

  return messagesRoom
}

io.on('connect', (socket) => {
  console.log('✅ Client connected!', socket.id)

  socket.on('join', (params, callback) => {
    console.log(params)

    socket.join(params.room)

    const userInRoom = users.find((user) => user.username === params.username && user.room === params.room)

    if (userInRoom) {
      userInRoom.socket_id = socket.id
    } else {
      users.push({
        socket_id: socket.id,
        username: params.username,
        room: params.room
      })
    }

    const messagesRoom = fetchMessagesByRoom(params.room)
    callback(messagesRoom)
  })

  socket.on('message', (data) => {
    const message: Message = {
      username: data.username,
      room: data.room,
      text: data.text,
      createdAt: new Date()
    }

    messages.push(message)

    io.to(data.room).emit('message', message)
  })
})