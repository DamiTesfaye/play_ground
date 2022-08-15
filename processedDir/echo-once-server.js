const net = require('net')
const port = 5000

const server = net.createServer(socket => {
    socket.once('data', data => {
        socket.write(data)
    })
})

server.listen(5000, () => {
    console.log('listening on 5000')
})
