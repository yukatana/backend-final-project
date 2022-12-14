const socket = io()

socket.on('connect', () => {
    console.log('Connected to Websocket')
})

socket.on('NEW_MESSAGE', msg => {
    console.log(msg)
    document.querySelector('#chatBox').append(`<p><b>${msg.username} - ${msg.type}</b> [${msg.dateString}]: ${msg.body}</p>`)
})

sendMessage = () => {
    const username = document.getElementById('email').value
    const body = document.getElementById('message').value
    const type = document.getElementById('type').value
    const date = new Date()
    const dateString = `${date.toLocaleString()}`
    socket.emit('POST_MESSAGE', {username, type, body, dateString})
}