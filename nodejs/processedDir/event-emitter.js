const EventEmitter = require('events').EventEmitter;
const channel = new EventEmitter();

channel.on('join', (port, part, put, pit) => {
    console.log('connected', port, put, part, pit)
})

channel.emit('join', '2020', '2030', '2040', 2232);
