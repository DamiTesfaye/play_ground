const express = require('express')
const app = express();


const port = 5000

app.get('/', (req, res) => {
    res.send('Logging fine')
})

app.listen(port, () => {
    console.log('Express web app on localhost:3000')
})
