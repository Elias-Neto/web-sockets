const socket = io()

const urlSearchParams = new URLSearchParams(window.location.search)
const username = urlSearchParams.get('username')
const room = urlSearchParams.get('select_room')

const insertMessageInChat = (message) => {
  const messageDiv = document.getElementById('chat')

  messageDiv.innerHTML += `
    <div class="message">
      <div class="usernameAndDate">
        <span class="username">${message.username}</span>
        <span class="time">${dayjs(message.createdAt).format('DD/MM/YYYY HH:mm')}</span>
      </div>
      <span class="text">${message.text}</span>
    </div>
  `
}

socket.emit('join', { username, room }, (response) => {
  response.forEach(message => {
    insertMessageInChat(message)
  })
})

const headerH2 = document.querySelector('.container.chat header h2')
headerH2.innerHTML = `Sala ${room} - ${username}`

document.getElementById('message').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const message = event.target.value
    event.target.value = ''

    const data = {
      username,
      room,
      text: message
    }

    socket.emit('message', data)
  }
})

socket.on('message', (data) => {
  insertMessageInChat(data)
})